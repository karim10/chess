export interface GameState {
    readonly gameId: string;
    readonly turn: Color;
    readonly boardState: BoardState;
    readonly activeCoordinates?: Coordinates;
    readonly isFirstRound: boolean;
    readonly eatenPieces: Cell[];
}

export enum Color {
    white = 'white',
    black = 'black',
}

export enum Piece {
    King = 'king',
    Rook = 'rook',
    Bishop = 'bishop',
    Queen = 'queen',
    Knight = 'knight',
    Pawn = 'pawn',
}

export enum PawnPosition {
    attacking,
    advancing,
}

const emptyRow: Row = [
    { empty: true },
    { empty: true },
    { empty: true },
    { empty: true },
    { empty: true },
    { empty: true },
    { empty: true },
    { empty: true },
];

export type BoardState = [Row, Row, Row, Row, Row, Row, Row, Row];

type Row = [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell];

export const initialBoardState: BoardState = [
    [
        { piece: Piece.Rook, color: Color.black, empty: false },
        { piece: Piece.Knight, color: Color.black, empty: false },
        { piece: Piece.Bishop, color: Color.black, empty: false },
        { piece: Piece.Queen, color: Color.black, empty: false },
        { piece: Piece.King, color: Color.black, empty: false },
        { piece: Piece.Bishop, color: Color.black, empty: false },
        { piece: Piece.Knight, color: Color.black, empty: false },
        { piece: Piece.Rook, color: Color.black, empty: false },
    ],
    [
        { piece: Piece.Pawn, color: Color.black, empty: false },
        { piece: Piece.Pawn, color: Color.black, empty: false },
        { piece: Piece.Pawn, color: Color.black, empty: false },
        { piece: Piece.Pawn, color: Color.black, empty: false },
        { piece: Piece.Pawn, color: Color.black, empty: false },
        { piece: Piece.Pawn, color: Color.black, empty: false },
        { piece: Piece.Pawn, color: Color.black, empty: false },
        { piece: Piece.Pawn, color: Color.black, empty: false },
    ],
    [...emptyRow],
    [...emptyRow],
    [...emptyRow],
    [...emptyRow],
    [
        { piece: Piece.Pawn, color: Color.white, empty: false },
        { piece: Piece.Pawn, color: Color.white, empty: false },
        { piece: Piece.Pawn, color: Color.white, empty: false },
        { piece: Piece.Pawn, color: Color.white, empty: false },
        { piece: Piece.Pawn, color: Color.white, empty: false },
        { piece: Piece.Pawn, color: Color.white, empty: false },
        { piece: Piece.Pawn, color: Color.white, empty: false },
        { piece: Piece.Pawn, color: Color.white, empty: false },
    ],
    [
        { piece: Piece.Rook, color: Color.white, empty: false },
        { piece: Piece.Knight, color: Color.white, empty: false },
        { piece: Piece.Bishop, color: Color.white, empty: false },
        { piece: Piece.Queen, color: Color.white, empty: false },
        { piece: Piece.King, color: Color.white, empty: false },
        { piece: Piece.Bishop, color: Color.white, empty: false },
        { piece: Piece.Knight, color: Color.white, empty: false },
        { piece: Piece.Rook, color: Color.white, empty: false },
    ],
];

export const initialGameState: GameState = {
    gameId: '0000',
    boardState: initialBoardState,
    turn: Color.white,
    isFirstRound: true,
    eatenPieces: [],
};

export interface Coordinates {
    row: number;
    column: number;
}

export type Cell =
    | {
          piece: Piece;
          color: Color;
          empty: false;
      }
    | {
          empty: true;
      };
