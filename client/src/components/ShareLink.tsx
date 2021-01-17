export function ShareLink(props: { gameId: string }) {
    return (
        <div
            style={{
                fontFamily: 'Courier New',
                width: '100%',
                minHeight: '50px',
                position: 'relative',
            }}
        >
            <span style={{ position: 'absolute', left: 50, overflow: 'hidden' }}>
                Share this link with your opponent: <br />
                <span
                    style={{ color: '#65A259' }}
                >{`https://karim-portfolio-chess.herokuapp.com/game/${props.gameId}`}</span>
            </span>
        </div>
    )
}
