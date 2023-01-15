import { format } from 'd3';
import { Link } from 'react-router-dom';

export default function AxisYDiscreet(props) {

    console.log(props.urlSuffixLookup);
    
    // function getUrlSuffix(i) {
    //     console.log(i);
    //     console.log(props.urlSuffixLookup);
    //     return props.urlSuffixLookup ? props.data[i][props.urlSuffixLookup] : '';  
    // } 

    const urlPrefix = props.urlPrefix ? props.urlPrefix : '';

    return (
        
        props.yScale.domain().map( (tickValue, i) => {

            let urlSuffix = props.urlSuffixLookup ? props.data[i][props.urlSuffixLookup] : ''; 

            return (
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
                        <Link to={'/' + urlPrefix + tickValue + '/' + urlSuffix}>{tickValue}</Link>
                    </text>
                </g>
            )
        })
    )
}