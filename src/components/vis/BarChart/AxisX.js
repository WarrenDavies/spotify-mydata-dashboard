import { format } from 'd3';

// ({ xScale, innerHeight, tickFormat }) 

export default function AxisX(props) {
    return (
        props.xScale.domain().map(tickValue => (
            <g  
                className="tick"
                transform={`translate(${props.xScale(tickValue)}, 0)`}
                key={tickValue}
            >
                {/* <line
                    stroke='#C0C0BB'
                    x1={0}
                    y1={0}
                    x2={0}
                    y2={props.innerHeight}
                /> */}
                <text 
                    x={props.xScale(tickValue) + props.xScale.bandwidth() / 2}
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