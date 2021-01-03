import React, { useEffect, useState } from 'react';
import { isEqual } from 'lodash';

import { GameState, Cell, Coordinates, Color } from '../types';
import { getPotentialMoves } from '../moves';
import '../chess_icons/knight_black.svg';

export function Game(props: GameState) {
    const [gameState, setGameState] = React.useState<GameState>(props);
    const [potentialMoves, setPotentialMoves] = useState<Coordinates[]>([]);
    const color = window.sessionStorage.getItem('color') as Color;
    let baseColor = Color.white;

    useEffect(() => {
        if (!gameState.activeCoordinates) {
            setPotentialMoves([]);
            return;
        }

        setPotentialMoves(getPotentialMoves(gameState));
    }, [gameState.activeCoordinates]);

    return (
        <div>
            Turn: {gameState.turn};
            <div style={boardStyles}>
                {gameState.boardState.map((r, i) => {
                    baseColor = baseColor === Color.white ? Color.black : Color.white;
                    return r.map((c, j) => {
                        baseColor = baseColor === Color.white ? Color.black : Color.white;
                        return (
                            <CellComponentMemo
                                key={i.toString().concat(j.toString())}
                                cell={c}
                                coordinates={{ row: i, column: j }}
                                potentialMoves={potentialMoves}
                                color={color}
                                gameState={gameState}
                                setGameState={setGameState}
                                baseColor={baseColor}
                            />
                        );
                    });
                })}
            </div>
        </div>
    );
}
interface CellComponentProps {
    cell: Cell;
    coordinates: Coordinates;
    potentialMoves: Coordinates[];
    color: Color;
    gameState: GameState;
    setGameState: React.Dispatch<React.SetStateAction<GameState>>;
    baseColor: Color;
}

const CellComponentMemo = React.memo(function CellComponent(props: CellComponentProps) {
    const { cell, coordinates, potentialMoves, color, setGameState, gameState, baseColor } = props;

    const { activeCoordinates } = gameState;
    const isActiveCell = isEqual(activeCoordinates, coordinates);
    const isPotentialMove = potentialMoves.find(potentialMove => isEqual(potentialMove, coordinates)) !== undefined;

    // BIG REFACTORING
    const onCellClickHandler = () => {
        const newGameState = { ...gameState };
        if (!cell.empty && cell.color !== gameState.turn) {
            return;
        }

        if (activeCoordinates && isPotentialMove) {
            if (!cell.empty && cell.color === color) {
                newGameState.activeCoordinates = undefined;
                setGameState(newGameState);
                return;
            }

            // move piece
            newGameState.boardState[coordinates.row][coordinates.column] =
                newGameState.boardState[activeCoordinates.row][activeCoordinates.column];
            newGameState.boardState[activeCoordinates.row][activeCoordinates.column] = { empty: true };

            newGameState.turn = gameState.turn === Color.black ? Color.white : Color.black;

            if (!cell.empty) {
                newGameState.eatenPieces.push(newGameState.boardState[coordinates.row][coordinates.column]);
            }

            newGameState.activeCoordinates = undefined;
            setGameState(newGameState);
            return;
        }

        if (cell.empty || /* cell.color !== color || */ isActiveCell) {
            newGameState.activeCoordinates = undefined;
        } else {
            newGameState.activeCoordinates = coordinates;
        }

        setGameState(newGameState);
    };

    return (
        <div style={getCellStyles(isActiveCell, baseColor)} onClick={onCellClickHandler}>
            {isPotentialMove ? <div style={dotStyles} /> : null}
            {!cell.empty ? (
                <img src={`../chess_icons/${cell.piece}_${cell.color}.svg`} alt={`${cell.piece}_${cell.color}`} />
            ) : null}
        </div>
    );
});

const dotStyles: React.CSSProperties = {
    height: '25px',
    width: '25px',
    backgroundColor: '#bbb',
    borderRadius: '50%',
    display: 'inline-block',
    position: 'absolute',
};

const boardStyles: React.CSSProperties = {
    height: '600px',
    width: '600px',
    border: 'solid 1px',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
};

const getCellStyles = (isActiveCell: boolean, baseColor: Color): React.CSSProperties => ({
    width: '70px',
    height: '70px',
    border: 'solid 1px',
    cursor: 'pointer',
    backgroundColor: isActiveCell ? '#EDFF6B' : baseColor === Color.black ? '#65A259' : '#EBF4D2',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
});
