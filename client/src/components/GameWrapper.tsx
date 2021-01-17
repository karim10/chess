import React from 'react'
import { useParams } from 'react-router-dom'

import { Color, GameState } from '../types'
import { Game } from './Game'
import { GameNotFound } from './GameNotFound'

export function GameWrapper() {
    const { gameId } = useParams<{ gameId: string }>()
    const [gameState, setGameState] = React.useState<GameState | undefined>()
    const [fetchError, setFetchError] = React.useState<boolean>(false)
    const [playerColor, setPlayerColor] = React.useState<Color>(Color.white)

    React.useEffect(() => {
        fetch(`/get-game-state/${gameId}`)
            .then(response => {
                if (response.status === 404) {
                    setFetchError(true)
                }
                return response.json()
            })
            .then(data => {
                setGameState(data)
            })
            .catch(() => {
                setFetchError(true)
            })

        let storedPlayerColor = window.sessionStorage.getItem(gameId)
        if (!storedPlayerColor) {
            storedPlayerColor = Color.black
            window.sessionStorage.setItem(gameId, 'black')
        }
        setPlayerColor(storedPlayerColor as Color)
    }, [gameId])

    return fetchError ? (
        <GameNotFound />
    ) : gameState ? (
        <Game gameState={gameState} playerColor={playerColor} />
    ) : (
        <LoadingSpinner />
    )
}

function LoadingSpinner() {
    return <div className="loader"></div>
}
