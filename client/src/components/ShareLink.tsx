export function ShareLink(props: { gameId: string }) {
    return (
        <div
            style={{
                fontFamily: 'Courier New',
                height: '100px',
                width: '100%'
            }}
        >
            {' '}
            Share this link with your opponent: <br />{' '}
            {`https://karim-portfolio-chess.herokuapp.com/game/${props.gameId}`}
        </div>
    );
}
