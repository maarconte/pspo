import "./style.scss";
import "./style-mobile.scss";

import React, { FC, useEffect, useState } from "react";
import { Search } from "lucide-react";

import { TableSearchProps } from "./TableSearch.types";

const TableSearch: FC<TableSearchProps> = ({
  value: initialValue,
  onChange,
}) => {
  const [value, setValue] = useState(initialValue);
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const handleSearch = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        onChange(value);
      }, 500);
    };
    handleSearch();
    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <div className="TableSearch">
      <Search size={16} className="TableSearch__icon" />
      <input
        type="text"
        placeholder="Search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        name="search"
        id="TableSearchInput"
        aria-label="Search"
        className="TableSearch__input"
      />
    </div>
  );
};

export default TableSearch;
