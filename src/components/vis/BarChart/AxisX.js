import { format } from 'd3';

// ({ xScale, innerHeight, tickFormat }) 

export default function AxisX(props) {


    let xScaleUpdated = props.xScale.domain();
    // console.log(xScaleUpdated);
    if (props.tickLimiter) {
        for (let i = xScaleUpdated.length - 1; i >= 0; i--) {
            // console.log(i);
            if ( i % props.tickLimiter !== 0) {
                // console.log(xScaleUpdated[i]);
                xScaleUpdated.splice(i, 1);
            }
            // console.log(xScaleUpdated);
        }
    }
    // console.log(xScaleUpdated);
    return (
        xScaleUpdated.map(tickValue => (
            
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