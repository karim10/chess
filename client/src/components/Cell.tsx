import { isEqual } from 'lodash';
import React from 'react';
import { sound } from '../Sound';
import { Cell, Coordinates, Color, GameState } from '../types';
import { CenteredDiv } from './CenteredDiv';

export interface CellComponentProps {
    cell: Cell;
    coordinates: Coordinates;
    potentialMoves: Coordinates[];
    color: Color;
    gameState: GameState;
    setGameState: React.Dispatch<React.SetStateAction<GameState>>;
    baseColor: Color;
    socket: React.MutableRefObject<SocketIOClient.Socket>;
}

export const CellComponent = React.memo(function (props: CellComponentProps) {
    const {
        cell,
        coordinates,
        potentialMoves,
        setGameState,
        gameState,
        baseColor,
        color,
        socket,
    } = props;

    const { activeCoordinates } = gameState;
    const isActiveCell = isEqual(activeCoordinates, coordinates);
    const isPotentialMove =
        potentialMoves.find(potentialMove => isEqual(potentialMove, coordinates)) !== undefined;

    const onCellClickHandler = () => {
        const newGameState = { ...gameState };

        newGameState.activeCoordinates = coordinates;

        if (cell.empty || isActiveCell || cell.color !== color) {
            newGameState.activeCoordinates = undefined;
        }

        // move piece
        if (activeCoordinates && isPotentialMove) {
            if (color !== gameState.turn) {
                newGameState.activeCoordinates = undefined;
                setGameState(newGameState);
                return;
            }

            newGameState.boardState[coordinates.row][coordinates.column] =
                newGameState.boardState[activeCoordinates.row][activeCoordinates.column];
            newGameState.boardState[activeCoordinates.row][activeCoordinates.column] = {
                empty: true,
            };

            newGameState.turn = gameState.turn === Color.black ? Color.white : Color.black;

            if (!cell.empty) {
                newGameState.eatenPieces.push(
                    newGameState.boardState[coordinates.row][coordinates.column]
                );
            }

            newGameState.activeCoordinates = undefined;
            socket.current.emit('onUpdateGame', newGameState);
            sound.play();
        }

        setGameState(newGameState);
    };

    return (
        <div style={getCellStyles(isActiveCell, baseColor)} onClick={onCellClickHandler}>
            <CenteredDiv>
                {isPotentialMove ? <div style={getPotentialStyles(cell.empty)} /> : null}
                {!cell.empty ? (
                    <img
                        src={`../chess_icons/${cell.piece}_${cell.color}.svg`}
                        alt={`${cell.piece}_${cell.color}`}
                        style={{
                            zIndex: 1,
                            position: 'absolute',
                            transform: color === Color.black ? 'rotate(180deg)' : 'none',
                        }}
                    />
                ) : null}
            </CenteredDiv>
        </div>
    );
});

const getCellStyles = (isActiveCell: boolean, baseColor: Color): React.CSSProperties => ({
    display: 'table-cell',
    height: '70px',
    width: '70px',
    border: 'solid 1px',
    cursor: 'pointer',
    backgroundColor: isActiveCell ? '#EDFF6B' : baseColor === Color.black ? '#65A259' : '#EBF4D2',
});

const getPotentialStyles = (empty: boolean): React.CSSProperties => ({
    height: empty ? '25px' : '50px',
    width: empty ? '25px' : '50px',
    backgroundColor: '#bbb',
    borderRadius: '50%',
    display: 'inline-block',
    position: 'absolute',
});
