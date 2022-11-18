import { format } from 'd3';

export default function AxisXContinuous({ xScale, innerHeight, tickFormat }) {
    return ( 
        xScale.ticks().map(tickValue => (
            <g  
                className="tick"
                transform={`translate(${xScale(tickValue)}, 0)`}
                key={tickValue}
            >
                <line
                    stroke='#C0C0BB'
                    x1={0}
                    y1={0}
                    x2={0}
                    y2={innerHeight}
                />
                <text 
                    y={innerHeight + 3}
                    dy='.71em'
                    fill='#635FSD'
                    textAnchor='middle'
                >
                    {tickFormat(tickValue)}
                </text>
            </g>
        ))    
    )
}