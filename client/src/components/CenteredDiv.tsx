import React from 'react'
import styled from 'styled-components'

export function CenteredDiv(props: React.PropsWithChildren<{}>) {
    return <CentredDivContainer>{props.children}</CentredDivContainer>
}

const CentredDivContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
`
