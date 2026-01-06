import "./Pagination.scss";

import { Button } from "@/components/ui/button";
import { Options } from "../../Select/Select.types";
import React from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import Select from "../../Select";

export default function Pagination({ table }: any) {
  const pageCount = table.getPageCount();
  const pageSize = table.getState().pagination.pageSize;
  const setPagination = table.setPagination;
  const currentPage = table.getState().pagination.pageIndex;
  const pageStep = 3;
  const pageSizeOptions: Options[] = [10, 20, 50, 100].map((size) => ({
    value: size,
    label: size.toString(),
  }));

  const showPages = () => {
    let buttons = [];

    // only show 10 pages at a time
    let start = currentPage - pageStep;
    let end = currentPage + pageStep;

    if (start < 0) {
      end = end - start;
      start = 0;
    }

    if (end > pageCount) {
      start = start - (end - pageCount);
      end = pageCount;
    }

    if (start < 0) {
      start = 0;
    }

    for (let i = start + 1; i < end - 1; i++) {
      buttons.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "ghost"}
          size="sm"
          className="pagination__page"
          onClick={() => table.setPageIndex(i)}
        >
          {i + 1}
        </Button>
      );
    }

    return buttons;
  };

  return (
    <div className="Pagination">
      <div className="pagination__container">
        <span>Posts per page</span>
        <Select
          options={pageSizeOptions}
          value={pageSize}
          handleChange={(value: number | string) =>
            setPagination({
              pageIndex: 0,
              pageSize: parseInt(value.toString()),
            })
          }
          name="pageSize"
          id="pageSizeSelect"
        />

        <Button
          variant="outline"
          size="icon"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft size={16} />
        </Button>
        <Button
          variant={currentPage === 0 ? "default" : "ghost"}
          size="sm"
          className="pagination__page"
          onClick={() => table.setPageIndex(0)}
        >
          {1}
        </Button>
        {pageCount > 1 && currentPage >= 4 && (
          <Button variant="ghost" size="sm" className="pagination__page" disabled>
            ...
          </Button>
        )}
        {showPages()}
        {pageCount > 1 && pageCount > currentPage + 1 && (
          <Button variant="ghost" size="sm" className="pagination__page" disabled>
            ...
          </Button>
        )}
        <Button
          variant={currentPage === pageCount - 1 ? "default" : "ghost"}
          size="sm"
          className="pagination__page"
          onClick={() => table.setPageIndex(pageCount - 1)}
        >
          {pageCount}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}
