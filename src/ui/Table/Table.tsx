import "./style.scss";
import "./style-mobile.scss";

import { flexRender } from "@tanstack/react-table";
import { ChevronUp, ChevronDown } from "lucide-react";
import Pagination from "./Pagination/Pagination";
import { TableProps } from "./Table.types";

const Table = <T,>({
  data,
  selectedItems,
  selectedItem,
  setSelectedItems,
  setSelectedItem,
  setIsSelectAll,
  setIsSelectNone,
  renderHeaderAddon,
}: TableProps<T>) => {
  return (
    <div className="Table">
      {renderHeaderAddon && renderHeaderAddon(data)}

      <table>
        <thead>
          {data.getHeaderGroups().map((headerGroup: any) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header: any) => (
                <th
                  key={header.id}
                  style={{ width: header.column.columnDef.size }}
                  colSpan={header.colSpan}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className={`d-flex align-items-center gap-05 justify-content-center ${header.column.getCanSort() ? 'pointer' : ''}`}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    {{
                      asc: <ChevronUp size={16} />,
                      desc: <ChevronDown size={16} />,
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
