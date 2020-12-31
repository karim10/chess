import { Cell, Coordinates, BoardState, Piece, Color } from "./types";

export function getPotentialMoves(activeCell: Cell, activeCellCoordinates: Coordinates, isFirstRound: boolean, boardState: BoardState): Coordinates[] {
    if (activeCell.empty) {
        return [];
    }

    const { row, column } = activeCellCoordinates;
    const potentialMoves: Coordinates[] = [];
    if (activeCell.piece === Piece.King) {
        potentialMoves.push({ row: row - 1, column });
        potentialMoves.push({ row: row + 1, column });
        potentialMoves.push({ row, column: column + 1 });
        potentialMoves.push({ row, column: column - 1 });
    }

    if (activeCell.piece === Piece.Knight) {
        potentialMoves.push({ row: row - 2, column: column - 1 })
        potentialMoves.push({ row: row - 2, column: column + 1 })
        potentialMoves.push({ row: row + 2, column: column - 1 })
        potentialMoves.push({ row: row + 2, column: column + 1 })
    }

    if (activeCell.piece === Piece.Pawn) {
        if (activeCell.color === Color.black) {
            potentialMoves.push({ row: row + 1, column: column });
        }

        if (activeCell.color === Color.white) {
            potentialMoves.push({ row: row - 1, column: column });
        }
    }

    if (activeCell.piece === Piece.Bishop) {
        for (let i = 0; i < 8; i++) {
            potentialMoves.push({ row: row + i, column: column + i });
            potentialMoves.push({ row: row + i, column: column - i });
            potentialMoves.push({ row: row - i, column: column + i });
            potentialMoves.push({ row: row - i, column: column - i });

        }
    }

    if (activeCell.piece === Piece.Rook) {
        for (let i = 0; i < 8; i++) {
            potentialMoves.push({ row: row + i, column });
            potentialMoves.push({ row: row - i, column });
            potentialMoves.push({ row, column: column + i });
            potentialMoves.push({ row, column: column - i });
        }
    }

    if (activeCell.piece === Piece.Queen) {
        for (let i = 0; i < 8; i++) {
            potentialMoves.push({ row: row + i, column: column + i });
            potentialMoves.push({ row: row + i, column: column - i });
            potentialMoves.push({ row: row - i, column: column + i });
            potentialMoves.push({ row: row - i, column: column - i });
            potentialMoves.push({ row: row + i, column });
            potentialMoves.push({ row: row - i, column });
            potentialMoves.push({ row, column: column + i });
            potentialMoves.push({ row, column: column - i });

        }
    }

    return potentialMoves.filter(potentialMove => potentialMove.row > -1 && potentialMove.column > -1);
}