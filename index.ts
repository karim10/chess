import express from 'express';
import Http from 'http';
import path from 'path';
import { Color, GameState, initialBoardState } from './client/src/types';

const app = express();
const http = Http.createServer(app);

// cors
const io = require("socket.io")(http, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    }
});

app.use(function (_req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.static(path.join(__dirname, './client/build')));

let games: GameState[] = [];
const socketNamespaces: { gameId: string; nsp: SocketIO.Namespace }[] = [];

app.post('/create-room', function (req: express.Request, res: express.Response) {
    const gameId = s4();
    games.push({
        gameId,
        boardState: initialBoardState,
        isFirstRound: true,
        turn: Color.white,
        eatenPieces: [],
    });

    addSocketNamespace(gameId);
    return res.json({ gameId });
});

app.get('/get-game-state/:gameId', function (req: express.Request, res: express.Response) {
    const gameId = req.params.gameId;
    const game = games.find(g => {
        return g.gameId === gameId;
    });
    if (!game) {
        res.status(404).send('Game not found');
    }
    res.json(game);
});

app.get('*', (req: express.Request, res: express.Response) => {
    res.sendFile(path.join(__dirname, './client/build', 'index.html'));
});

const port = process.env.PORT || 8000;

http.listen(port, () => {
    console.log(`listening on port ${port}`);
});

//helpers
function addSocketNamespace(gameId: string) {
    const nsp = io.of(`/namespace/${gameId}`);
    nsp.on('connection', function (socket: any) {
        socket.on('onUpdateGame', (gameState: GameState) => {
            games = games.map(g => {
                if (g.gameId === gameId) {
                    return gameState;
                }
                return g;
            });
            socket.broadcast.emit('updateGame', gameState);
        });
    });
    socketNamespaces.push({
        gameId,
        nsp,
    });
}

function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
}
