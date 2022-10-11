// export const Marks = ( {data, xScale, yScale, xValue, yValue, tooltipFormat} ) => 
export default function Marks(props) {
    return (
        props.data.map( (d, i) => {
            return (
                <rect 
                    key={i} 
                    fill='#137B80'
                    x={0} 
                    y={props.yScale(props.yValue(d))} 
                    width={props.xScale(props.xValue(d))} 
                    height={props.yScale.bandwidth()} 
                >
                    <title>
                        {props.tooltipFormat(props.xValue(d))}
                    </title>
                </rect>
            )
        })
    )
}
