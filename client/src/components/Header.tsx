import styled from 'styled-components'

import { Color, Piece } from '../types'

export function Header(props: { turn: Color; playerColor: Color }) {
    return (
        <HeaderContainer>
            <Turn turn={props.turn} />
            <YouAre playerColor={props.playerColor} />
        </HeaderContainer>
    )
}

const HeaderContainer = styled.div`
    min-height: 50px;
    padding-top: 5px;
    width: 100%;
`

function Turn(props: { turn: Color }) {
    return (
        <TurnWrapper>
            Turn <PawnImage src={`../chess_icons/${Piece.Pawn}_${props.turn}.svg`} alt="turn" />
        </TurnWrapper>
    )
}

const TurnWrapper = styled.div`
    position: absolute;
    font-size: 20px;
    left: 10%;
    font-weight: bold;
    display: flex;
    align-items: center;
    font-family: ${props => props.theme.fontFamily};
`

function YouAre(props: { playerColor: Color }) {
    return (
        <YouAreWrapper>
            You are{' '}
            <PawnImage alt="color" src={`../chess_icons/${Piece.Pawn}_${props.playerColor}.svg`} />
        </YouAreWrapper>
    )
}

const YouAreWrapper = styled.div`
    position: absolute;
    font-size: 20px;
    right: 10%;
    font-weight: bold;
    display: flex;
    align-items: center;
    font-family: ${props => props.theme.fontFamily};
`

const PawnImage = styled.img`
    padding-left: 25px;
    padding-bottom: 5px;
`
