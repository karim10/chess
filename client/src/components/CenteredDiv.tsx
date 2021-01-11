import React from 'react';

export function CenteredDiv(props: React.PropsWithChildren<{}>) {
    return <div style={centeredDivStyles}>{props.children}</div>;
}

const centeredDivStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
};
