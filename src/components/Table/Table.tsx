import "./style.scss";
import "./style-mobile.scss";

import { Column, flexRender } from "@tanstack/react-table";

import { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Pagination from "./Pagination/Pagination";
import { TableProps } from "./Table.types";
import TableSearch from "./TableSearch";
import { faSortDown } from "@fortawesome/free-solid-svg-icons";
import { faSortUp } from "@fortawesome/free-solid-svg-icons";

function Filter({ column }: { column: Column<any, unknown> }) {
  const columnFilterValue = column.getFilterValue();

  return (
    <TableSearch
      value={(columnFilterValue ?? "") as string}
      onChange={column.setFilterValue}
    />
  );
}

const Table: FC<TableProps> = ({ data, columns }) => {
  return (
    <div className="Table">
      {data.getHeaderGroups().map((headerGroup: any) => (
        <div key={headerGroup.id}>
          {headerGroup.headers
            .filter((header: any) => header.column.getCanFilter())
            .map((header: any) => (
              <div key={header.id}>
                <Filter column={header.column} />
              </div>
            ))}
        </div>
      ))}
      <table>
        <thead>
          {data.getHeaderGroups().map((headerGroup: any) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header: any) => (
                <th
                  key={header.id}
                  style={{ width: header.column.columnDef.width }}
                  colSpan={header.colSpan}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className="d-flex align-items-center gap-05 justify-content-center">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    {{
                      asc: <FontAwesomeIcon icon={faSortUp} />,
                      desc: <FontAwesomeIcon icon={faSortDown} />,
                    }[header.column.getIsSorted() as string] ?? null}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {data.getRowModel().rows.map((row: any) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell: any) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.getPageCount() > 1 && <Pagination table={data} />}
    </div>
  );
};

export default Table;
