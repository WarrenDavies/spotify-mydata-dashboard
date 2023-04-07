import { format } from 'd3';

// ({ xScale, innerHeight, tickFormat }) 

export default function AxisX(props) {

    let xScale = props.xScale.domain();

    if (props.xAxisTickLimiter) {
        const numberOfDataPoints = props.xScale.domain().length;
        const nthTick = Math.floor(numberOfDataPoints / props.xAxisTickLimiter);

        xScale = xScale.filter( (tickValue, i) => {
            
            if (i % nthTick === 0) {
                return true
            }

        })
    }

    return (
        xScale.map( (tickValue, i) => (
            
            <g  
                className="tick"
                transform={`translate(${props.xScale(tickValue)}, ${props.xAxisOffset})`}
                key={tickValue}
            >
                <text 
                    key={tickValue}
                    // x={props.xScale(tickValue) + props.xScale.bandwidth() / 2}
                    x={props.xScale.bandwidth() / 2}
                    y={props.innerHeight + 3}
                    dy='.71em'
                    fill='#ffffff'
                    textAnchor='middle'
                > 
                    {tickValue}
                </text>
            </g>
        ))   
    )
}