import React from 'react';

import { Color, GameState } from './types';
import { Game } from './components/Game';
import { BrowserRouter, Route, Switch, useParams } from 'react-router-dom';
import { Home } from './components/Home';

function App() {
    return (
        <div style={appStyles}>
            <BrowserRouter>
                <Switch>
                    <Route path="/game/:gameId">
                        <GameWrapper />
                    </Route>
                    <Route path="/">
                        <Home />
                    </Route>
                </Switch>
            </BrowserRouter>
        </div>
    );
}

function GameWrapper() {
    const { gameId } = useParams<{ gameId: string }>();
    const [gameState, setGameState] = React.useState<GameState | undefined>();
    const [color, setColor] = React.useState<Color>(Color.white);

    React.useEffect(() => {
        const fetchGameState = async () => {
            const response = await fetch(`/get-game-state/${gameId}`);
            const body = await response.json();
            const storedColor = window.sessionStorage.getItem(gameId);

            if (!storedColor) {
                window.sessionStorage.setItem(gameId, 'black');
                setColor(Color.black);
            }
            setGameState(body);
        };
        fetchGameState();
    }, [gameId]);

    return gameState ? <Game gameState={gameState} color={color} /> : <LoadingSpinner />;
}

function LoadingSpinner() {
    return <div className="loader"></div>;
}

const appStyles = {
    height: '100vh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
};

export default App;
