import React from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

export function Home() {
    const history = useHistory()
    const createGame = React.useCallback(async () => {
        const response = await fetch(`/create-room`, {
            method: 'POST',
        })
        const body = await response.json()
        history.push(`/game/${body.gameId}`)
        window.sessionStorage.setItem(body.gameId, 'white')
    }, [history])

    return (
        <HomeWrapper>
            <HomeImage src={'../chess_icons/chess_home.svg'} alt="home" />
            <CreateButton onClick={createGame}>Create Game</CreateButton>
        </HomeWrapper>
    )
}

export const HomeWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    height: 450px;
`

const CreateButton = styled.button`
    width: 200px;
    height: 50px;
    background-color: ${props => props.theme.color.primary};
    color: white;
    font-size: 18px;
    font-weight: bold;
    border: 1px solid black;
    border-radius: 3px;
    cursor: pointer;
    font-family: ${props => props.theme.fontFamily};
`

export const HomeImage = styled.img`
    height: 300px;
    width: 300px;
    animation: bubble 1s forwards;
    animation-name: slides;
    animation-duration: 2s;
`
