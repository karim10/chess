import { Coordinates, Piece, Color, GameState, PawnPosition } from './types';

export function getPotentialMoves(gameState: GameState, color: Color): Coordinates[] {
    if (!gameState.activeCoordinates) {
        return [];
    }

    const { row, column } = gameState.activeCoordinates;

    const cell = gameState.boardState[row][column];
    if (cell.empty) {
        return [];
    }

    const potentialMovesByAxis = getAllAxes(row, column, gameState, color);

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

    const potentialMoves = new Axis(gameState, color);

    if (cell.piece === Piece.Pawn) {
        const firstPawnMove = row === 1 || row === 6 ? true : false;

        if (cell.color === Color.black) {
            potentialMoves.push_cell({ row: row + 1, column: column }, PawnPosition.advancing);
            if (firstPawnMove && potentialMoves.length !== 0) {
                potentialMoves.push_cell({ row: row + 2, column: column }, PawnPosition.advancing);
            }

            potentialMoves.push_cell({ row: row + 1, column: column + 1 }, PawnPosition.attacking);
            potentialMoves.push_cell({ row: row + 1, column: column - 1 }, PawnPosition.attacking);
        }

        if (cell.color === Color.white) {
            potentialMoves.push_cell({ row: row - 1, column: column }, PawnPosition.advancing);
            if (firstPawnMove && potentialMoves.length !== 0) {
                potentialMoves.push_cell({ row: row - 2, column: column }, PawnPosition.advancing);
            }

            potentialMoves.push_cell({ row: row - 1, column: column + 1 }, PawnPosition.attacking);
            potentialMoves.push_cell({ row: row - 1, column: column - 1 }, PawnPosition.attacking);
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

    return potentialMoves;
}

function getAllAxes(
    row: number,
    colunm: number,
    gameState: GameState,
    color: Color
): {
    diagonal: Coordinates[];
    orthogonal: Coordinates[];
    diagonal_1: Coordinates[];
    orthogonal_1: Coordinates[];
} {
    const up_left = new Axis(gameState, color);
    const up_right = new Axis(gameState, color);
    const bottom_right = new Axis(gameState, color);
    const bottom_left = new Axis(gameState, color);
    const left = new Axis(gameState, color);
    const up = new Axis(gameState, color);
    const right = new Axis(gameState, color);
    const bottom = new Axis(gameState, color);

    for (let i = 1; i < 8; i++) {
        up_left.push_cell_to_axis({ row: row - i, column: colunm - i });
        up_right.push_cell_to_axis({ row: row - i, column: colunm + i });
        bottom_right.push_cell_to_axis({ row: row + i, column: colunm + i });
        bottom_left.push_cell_to_axis({ row: row + i, column: colunm - i });
        left.push_cell_to_axis({ row: row, column: colunm - i });
        up.push_cell_to_axis({ row: row - i, column: colunm });
        right.push_cell_to_axis({ row: row, column: colunm + i });
        bottom.push_cell_to_axis({ row: row + i, column: colunm });
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
    private color: Color;

    constructor(gameState: GameState, color: Color) {
        super();
        this.gameState = gameState;
        this.blocked = false;
        this.color = color;
    }

    public push_cell_to_axis(coordinates: Coordinates) {
        if (this.notInBoard(coordinates) || this.blocked) {
            return;
        }

        const cell = this.gameState.boardState[coordinates.row][coordinates.column];

        if (cell && !cell.empty) {
            this.blocked = true;
        }

        this.push_cell(coordinates);
    }

    public push_cell(coordinates: Coordinates, pawnPosition?: PawnPosition) {
        if (this.notInBoard(coordinates)) {
            return;
        }

        const cell = this.gameState.boardState[coordinates.row][coordinates.column];
        if (!cell.empty && cell.color === this.color) {
            return;
        }

        if (!cell.empty && pawnPosition === PawnPosition.advancing) {
            return;
        }

        if (cell.empty && pawnPosition === PawnPosition.attacking) {
            return;
        }

        this.push(coordinates);
    }

    private notInBoard(coordinates: Coordinates) {
        return (
            coordinates.row < 0 ||
            coordinates.row > 7 ||
            coordinates.column < 0 ||
            coordinates.column > 7
        );
    }
}
