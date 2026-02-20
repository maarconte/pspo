import "./style.scss";
import "./style-mobile.scss";

import { Column, flexRender } from "@tanstack/react-table";

import { FC } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import Pagination from "./Pagination/Pagination";
import { Question } from "../../utils/types";
import TableActions from "./TableActions/TableActions";
import { TableProps } from "./Table.types";
import TableSearch from "./TableSearch";

// Déplacer la définition du composant Filter et de son interface de props en dehors du composant Table
interface ColumnFilterProps {
  column: Column<any, unknown>;
}

const ColumnFilter: FC<ColumnFilterProps> = ({ column }) => {
  const columnFilterValue = column.getFilterValue();

  return (
    <div className="d-flex gap-1 justify-content-end">
      <TableSearch
        value={(columnFilterValue ?? "") as string}
        onChange={column.setFilterValue}
        id={`search-${column.id}`}
      />
    </div>
  );
};

const Table: FC<TableProps> = ({
  data,
  selectedQuestions,
  setSelectedQuestions,
  setSelectedQuestion,
  setIsSelectAll,
  setIsSelectNone,
  selectedQuestion,
}) => {
  return (
    <div className="Table">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <TableActions
          selectedQuestions={selectedQuestions ?? []}
          setSelectedQuestions={setSelectedQuestions ?? (() => {})}
          setSelectedQuestion={setSelectedQuestion ?? (() => {})}
          setIsSelectAll={setIsSelectAll ?? (() => {})}
          setIsSelectNone={setIsSelectNone ?? (() => {})}
          selectedQuestion={selectedQuestion}
        />
        <div className="d-flex flex-column gap-2">
          {data.getHeaderGroups().map((headerGroup: any) => (
            <div key={headerGroup.id}>
              {headerGroup.headers
                .filter((header: any) => header.column.getCanFilter())
                .map((header: any) => (
                  <div key={header.id}>
                    <ColumnFilter column={header.column} />
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
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
