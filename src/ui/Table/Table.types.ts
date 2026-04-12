import { Table as TanStackTable } from "@tanstack/react-table";

export interface TableProps<T> {
  data: TanStackTable<T>;
  selectedItems?: T[];
  selectedItem?: T;
  setSelectedItems?: React.Dispatch<React.SetStateAction<T[]>>;
  setSelectedItem?: React.Dispatch<
    React.SetStateAction<T | undefined>
  >;
  setIsSelectAll?: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSelectNone?: React.Dispatch<React.SetStateAction<boolean>>;
  renderHeaderAddon?: (table: TanStackTable<T>) => React.ReactNode;
}
