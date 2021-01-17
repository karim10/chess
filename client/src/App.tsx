import React from 'react'
import styled from 'styled-components'

import { Color, GameState } from './types'
import { Game } from './components/Game'
import { BrowserRouter, Route, Switch, useParams } from 'react-router-dom'
import { Home } from './components/Home'

function App() {
    return (
        <AppWrapper>
            <BrowserRouter>
                <Switch>
                    <Route path="/game/:gameId">
                        <GameWrapper />
                    </Route>
                    <Route path="/">
                        <Home />
                    </Route>
                </Switch>
            </BrowserRouter>
        </AppWrapper>
    )
}

function GameWrapper() {
    const { gameId } = useParams<{ gameId: string }>()
    const [gameState, setGameState] = React.useState<GameState | undefined>()
    const [fetchError, setFetchError] = React.useState<boolean>(false)
    const [color, setColor] = React.useState<Color>(Color.white)

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

        let storedColor = window.sessionStorage.getItem(gameId)
        if (!storedColor) {
            storedColor = Color.black
            window.sessionStorage.setItem(gameId, 'black')
        }
        setColor(storedColor as Color)
    }, [gameId])

    return fetchError ? (
        <div>Fetch Error</div>
    ) : gameState ? (
        <Game gameState={gameState} color={color} />
    ) : (
                <LoadingSpinner />
            )
}

function LoadingSpinner() {
    return <div className="loader"></div>
}

const AppWrapper = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
`

export default App
