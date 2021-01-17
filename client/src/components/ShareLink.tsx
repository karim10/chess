import styled from 'styled-components'

export function ShareLink(props: { gameId: string }) {
    return (
        <ShareLinkWrapper>
            <Label>Share this link with your opponent: </Label>
            <br />
            <Link>{`http://kby-portfolio-chess.eu-central-1.elasticbeanstalk.com/game/${props.gameId}`}</Link>
        </ShareLinkWrapper>
    )
}

const Link = styled.div`
    color: ${props => props.theme.color.primary};
    position: absolute;
    left: 50px;
    overflow: hidden;
`

const Label = styled.div`
    position: absolute;
    left: 50px;
`

const ShareLinkWrapper = styled.div`
    font-family: ${props => props.theme.fontFamily};
    width: 100%;
    min-height: 50px;
    position: relative;
`
