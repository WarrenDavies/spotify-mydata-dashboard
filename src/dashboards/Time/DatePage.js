import React, {useState, useEffect, useMemo} from 'react'
import { useParams } from 'react-router-dom'
import Table from '../../components/Table/Table'
import { Link } from 'react-router-dom'
import { makePropGetter } from 'react-table';

export default function DatePage(props) {

    const { dateOfListen } = useParams();
    // const [listeningTimePerHour, updateListeningTimePerHour] = useState([]);

    const dateData = props.data.filter(
        i => i.endTime.substring(0, 10) == dateOfListen
    )
    
    function getListeningTimePerHour(data) {

        let hours = []

        for (let i = 0; i <= 24; i++) {

            let hour = i < 10 ? '0' + i : i.toString();

            hours.push({
                hour: hour,
                listeningTimeMs: 0,
                uniqueListens: 0
            })

        }
        
        data.forEach( (i) => {

            let hourOfThisListen = i.endTime.substring(11, 13);
            
            let hoursArrayIndex = hours.findIndex(e => e['hour'] == hourOfThisListen);
            
            hours[hoursArrayIndex].listeningTimeMs += i.msPlayed;
            hours[hoursArrayIndex].uniqueListens += 1;

        });
        
        hours.forEach( (i) => {

            i.listeningTime = props.convertMsToLargestTimeUnit(i.listeningTimeMs);

        });


        return hours
    }
    const newHourData = useMemo( () => getListeningTimePerHour(dateData))

    const hoursColumns = useMemo(() => [
        {
            Header: 'Listening time per hour',
            columns: [
                {
                    Header: "Hour",
                    accessor: 'endTime',
                    Cell: ({ value }) => {
                        return (
                            value.substring(10, 16)
                        )
                    }
                }
            ]
        }
    ])

    const allListenscolumns = useMemo(() => [
        {
            Header: 'All of your listens this day',
            columns: [
                {
                    Header: "Time",
                    accessor: 'endTime',
                    Cell: ({ value }) => {
                        return (
                            value.substring(10, 16)
                        )
                    }
                },
                {
                    Header: "ArtistName",
                    accessor: 'artistName',
                    Cell: ({ value }) => {
                        return (
                            // <a href={'/artist/' + value}>{value}</a>
                            <Link to={'/artist/' + value}>{value}</Link>
                        )
                    }
                },
                {
                    Header: "TrackName",
                    accessor: 'trackName',
                    Cell: ({ value }) => {
                        return (
                            // <a href={'/artist/' + value}>{value}</a>
                            <Link to={'/track/' + value}>{value}</Link>
                        )
                    }
                },
                {
                    Header: "Listening Time",
                    accessor: 'msPlayed',
                    Cell: ({ value }) => {
                        return (
                            props.convertMsToLargestTimeUnit(value)
                        )
                    }
                }
            ]
        }
    ])


    return (
        
       <div className="Date">
            This is the date page for {dateOfListen}
            <br/><br/>

            data.length: {props.data.length}
            <br/><br/>

            new hour data: {JSON.stringify(newHourData)}
            <br/><br/>

            {'[' + props.data[0].endTime.substring(11, 13) + ']'}
            <br/><br/>

            <Table
                columns={allListenscolumns}
                data={dateData}
                convertMsToLargestTimeUnit={props.convertMsToLargestTimeUnit}
                placeholder={'Search for a track'}
                search={false}
            />

            <br/><br/>
            
            {JSON.stringify(dateData)}

       </div> 
    )
}