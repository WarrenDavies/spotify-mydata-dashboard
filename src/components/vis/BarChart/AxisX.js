import { format } from 'd3';

// ({ xScale, innerHeight, tickFormat }) 

export default function AxisX(props) {

    let numberOfDataPoints = props.xScale.domain().length;
    let nthTick = Math.floor(numberOfDataPoints / 7)
    return (
        props.xScale.domain()
        .filter( (tickValue, i) => {
            
            if (i % nthTick === 0) {
                return true
            }

        })
        .map( (tickValue, i) => (
            
            <g  
                className="tick"
                transform={`translate(${props.xScale(tickValue)}, 0)`}
                key={tickValue}
            >
                <text 
                    key={tickValue}
                    // x={props.xScale(tickValue) + props.xScale.bandwidth() / 2}
                    x={props.xScale.bandwidth() / 2}
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