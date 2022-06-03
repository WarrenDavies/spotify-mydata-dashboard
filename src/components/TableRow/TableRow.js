import React from "react";

export default function TableRow(props) {

    return (
        <tr>
            <td>{props.artistName}</td>
            <td>{props.listeningTime}</td>
            <td>{props.uniqueListens}</td>
            <td>{props.firstListen}</td>
        </tr>
    )
}