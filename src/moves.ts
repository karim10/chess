import { Coordinates, Piece, Color, GameState } from './types';

export function getPotentialMoves(gameState: GameState): Coordinates[] {
    if (!gameState.activeCoordinates) {
        return [];
    }

    const { row, column } = gameState.activeCoordinates;

    const cell = gameState.boardState[row][column];
    if (cell.empty) {
        return [];
    }

    const potentialMovesByAxis = getAxis(row, column, gameState);

    if (cell.piece === Piece.Queen) {
        return potentialMovesByAxis.diagonal.concat(potentialMovesByAxis.orthogonal);
    }

    if (cell.piece === Piece.Bishop) {
        return potentialMovesByAxis.diagonal;
    }

    if (cell.piece === Piece.Rook) {
        return potentialMovesByAxis.orthogonal;
    }

    if (cell.piece === Piece.King) {
        return potentialMovesByAxis.diagonal_1.concat(potentialMovesByAxis.orthogonal_1);
    }

    const potentialMoves = new Axis(gameState);
    if (cell.piece === Piece.Pawn) {
        const firstPawnMove = row === 1 || row === 6 ? true : false;
        if (cell.color === Color.black) {
            potentialMoves.push_cell({ row: row + 1, column: column });
            if (firstPawnMove) {
                potentialMoves.push_cell({ row: row + 2, column: column });
            }

            // black pawn attacking diagonal
            const blackPawnDigonalLeft =
                potentialMovesByAxis.diagonal_1[2] && gameState.boardState[potentialMovesByAxis.diagonal_1[2].row][potentialMovesByAxis.diagonal_1[2].column];
            const blackPawnDigonalRight =
                potentialMovesByAxis.diagonal_1[3] && gameState.boardState[potentialMovesByAxis.diagonal_1[3].row][potentialMovesByAxis.diagonal_1[3].column];
            if (blackPawnDigonalLeft && !blackPawnDigonalLeft.empty && blackPawnDigonalLeft.color === Color.white) {
                potentialMoves.push_cell(potentialMovesByAxis.diagonal_1[2]);
            }

            if (blackPawnDigonalRight && !blackPawnDigonalRight.empty) {
                potentialMoves.push_cell(potentialMovesByAxis.diagonal_1[3]);
            }
        }

        if (cell.color === Color.white) {
            potentialMoves.push({ row: row - 1, column: column });
            if (firstPawnMove) {
                potentialMoves.push_cell({ row: row - 2, column: column });
            }

            // white pawn attacking diagonal
            const whitePawnDigonalLeft =
                potentialMovesByAxis.diagonal_1[0] && gameState.boardState[potentialMovesByAxis.diagonal_1[0].row][potentialMovesByAxis.diagonal_1[0].column];
            const whitePawnDigonalRight =
                potentialMovesByAxis.diagonal_1[1] && gameState.boardState[potentialMovesByAxis.diagonal_1[1].row][potentialMovesByAxis.diagonal_1[1].column];
            if (whitePawnDigonalLeft && !whitePawnDigonalLeft.empty) {
                potentialMoves.push_cell(potentialMovesByAxis.diagonal_1[0]);
            }

            if (whitePawnDigonalRight && !whitePawnDigonalRight.empty) {
                potentialMoves.push_cell(potentialMovesByAxis.diagonal_1[1]);
            }
        }
    }

    if (cell.piece === Piece.Knight) {
        potentialMoves.push_cell({ row: row - 2, column: column - 1 });
        potentialMoves.push_cell({ row: row - 2, column: column + 1 });
        potentialMoves.push_cell({ row: row + 2, column: column - 1 });
        potentialMoves.push_cell({ row: row + 2, column: column + 1 });

        potentialMoves.push_cell({ row: row - 1, column: column - 2 });
        potentialMoves.push_cell({ row: row - 1, column: column + 2 });
        potentialMoves.push_cell({ row: row + 1, column: column - 2 });
        potentialMoves.push_cell({ row: row + 1, column: column + 2 });
    }

    const color = window.sessionStorage.getItem('color') as Color;
    return potentialMoves.filter(pm => {
        const cell = gameState.boardState[pm.row][pm.column];
        if (cell.empty || (!cell.empty && cell.color !== color)) {
            return true;
        }

        return false;
    });
}

function getAxis(
    row: number,
    colunm: number,
    gameState: GameState
): {
    diagonal: Coordinates[];
    orthogonal: Coordinates[];
    diagonal_1: Coordinates[];
    orthogonal_1: Coordinates[];
} {
    const up_left = new Axis(gameState);
    const up_right = new Axis(gameState);
    const bottom_right = new Axis(gameState);
    const bottom_left = new Axis(gameState);
    const left = new Axis(gameState);
    const up = new Axis(gameState);
    const right = new Axis(gameState);
    const bottom = new Axis(gameState);

    for (let i = 1; i < 8; i++) {
        up_left.push_cell_to_axis(row - i, colunm - i);
        up_right.push_cell_to_axis(row - i, colunm + i);
        bottom_right.push_cell_to_axis(row + i, colunm + i);
        bottom_left.push_cell_to_axis(row + i, colunm - i);
        left.push_cell_to_axis(row, colunm - i);
        up.push_cell_to_axis(row - i, colunm);
        right.push_cell_to_axis(row, colunm + i);
        bottom.push_cell_to_axis(row + i, colunm);
    }

    return {
        diagonal: [...up_left.concat(up_right).concat(bottom_left).concat(bottom_right)],
        orthogonal: [...left.concat(up).concat(right).concat(bottom)],
        diagonal_1: [up_left[0], up_right[0], bottom_left[0], bottom_right[0]],
        orthogonal_1: [left[0], up[0], right[0], bottom[0]],
    };
}

class Axis extends Array<Coordinates> {
    private gameState: GameState;
    private blocked: boolean;

    constructor(gameState: GameState) {
        super();
        this.gameState = gameState;
        this.blocked = false;
    }

    public push_cell_to_axis(row: number, column: number) {
        if (row < 0 || row > 7 || column < 0 || column > 7) {
            return;
        }

        if (this.blocked) {
            return;
        }

        const cell = this.gameState.boardState[row][column];
        if (!cell.empty) {
            this.blocked = true;
            this.push({ row, column });
        }

        this.push({ row, column });
    }

    public push_cell(coordinates: Coordinates) {
        if (coordinates.row < 0 || coordinates.row > 7 || coordinates.column < 0 || coordinates.column > 7) {
            return;
        }

        this.push(coordinates)
    }
}
