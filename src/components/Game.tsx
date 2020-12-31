import React, { useEffect, useState } from 'react';
import { isEqual } from 'lodash';

import { GameState, Cell, Coordinates, Color } from '../types';
import { getPotentialMoves } from '../moves';

export function Game(props: GameState) {
    const { boardState, activeCoordinates, turn, isFirstRound } = props;
    const [activeCellCoordinates, setActiveCellCoordinates] = useState<Coordinates | undefined>(activeCoordinates);
    const [potentialMoves, setPotentialMoves] = useState<Coordinates[]>([]);
    const color = window.sessionStorage.getItem('color') as Color;

    useEffect(() => {
        if (!activeCellCoordinates) {
            setPotentialMoves([]);
            return;
        }

        const activeCell = boardState[activeCellCoordinates.row][activeCellCoordinates.column];
        setPotentialMoves(getPotentialMoves(activeCell, activeCellCoordinates, isFirstRound, boardState));
    }, [activeCellCoordinates, boardState, isFirstRound])

    return (
        <div style={boardStyles}>
            {boardState.map((r, i) => (
                r.map((c, j) => (
                    <CellComponentMemo cell={c}
                        key={i.toString().concat(j.toString())}
                        coordinates={{ row: i, column: j }}
                        setActiveCellCoordinates={setActiveCellCoordinates}
                        activeCellCoordinates={activeCellCoordinates}
                        potentialMoves={potentialMoves}
                        color={color}
                        turn={turn}
                    />
                ))
            ))}
        </div>
    )
}

interface CellComponentProps {
    cell: Cell;
    coordinates: Coordinates;
    setActiveCellCoordinates: React.Dispatch<React.SetStateAction<Coordinates | undefined>>;
    activeCellCoordinates?: Coordinates;
    potentialMoves: Coordinates[];
    color: Color;
    turn: Color;
}

const CellComponentMemo = React.memo(function CellComponent(props: CellComponentProps) {
    const { cell, coordinates, setActiveCellCoordinates, activeCellCoordinates, potentialMoves, color, turn } = props;
    const isActiveCell = isEqual(activeCellCoordinates, coordinates);
    const isPotentialMove = potentialMoves.find(potentialMove => isEqual(potentialMove, coordinates)) !== undefined;
    const setActiveCellCoordinatesHandler = () => {
        if (turn !== color || cell.empty) {
            return;
        }

        if (cell.empty || cell.color !== color || isActiveCell) {
            setActiveCellCoordinates(undefined);
        } else {
            setActiveCellCoordinates(coordinates);
        }
    }

    return <div style={getCellStyles(isActiveCell, isPotentialMove)} onClick={setActiveCellCoordinatesHandler}>
        {cell.empty ? '' : cell.piece + ' and color ' + cell.color}
    </div>
});

const boardStyles: React.CSSProperties = {
    height: '600px',
    width: '600px',
    border: 'solid 1px',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap'
}

const getCellStyles = (isActiveCell: boolean, isPotentialMove: boolean): React.CSSProperties => (
    {
        width: '70px',
        height: '70px',
        border: 'solid 1px',
        cursor: 'pointer',
        backgroundColor: isActiveCell ? 'red' : isPotentialMove ? 'blue' : 'white'
    }
)