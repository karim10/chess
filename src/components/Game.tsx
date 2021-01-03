import React, { CSSProperties, useEffect, useState } from 'react';
import { isEqual } from 'lodash';

import { GameState, Cell, Coordinates, Color, Piece } from '../types';
import { getPotentialMoves } from '../moves';

export function Game(props: GameState) {
    // useReducer instead
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
            <Turn turn={gameState.turn} />
            <div style={boardStyles}>
                {gameState.boardState.map((r, i) => {
                    baseColor = baseColor === Color.white ? Color.black : Color.white;

                    return <div style={rowStyles}> {r.map((c, j) => {
                        baseColor = baseColor === Color.white ? Color.black : Color.white;
                        return (
                            //<div style={{ display: 'table-cell', padding: '0px !important' }}>
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
                            // </div>
                        );
                    })} </div>;
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
    const { cell, coordinates, potentialMoves, setGameState, gameState, baseColor } = props;

    const { activeCoordinates } = gameState;
    const isActiveCell = isEqual(activeCoordinates, coordinates);
    const isPotentialMove = potentialMoves.find(potentialMove => isEqual(potentialMove, coordinates)) !== undefined;

    const onCellClickHandler = () => {
        const newGameState = { ...gameState };

        newGameState.activeCoordinates = coordinates;

        if (cell.empty) {
            newGameState.activeCoordinates = undefined;
        }

        if (!cell.empty && cell.color !== gameState.turn) {
            newGameState.activeCoordinates = undefined;
        }

        if (isActiveCell) {
            newGameState.activeCoordinates = undefined;
        }

        // move piece
        if (activeCoordinates && isPotentialMove) {
            newGameState.boardState[coordinates.row][coordinates.column] =
                newGameState.boardState[activeCoordinates.row][activeCoordinates.column];
            newGameState.boardState[activeCoordinates.row][activeCoordinates.column] = { empty: true };

            newGameState.turn = gameState.turn === Color.black ? Color.white : Color.black;

            if (!cell.empty) {
                newGameState.eatenPieces.push(newGameState.boardState[coordinates.row][coordinates.column]);
            }

            newGameState.activeCoordinates = undefined;
        }

        setGameState(newGameState);
    };

    return (
        <div style={getCellStyles(isActiveCell, baseColor)} onClick={onCellClickHandler}>
            <div style={centeredDivStyles}>
                {isPotentialMove ? <div style={getPotentialStyles(cell.empty)} /> : null}
                {!cell.empty ? (
                    <img
                        src={`../chess_icons/${cell.piece}_${cell.color}.svg`}
                        alt={`${cell.piece}_${cell.color}`}
                        style={{ zIndex: 1, position: 'absolute' }}
                    />
                ) : null}
            </div>
        </div>
    );
});

const getPotentialStyles = (empty: boolean): React.CSSProperties => ({
    height: empty ? '25px' : '50px',
    width: empty ? '25px' : '50px',
    backgroundColor: '#bbb',
    borderRadius: '50%',
    display: 'inline-block',
    position: 'absolute',
});

const boardStyles: React.CSSProperties = {
    display: 'table',
    tableLayout: 'fixed',
    borderSpacing: '3px',
    borderCollapse: 'separate'
};

const rowStyles: React.CSSProperties = {
    display: 'table-row',
};

const getCellStyles = (isActiveCell: boolean, baseColor: Color): React.CSSProperties => ({
    height: '70px',
    width: '70px',
    border: 'solid 1px',
    cursor: 'pointer',
    backgroundColor: isActiveCell ? '#EDFF6B' : baseColor === Color.black ? '#65A259' : '#EBF4D2',
    display: 'table-cell'
});

const centeredDivStyles: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%'
}

function Turn(props: { turn: Color }) {
    return (
        <div style={{ fontSize: '16px', position: 'absolute', top: 20, left: 200, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
            Turn <img src={`../chess_icons/${Piece.Pawn}_${props.turn}.svg`} alt='turn' style={{ paddingLeft: 25, paddingBottom: 5 }} />
        </div>
    )
}
