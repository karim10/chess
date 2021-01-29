import { isEqual } from 'lodash'
import React from 'react'
import styled from 'styled-components'

import { sound } from '../Sound'
import { Cell, Coordinates, Color, GameState, Piece } from '../types'
import { CenteredDiv } from './CenteredDiv'

export interface CellComponentProps {
    cell: Cell
    coordinates: Coordinates
    potentialMoves: Coordinates[]
    playerColor: Color
    gameState: GameState
    setGameState: React.Dispatch<React.SetStateAction<GameState>>
    baseColor: Color
    socket: React.MutableRefObject<SocketIOClient.Socket>
}

export const CellComponent = React.memo(function (props: CellComponentProps) {
    const {
        cell,
        coordinates,
        potentialMoves,
        setGameState,
        gameState,
        baseColor,
        playerColor,
        socket,
    } = props

    const { activeCoordinates } = gameState
    const isActiveCell = isEqual(activeCoordinates, coordinates)
    const isPotentialMove =
        potentialMoves.find(potentialMove => isEqual(potentialMove, coordinates)) !== undefined

    const onCellClickHandler = () => {
        // game over
        if (gameState.winner) {
            return
        }

        const newGameState = { ...gameState }
        newGameState.activeCoordinates = coordinates

        if (cell.empty || isActiveCell || cell.color !== playerColor) {
            newGameState.activeCoordinates = undefined
        }

        // move piece
        if (activeCoordinates && isPotentialMove) {
            if (playerColor !== gameState.turn) {
                newGameState.activeCoordinates = undefined
                setGameState(newGameState)
                return
            }

            newGameState.boardState[coordinates.row][coordinates.column] =
                newGameState.boardState[activeCoordinates.row][activeCoordinates.column]
            newGameState.boardState[activeCoordinates.row][activeCoordinates.column] = {
                empty: true,
            }

            newGameState.turn = gameState.turn === Color.black ? Color.white : Color.black
            newGameState.activeCoordinates = undefined

            if (!cell.empty && cell.piece === Piece.King) {
                newGameState.winner = playerColor
            }

            socket.current.emit('onUpdateGame', newGameState)
            sound.play()
        }

        setGameState(newGameState)
    }

    return (
        <CellContainer
            isActiveCell={isActiveCell}
            baseColor={baseColor}
            onClick={onCellClickHandler}
        >
            <CenteredDiv>
                {isPotentialMove ? <PotentialMove empty={cell.empty} /> : null}
                {!cell.empty ? (
                    <PieceImg
                        src={`../chess_icons/${cell.piece}_${cell.color}.svg`}
                        alt={`${cell.piece}_${cell.color}`}
                        color={playerColor}
                    />
                ) : null}
            </CenteredDiv>
        </CellContainer>
    )
})

const PieceImg = styled.img<{ color: Color }>`
    z-index: 1;
    position: absolute;
    transform: ${props => (props.color === Color.black ? 'rotate(180deg)' : 'none')};
`

const CellContainer = styled.div<{ isActiveCell: boolean; baseColor: Color }>`
    display: table-cell;
    height: max(calc((100vh - 200px) / 8), 40px);
    width: max(calc((100vh - 200px) / 8), 40px);
    border: solid 1px;
    cursor: pointer;
    background-color: ${props =>
        props.isActiveCell
            ? props.theme.color.tertiary
            : props.baseColor === Color.black
            ? props.theme.color.primary
            : props.theme.color.secondary};
`

const PotentialMove = styled.div<{ empty: boolean }>`
    position: absolute;
    height: ${props => (props.empty ? '25px' : '50px')};
    width: ${props => (props.empty ? '25px' : '50px')};
    background-color: ${props => props.theme.color.grey};
    border-radius: 50%;
    display: inline-block;
`
