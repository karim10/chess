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

    const potentialMoves = [];
    if (cell.piece === Piece.Pawn) {
        const firstPawnMove = row === 1 || row === 6 ? true : false;
        if (cell.color === Color.black) {
            potentialMoves.push({ row: row + 1, column: column });
            if (firstPawnMove) {
                potentialMoves.push({ row: row + 2, column: column });
            }
        }

        if (cell.color === Color.white) {
            potentialMoves.push({ row: row - 1, column: column });
            if (firstPawnMove) {
                potentialMoves.push({ row: row - 2, column: column });
            }
        }

        const blackPawnDigonalLeft =
            potentialMovesByAxis.diagonal_1[2] && gameState.boardState[potentialMovesByAxis.diagonal_1[2].row][potentialMovesByAxis.diagonal_1[2].column];
        const blackPawnDigonalRight =
            potentialMovesByAxis.diagonal_1[3] && gameState.boardState[potentialMovesByAxis.diagonal_1[3].row][potentialMovesByAxis.diagonal_1[3].column];
        const whitePawnDigonalLeft =
            potentialMovesByAxis.diagonal_1[0] && gameState.boardState[potentialMovesByAxis.diagonal_1[0].row][potentialMovesByAxis.diagonal_1[0].column];
        const whitePawnDigonalRight =
            potentialMovesByAxis.diagonal_1[1] && gameState.boardState[potentialMovesByAxis.diagonal_1[1].row][potentialMovesByAxis.diagonal_1[1].column];
        if (blackPawnDigonalLeft && !blackPawnDigonalLeft.empty) {
            potentialMoves.push(potentialMovesByAxis.diagonal_1[2]);
        }

        if (blackPawnDigonalRight && !blackPawnDigonalRight.empty) {
            potentialMoves.push(potentialMovesByAxis.diagonal_1[3]);
        }

        if (whitePawnDigonalLeft && !whitePawnDigonalLeft.empty) {
            potentialMoves.push(potentialMovesByAxis.diagonal_1[0]);
        }

        if (whitePawnDigonalRight && !whitePawnDigonalRight.empty) {
            potentialMoves.push(potentialMovesByAxis.diagonal_1[1]);
        }
    }

    if (cell.piece === Piece.Knight) {
        potentialMoves.push({ row: row - 2, column: column - 1 });
        potentialMoves.push({ row: row - 2, column: column + 1 });
        potentialMoves.push({ row: row + 2, column: column - 1 });
        potentialMoves.push({ row: row + 2, column: column + 1 });
    }

    return potentialMoves;
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
        up_left.push_cell(row - i, colunm - i);
        up_right.push_cell(row - i, colunm + i);
        bottom_right.push_cell(row + i, colunm + i);
        bottom_left.push_cell(row + i, colunm - i);
        left.push_cell(row, colunm - i);
        up.push_cell(row - i, colunm);
        right.push_cell(row, colunm + i);
        bottom.push_cell(row + i, colunm);
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
    public push_cell(row: number, column: number) {
        if (row < 0 || row > 7 || column < 0 || column > 7) {
            return;
        }

        if (this.blocked) {
            return;
        }

        const cell = this.gameState.boardState[row][column];
        if (!cell.empty) {
            this.blocked = true;

            if (cell.color === this.gameState.turn) {
                return;
            }

            this.push({ row, column });
        }

        this.push({ row, column });
    }
}
