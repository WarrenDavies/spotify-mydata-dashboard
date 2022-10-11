import { format } from 'd3';

// ({ xScale, innerHeight, tickFormat }) 

export default function AxisY(props) {
    return (
        props.xScale.ticks().map(tickValue => (
            <g  
                className="tick"
                transform={`translate(${props.xScale(tickValue)}, 0)`}
                key={tickValue}
            >
                <line
                    stroke='#C0C0BB'
                    x1={0}
                    y1={0}
                    x2={0}
                    y2={props.innerHeight}
                />
                <text 
                    y={props.innerHeight + 3}
                    dy='.71em'
                    fill='#635FSD'
                    textAnchor='middle'
                > 
                    {tickValue}
                </text>
            </g>
        ))   
    )
}