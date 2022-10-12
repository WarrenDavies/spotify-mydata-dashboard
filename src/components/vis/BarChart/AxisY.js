// export const AxisY = ({yScale}) => {

export default function AxisY(props) {
    return (
        props.yScale.ticks().map(tickValue => (
            <g 
                className='tick'
                key={tickValue}
                transform={`translate(0, ${props.innerHeight - props.yScale(tickValue)})`}
            >
                <text 
                    style={{textAnchor:'end', fill:'#635FSD'}}
                    x='-9'
                    y='1'
                    // y={props.yScale(tickValue) + props.yScale.bandwidth() / 2}
                    dy='.32em'
                >
                    {tickValue}
                </text>
            </g>
        ))
    )
}