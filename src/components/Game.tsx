import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

import { GameState, Coordinates, Color } from '../types';
import { getPotentialMoves } from '../moves';
import { Turn } from './Turn';
import { YouAre } from './YouAre';
import { CellComponent } from './Cell';

export function Game(props: { gameState: GameState; color: Color }) {
    const [gameState, setGameState] = React.useState<GameState>(props.gameState);
    const [potentialMoves, setPotentialMoves] = useState<Coordinates[]>([]);

    let baseColor = Color.white;

    useEffect(() => {
        if (!gameState.activeCoordinates) {
            setPotentialMoves([]);
            return;
        }

        setPotentialMoves(getPotentialMoves(gameState, props.color));
    }, [gameState, props.color]);

    const socket = React.useRef(io(`http://localhost:8000/namespace/${gameState.gameId}`));
    useEffect(() => {
        socket.current.on('updateGame', (gameState: GameState) => {
            setGameState(gameState);
        });
    }, []);

    return (
        <div>
            <Turn turn={gameState.turn} />
            <YouAre color={props.color} />
            <div style={getBoardStyles(props.color)}>
                {gameState.boardState.map((r, i) => {
                    baseColor = baseColor === Color.white ? Color.black : Color.white;
                    return (
                        <div style={rowStyles}>
                            {r.map((c, j) => {
                                baseColor = baseColor === Color.white ? Color.black : Color.white;
                                return (
                                    <CellComponent
                                        key={i.toString().concat(j.toString())}
                                        cell={c}
                                        coordinates={{ row: i, column: j }}
                                        potentialMoves={potentialMoves}
                                        color={props.color}
                                        gameState={gameState}
                                        setGameState={setGameState}
                                        baseColor={baseColor}
                                        socket={socket}
                                    />
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

const getBoardStyles = (color: Color): React.CSSProperties => ({
    display: 'table',
    tableLayout: 'fixed',
    borderSpacing: '3px',
    borderCollapse: 'separate',
    transform: color === Color.black ? 'rotate(180deg)' : 'none',
});

const rowStyles: React.CSSProperties = {
    display: 'table-row',
};
