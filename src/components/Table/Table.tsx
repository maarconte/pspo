import "./style.scss";
import "./style-mobile.scss";

import { Column, flexRender } from "@tanstack/react-table";

import { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Pagination from "./Pagination/Pagination";
import { Question } from "../../utils/types";
import TableActions from "./TableActions/TableActions";
import { TableProps } from "./Table.types";
import TableSearch from "./TableSearch";
import { faSortDown } from "@fortawesome/free-solid-svg-icons";
import { faSortUp } from "@fortawesome/free-solid-svg-icons";

const Table: FC<TableProps> = ({
  data,
  columns,
  selectedQuestions,
  setSelectedQuestions,
  setSelectedQuestion,
  setIsSelectAll,
  setIsSelectNone,
  selectedQuestion,
}) => {
  const Filter: FC<{
    column: Column<any, unknown>;
    selectedQuestions: Question[];
    setSelectedQuestions?: React.Dispatch<React.SetStateAction<Question[]>>;
    setSelectedQuestion?: React.Dispatch<
      React.SetStateAction<Question | undefined>
    >;
    setIsSelectAll?: React.Dispatch<React.SetStateAction<boolean>>;
    setIsSelectNone?: React.Dispatch<React.SetStateAction<boolean>>;
    selectedQuestion?: Question;
  }> = ({ column, selectedQuestions }) => {
    const columnFilterValue = column.getFilterValue();

    return (
      <div className="d-flex gap-1 w-100 justify-content-between">
        <TableActions
          selectedQuestions={selectedQuestions}
          setSelectedQuestions={setSelectedQuestions ?? (() => {})}
          setSelectedQuestion={setSelectedQuestion ?? (() => {})}
          setIsSelectAll={setIsSelectAll ?? (() => {})}
          setIsSelectNone={setIsSelectNone ?? (() => {})}
          selectedQuestion={selectedQuestion}
        />
        <TableSearch
          value={(columnFilterValue ?? "") as string}
          onChange={column.setFilterValue}
        />
      </div>
    );
  };

  return (
    <div className="Table">
      {data.getHeaderGroups().map((headerGroup: any) => (
        <div key={headerGroup.id}>
          {headerGroup.headers
            .filter((header: any) => header.column.getCanFilter())
            .map((header: any) => (
              <div key={header.id}>
                <Filter
                  column={header.column}
                  selectedQuestions={selectedQuestions ?? []}
                />
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
