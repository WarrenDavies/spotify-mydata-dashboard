import { format } from 'd3';

// ({ xScale, innerHeight, tickFormat }) 

export default function AxisYDiscreet(props) {
    return (
        props.yScale.domain().map(tickValue => (
            <g 
                className='tick'
                key={tickValue}
            >
                <text 
                    style={{textAnchor:'end', fill:'#635FSD'}}
                    x='-9'
                    y={props.yScale(tickValue) + props.yScale.bandwidth() / 2}
                    dy='.32em'
                >
                    {tickValue}
                </text>
            </g>
        ))
    )
}