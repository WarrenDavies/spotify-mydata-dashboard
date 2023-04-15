import React, {useState} from 'react';
import { useTable, useFilters, useSortBy } from 'react-table';
import './Table.scss'

export default function Table({columns, data, convertMsToLargestTimeUnit, placeholder, search}) {
    
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
        useFilters,
        useSortBy
    )

    const handleFilterChange = e => {
        const value = e.target.value || '';
        setFilter('artistName', value)
        setFilterInput(value);
    }  

    const searchBar = search ? 
    <input
        value={filterInput} 
        onChange={handleFilterChange}
        placeholder={placeholder}
    /> 
    : null

    return (
        <div id='table'>
            {searchBar}
            
            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th 
                                    {...column.getHeaderProps(column.getSortByToggleProps())}
                                    className={
                                        columns.isSorted
                                            ? column.isSortedDesc
                                                ? "sort-desc"
                                                : "sort-asc"
                                            : ""
                                    }
                                >
                                    {column.render("Header")}
                                </th>
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