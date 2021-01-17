import React from 'react'
import styled from 'styled-components'

import { HomeImage, HomeWrapper } from './Home'

export function GameNotFound() {
    return (
        <HomeWrapper>
            <HomeImage src={'../chess_icons/chess_home.svg'} alt="home" />
            <GameNotFoundLabel>Game Not Found</GameNotFoundLabel>
        </HomeWrapper>
    )
}

const GameNotFoundLabel = styled.span`
    font-size: 24px;
    font-weight: bold;
    color: ${props => props.theme.color.primary};
    font-family: ${props => props.theme.fontFamily};
`
