import { format } from 'd3';
import './BarChart.scss';

export default function AxisXContinuous(props) {

    return ( 
        props.xScale.ticks(props.xAxisTicks).map(tickValue => (
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
                    textAnchor='middle'
                >
                    {props.tickFormat(tickValue)}
                </text>
            </g>
        ))    
    )
}