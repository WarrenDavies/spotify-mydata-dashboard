import AxisX from './AxisX';
import AxisY from './AxisY';
import Marks from './Marks';
import * as d3 from 'd3';
import './BarChart.scss';

export default function BarChart(props) {

    
    const xScale = d3.scaleBand()
        .domain(props.data.map(props.xValue))
        .range([0, props.innerWidth]);


    const yScale = d3.scaleLinear()
        .domain([ 0, d3.max(props.data, props.yValue)])
        .range([0, props.innerHeight]);

    return (
        <svg 
            viewBox={`0 0 ${props.width} ${props.height}`} 
            id={props.id}
        >
         
            <g transform={`translate(${props.margin.left}, ${props.margin.top})`} >

                <AxisX 
                    xScale={xScale}
                    innerHeight={props.innerHeight}
                    tickFormat={props.xAxisTickFormat}
                    xAxisOffset={props.xAxisOffset}
                    xAxisTickLimiter={props.xAxisTickLimiter}
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
                    transform = {`translate( 0, ${props.xAxisLabelOffset})`}
                >
                    {props.xAxisLabel}
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