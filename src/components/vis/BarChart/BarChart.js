import AxisX from './AxisX';
import AxisY from './AxisY';
import Marks from './Marks';
import * as d3 from 'd3';

export default function BarChart(props) {

    
    const xScale = d3.scaleBand()
        .domain(props.data.map(props.xValue))
        .range([0, props.innerWidth]);


    const yScale = d3.scaleLinear()
        .domain([ 0, d3.max(props.data, props.yValue)])
        .range([0, props.innerHeight]);
        // .paddingInner(.1);


    return (
        <svg width={props.width} height={props.height}>
            lll
            <g transform={`translate(${props.margin.left}, ${props.margin.top})`} >

                <AxisX 
                    xScale={xScale}
                    innerHeight={props.innerHeight}
                    tickFormat={props.xAxisTickFormat}
                />
                
                <AxisY 
                    yScale={yScale}
                    innerHeight={props.innerHeight}
                />
                <text
                    className='axis-label'
                    x = {(props.innerWidth / 2)}
                    textAnchor='middle'
                    y = {props.innerHeight + props.xAxisLabelOffset}
                >
                    Axis Label
                </text>
                <Marks 
                    data={props.data}
                    xScale={xScale}
                    yScale={yScale}
                    xValue={props.xValue}
                    yValue={props.yValue}
                    tooltipFormat={props.xAxisTickFormat}
                    innerHeight={props.innerHeight}
                />
            </g>
        </svg>
    )
}