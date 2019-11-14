import * as React from 'react'
import styled from 'styled-components'

const Svg = styled('svg')`
    transform: rotate(-90deg);
`;



const CircularProgress:React.FunctionComponent<{ progress: number, size: number }> = ({ progress, size }) =>
        <Svg width={`${size}`} height={`${size}`} viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="#e7e7e7" strokeWidth="12" />
            <circle cx="60" cy="60" r="54" fill="none" stroke="#2775d3" strokeWidth="12"
                strokeDasharray="339.292" strokeDashoffset={339.292 * (1 - (progress * 0.01))} /> 
        </Svg>


export default CircularProgress
