import "./style.scss";
import "./style-mobile.scss";

import React, { FC, useEffect, useState } from "react";

import Input from "../../Input";
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
      <Input
        placeholder="Search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        name="search"
        id="TableSearchInput"
      />
    </div>
  );
};

export default TableSearch;
