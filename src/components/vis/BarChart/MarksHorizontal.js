// export const Marks = ( {data, xScale, yScale, xValue, yValue, tooltipFormat} ) => 
export default function MarksHorizontal(props) {
    return (
        props.data.map( (d, i) => {
            // console.log(props.xValue());
            return (
                <rect 
                    key={i} 
                    fill='#FFD2FC'
                    x={0} 
                    y={props.yScale(props.yValue(d))} 
                    width={props.xScale(props.xValue(d))} 
                    // width={200}
                    height={props.yScale.bandwidth()} 
                >
                    <title>
                        {props.yValue(d)}
                    </title>
                </rect>
            )
        })
    )
}
