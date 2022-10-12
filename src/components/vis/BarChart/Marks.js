// export const Marks = ( {data, xScale, yScale, xValue, yValue, tooltipFormat} ) => 
export default function Marks(props) {
    return (
        props.data.map( (d, i) => {
            return (
                <rect 
                    key={i} 
                    fill='#137B80'
                    x={props.xScale(props.xValue(d))} 
                    y={props.innerHeight - props.yScale(props.yValue(d))} 
                    width={props.xScale.bandwidth()} 
                    height={props.yScale(props.yValue(d))} 
                >
                    <title>
                        {props.yValue(d)}
                    </title>
                </rect>
            )
        })
    )
}
