import "./Pagination.scss";

import Button from "../../Button";
import { Button_Style } from "../../Button/Button.types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Options } from "../../Select/Select.types";
import React from "react";
import Select from "../../Select";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

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
  console.log(table.getState().pagination.pageSize);
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
        <button
          key={i}
          className={`pagination__page ${
            currentPage === i ? "pagination__page--active" : ""
          }`}
          onClick={() => table.setPageIndex(i)}
        >
          {i + 1}
        </button>
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
        />

        <Button
          style={Button_Style.OUTLINED}
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          isIconButton
          icon={<FontAwesomeIcon icon={faChevronLeft} />}
        />
        <button
          className={`pagination__page ${
            currentPage === 0 ? "pagination__page--active" : ""
          }`}
          onClick={() => table.setPageIndex(0)}
        >
          {1}
        </button>
        {pageCount > 1 && currentPage >= 4 && (
          <button className="pagination__page pagination__page--dots" disabled>
            ...
          </button>
        )}
        {showPages()}
        {pageCount > 1 && pageCount > currentPage + 1 && (
          <button className="pagination__page pagination__page--dots" disabled>
            ...
          </button>
        )}
        <button
          className={`pagination__page ${
            currentPage === pageCount - 1 ? "pagination__page--active" : ""
          }`}
          onClick={() => table.setPageIndex(pageCount - 1)}
        >
          {pageCount}
        </button>
        <Button
          style={Button_Style.OUTLINED}
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          isIconButton
          icon={<FontAwesomeIcon icon={faChevronRight} />}
        />
      </div>
    </div>
  );
}
