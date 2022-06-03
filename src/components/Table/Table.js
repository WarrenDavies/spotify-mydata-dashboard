import React, {useState} from 'react';
import { useTable, useFilters } from 'react-table';

export default function Table({columns, data}) {
    
    const [filterInput, setFilterInput] = useState('');

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        setFilter
    } = useTable(
        {
            columns,
            data
        },
        useFilters
    )

    const handleFilterChange = e => {
        const value = e.target.value || '';
        setFilter('artistName', value)
        setFilterInput(value);
    }

    return (
        <div id='artistTable'>
            <input
                value={filterInput} 
                onChange={handleFilterChange}
                placeholder={'Search for an artist'}
            />
            
            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps()}>{column.render("Header")}</th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map((row, i) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return (
                                        <td {...cell.getCellProps()}>
                                            {cell.render("Cell")}
                                        </td>
                                    )   
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    )
}