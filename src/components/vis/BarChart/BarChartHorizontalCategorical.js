import AxisXContinuous from './AxisXContinuous';
import AxisYDiscreet from './AxisYDiscreet';
import MarksHorizontal from './MarksHorizontal';
import * as d3 from 'd3';

export default function BarChartHorizontalCategorical(props) {

    
    
    const xScale = d3.scaleLinear()
        .domain([ 0, d3.max(props.data, props.xValue)])
        .range([0, props.innerWidth]);

    const yScale = d3.scaleBand()
        .domain(props.data.map(props.yValue))
        .range([0, props.innerHeight])
        .paddingInner(.1);


    return (
        <svg width={props.width} height={props.height}>
            
            <g transform={`translate(${props.margin.left}, ${props.margin.top})`} >

                <AxisXContinuous 
                    xScale={xScale}
                    innerHeight={props.innerHeight}
                    tickFormat={props.xAxisTickFormat}
                    tickLimiter={3}
                />
                
                <AxisYDiscreet
                    urlPrefix={props.urlPrefix}
                    urlSuffixLookup={props.urlSuffixLookup}
                    yScale={yScale}
                    data={props.data}
                    innerHeight={props.innerHeight}
                    tickOffset={-9}
                />
                <text
                    className='axis-label'
                    x = {(props.innerWidth / 2)}
                    textAnchor='middle'
                    y = {props.innerHeight + props.xAxisLabelOffset}
                >
                    Axis Label
                </text>
                <MarksHorizontal 
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