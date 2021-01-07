import { CSSProperties } from 'react';
import { Color, Piece } from '../types';

export function Turn(props: { turn: Color }) {
    return (
        <div style={turnStyles}>
            Turn{' '}
            <img
                src={`../chess_icons/${Piece.Pawn}_${props.turn}.svg`}
                alt="turn"
                style={{ paddingLeft: 25, paddingBottom: 5 }}
            />
        </div>
    );
}

const turnStyles: CSSProperties = {
    fontSize: '16px',
    position: 'absolute',
    top: 20,
    left: 200,
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
};
