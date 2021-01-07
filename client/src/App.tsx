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
            const response = await fetch(`http://localhost:8000/get-game-state/${gameId}`);
            const body = await response.json();
            const storedColor = window.sessionStorage.getItem('color');

            if (!storedColor) {
                window.sessionStorage.setItem('color', 'black');
                setColor(Color.black);
            }
            setGameState(body);
        };
        fetchGameState();
    }, [gameId]);

    return (
        <div>{gameState ? <Game gameState={gameState} color={color} /> : <LoadingSpinner />}</div>
    );
}

function LoadingSpinner() {
    return <div>Loading ...</div>;
}

const appStyles = {
    height: '100vh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
};

export default App;
