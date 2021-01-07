import { CSSProperties } from 'react';
import { Color, Piece } from '../types';

export function YouAre(props: { color: Color }) {
    return (
        <div style={youAreStyles}>
            You are{' '}
            <img
                src={`../chess_icons/${Piece.Pawn}_${props.color}.svg`}
                alt="turn"
                style={{ paddingLeft: 25, paddingBottom: 5 }}
            />
        </div>
    );
}

const youAreStyles: CSSProperties = {
    fontSize: '16px',
    position: 'absolute',
    top: 20,
    right: 200,
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
};
