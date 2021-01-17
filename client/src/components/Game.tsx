import React from 'react'
import io from 'socket.io-client'
import styled from 'styled-components'

import { GameState, Coordinates, Color } from '../types'
import { getPotentialMoves } from '../moves'
import { CellComponent } from './Cell'
import { ShareLink } from './ShareLink'
import { Header } from './Header'

export function Game(props: { gameState: GameState; color: Color }) {
    const [gameState, setGameState] = React.useState<GameState>(props.gameState)
    const [potentialMoves, setPotentialMoves] = React.useState<Coordinates[]>([])

    const socket = React.useRef(io(`/namespace/${gameState.gameId}`))
    let baseColor = Color.white

    React.useEffect(() => {
        if (!gameState.activeCoordinates) {
            setPotentialMoves([])
            return
        }

        setPotentialMoves(getPotentialMoves(gameState, props.color))
    }, [gameState, props.color])

    React.useEffect(() => {
        socket.current.on('updateGame', (gameState: GameState) => {
            setGameState(gameState)
        })
    }, [])

    return (
        <GameWrapper>
            <Header turn={gameState.turn} color={props.color} />
            <BoardWrapper>
                {gameState.winner ? <Winner winner={gameState.winner} /> : null}
                <Board color={props.color}>
                    {gameState.boardState.map((r, i) => {
                        baseColor = baseColor === Color.white ? Color.black : Color.white
                        return (
                            <Row key={i}>
                                {r.map((c, j) => {
                                    baseColor =
                                        baseColor === Color.white ? Color.black : Color.white
                                    return (
                                        <CellComponent
                                            key={i.toString().concat(j.toString())}
                                            cell={c}
                                            coordinates={{ row: i, column: j }}
                                            potentialMoves={potentialMoves}
                                            color={props.color}
                                            gameState={gameState}
                                            setGameState={setGameState}
                                            baseColor={baseColor}
                                            socket={socket}
                                        />
                                    )
                                })}
                            </Row>
                        )
                    })}
                </Board>
            </BoardWrapper>
            <ShareLink gameId={gameState.gameId} />
        </GameWrapper>
    )
}

function Winner(props: { winner: Color }) {
    return (
        <WinnerWrapper>
            <WinnerPawn src={`../chess_icons/pawn_${props.winner}.svg`} />
            Winner
        </WinnerWrapper>
    )
}

const WinnerWrapper = styled.div`
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 50px;
    font-weight: bold;
    z-index: 2;
`

const WinnerPawn = styled.img`
    height: 200px;
    width: 200px;
    animation: bubble 1s forwards;
    animation-name: slides;
    animation-duration: 2s;
`

const BoardWrapper = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
`

const GameWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100vw;
    height: 100vh;
`

const Board = styled.div<{ color: Color }>`
    overflow: hidden;
    display: table;
    table-layout: fixed;
    border-spacing: 3px;
    border-collapse: separate;
    transform: ${props => (props.color === Color.black ? 'rotate(180deg)' : 'none')};
`

const Row = styled.div`
    display: table-row;
`
