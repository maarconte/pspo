import "./style.scss";
import "./style-mobile.scss";

import { flexRender } from "@tanstack/react-table";
import { ChevronUp, ChevronDown , ArrowUpDown} from "lucide-react";
import Pagination from "./Pagination/Pagination";
import { TableProps } from "./Table.types";

const Table = <T,>({
  data,
  renderHeaderAddon,
}: TableProps<T>) => {
  return (
    <>
      {renderHeaderAddon && renderHeaderAddon(data)}
    <div className="Table">
      <table>
        <thead>
          {data.getHeaderGroups().map((headerGroup: any) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header: any) => {
                const isSortable = header.column.getCanSort();
                const sorted = header.column.getIsSorted();
                return(
                <th
                  key={header.id}
                  className={isSortable ? 'Table__th-sort' : ''}
                  style={{ width: header.column.columnDef.size }}
                  colSpan={header.colSpan}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}

                      {isSortable && (
                        <span className={`Table__sort-icon ${sorted ? 'Table__sort-icon--active' : ''}`}>
                          {sorted === 'asc' ? (
                            <ChevronUp size={14} />
                          ) : sorted === 'desc' ? (
                            <ChevronDown size={14} />
                          ) : (
                            <ArrowUpDown size={14} />
                          )}
                        </span>
                      )}
                </th>
              )})}
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
      </div>
      {data.getPageCount() > 1 && <Pagination table={data} />}
      </>
  );
};

export default Table;
