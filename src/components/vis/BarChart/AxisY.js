// export const AxisY = ({yScale}) => {

export default function AxisX(props) {
    return (
        props.yScale.domain().map(tickValue => (
            <g 
                className='tick'
                key={props.tickValue}
            >
                <text 
                    style={{textAnchor:'end', fill:'#635FSD'}}
                    x='-9'
                    y={props.yScale(props.tickValue) + props.yScale.bandwidth() / 2}
                    dy='.32em'
                >
                    {props.tickValue}
                </text>
            </g>
        ))
    )
}