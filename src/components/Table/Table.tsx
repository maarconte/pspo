import "./style.scss";
import "./style-mobile.scss";

import { FC } from "react";
import Pagination from "./Pagination/Pagination";
import { TableProps } from "./Table.types";
import { flexRender } from "@tanstack/react-table";

const Table: FC<TableProps> = ({ data, columns }) => {
  return (
    <div className="Table">
      <table>
        <thead>
          {data.getHeaderGroups().map((headerGroup: any) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header: any) => (
                <th
                  key={header.id}
                  style={{ width: header.column.columnDef.width }}
                  colSpan={header.colSpan}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
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
