import React from 'react'
import styled, { ThemeProvider } from 'styled-components'

import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Home } from './components/Home'
import { GameWrapper } from './components/GameWrapper'

function App() {
    return (
        <ThemeProvider theme={theme}>
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
        </ThemeProvider>
    )
}

const AppWrapper = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
`

export const theme = {
    color: {
        primary: '#65A259',
        secondary: '#EBF4D2',
        tertiary: '#EDFF6B',
        grey: '#bbb',
    },
    fontFamily: 'Courier New',
}

export default App
