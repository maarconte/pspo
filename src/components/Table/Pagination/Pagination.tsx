import "./Pagination.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

export default function Pagination({ table }: any) {
  const showPages = () => {
    const pageCount = table.getPageCount();
    const currentPage = table.getState().pagination.pageIndex;
    let buttons = [];

    for (let i = 0; i < pageCount; i++) {
      buttons.push(
        <button
          key={i}
          className={`pagination__page ${
            currentPage === i && "pagination__page--active"
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
        <button
          className="pagination__navigation"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        {showPages()}
        <button
          className="pagination__navigation"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
    </div>
  );
}
