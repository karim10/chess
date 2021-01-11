import React from 'react';
import { useHistory } from 'react-router-dom';

export function Home() {
    const history = useHistory();
    const createGame = React.useCallback(async () => {
        const response = await fetch(`/create-room`, {
            method: 'POST',
        });
        const body = await response.json();
        history.push(`/game/${body.gameId}`);
        window.sessionStorage.setItem('color', 'white');
    }, [history]);

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '450px',
                justifyContent: 'space-between',
            }}
        >
            <img src={'../chess_icons/chess_home.svg'} alt="home" style={imgStyles} />
            <button onClick={createGame} style={createButtonStyles}>
                {' '}
                Create Game{' '}
            </button>
        </div>
    );
}

const createButtonStyles: React.CSSProperties = {
    width: '200px',
    height: '50px',
    backgroundColor: '#65A259',
    color: 'white',
    fontSize: '18px',
    fontWeight: 'bold',
    border: '1px solid black',
    borderRadius: '3px',
    cursor: 'pointer',
};

const imgStyles: React.CSSProperties = {
    height: '300px',
    width: '300px',
    animation: 'bubble 1.0s forwards',
    animationName: 'slides',
    animationDuration: '2s',
};
