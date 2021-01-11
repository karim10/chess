import { Color, Piece } from '../types';

export function Header(props: { turn: Color; color: Color }) {
    return (
        <div style={{ height: '100px', position: 'relative', width: '100%' }}>
            <Turn turn={props.turn} />
            <YouAre color={props.color} />
        </div>
    );
}

function Turn(props: { turn: Color }) {
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

const turnStyles: React.CSSProperties = {
    position: 'absolute',
    fontSize: '16px',
    left: 200,
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
};

function YouAre(props: { color: Color }) {
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

const youAreStyles: React.CSSProperties = {
    position: 'absolute',
    fontSize: '16px',
    right: 200,
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
};
