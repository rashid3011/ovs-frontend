import { useTable, usePagination, useGlobalFilter } from "react-table";
import SearchInput from "../../InputFields/SearchInput";
import RefreshButton from "../../RefreshButton";
import ViewProfile from "../../ViewProfile";
import Popup from "reactjs-popup";
import "./index.css";

import React from "react";

function Table(props) {
  const { data, columns, onRefresh } = props;

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    previousPage,
    nextPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    prepareRow,
    state,
    setGlobalFilter,
  } = useTable(
    {
      data,
      columns,
    },
    useGlobalFilter,
    usePagination
  );

  const { globalFilter, pageIndex } = state;

  return (
    <>
      <div className="details-outer-header">
        <SearchInput
          placeholder="search by IDs"
          value={globalFilter}
          onChange={(event) => {
            setGlobalFilter(event.target.value);
          }}
        />
        <RefreshButton onClick={onRefresh} />
      </div>
      <div style={{ overflowX: "auto" }}>
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    const { original } = row;
                    return cell.column.id === "voterId" ? (
                      <Popup
                        trigger={
                          <td {...cell.getCellProps()} className="voter-id">
                            {cell.render("Cell")}
                          </td>
                        }
                        modal
                        key={original}
                        className="voter-view-popup"
                      >
                        {(close) => (
                          <ViewProfile
                            details={original}
                            close={close}
                            fetchVoterDetails={onRefresh}
                          />
                        )}
                      </Popup>
                    ) : (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="page-move-buttons-container">
        <span className="page-index">
          Page <span style={{ fontWeight: "600" }}>{pageIndex + 1}</span> of{" "}
          <span style={{ fontWeight: "600" }}>{pageOptions.length}</span>
        </span>
        <button
          type="button"
          onClick={previousPage}
          disabled={!canPreviousPage}
          className="page-move-button"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={nextPage}
          disabled={!canNextPage}
          className="page-move-button"
        >
          Next
        </button>
      </div>
    </>
  );
}

export default Table;
