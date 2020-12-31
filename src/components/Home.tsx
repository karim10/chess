import React from 'react';
import { useHistory } from 'react-router-dom';

export function Home() {
    const history = useHistory();
    const createGame = React.useCallback(async () => {
        const response = await fetch('http://localhost:8000/create-room', {
            method: 'POST',
        });
        const body = await response.json();
        history.push(`/game/${body.gameId}`);
        window.sessionStorage.setItem('color', 'white');
    }, [history]);

    return (
        <div>
            <button onClick={createGame}> Create Game </button>
        </div>
    );
}
