import styled from 'styled-components'
import { Color, Piece } from '../types'

export function Header(props: { turn: Color; color: Color }) {
    return (
        <HeaderContainer>
            <Turn turn={props.turn} />
            <YouAre color={props.color} />
        </HeaderContainer>
    )
}

const HeaderContainer = styled.div`
    min-height: 50px;
    width: 100%;
    padding-top: 5px;
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
    font-size: 16px;
    left: 10%;
    font-weight: bold;
    display: flex;
    align-items: center;
`

function YouAre(props: { color: Color }) {
    return (
        <YouAreWrapper>
            You are{' '}
            <PawnImage alt="color" src={`../chess_icons/${Piece.Pawn}_${props.color}.svg`} />
        </YouAreWrapper>
    )
}

const YouAreWrapper = styled.div`
    position: absolute;
    font-size: 16px;
    right: 10%;
    font-weight: bold;
    display: flex;
    align-items: center;
`

const PawnImage = styled.img`
    padding-left: 25px;
    padding-bottom: 5px;
`
