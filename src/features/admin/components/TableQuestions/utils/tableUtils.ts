import { FilterFn } from "@tanstack/react-table";
import { rankItem } from "@tanstack/match-sorter-utils";

/**
 * Fuzzy filtering logic using match-sorter
 */
export const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({ itemRank });
  return itemRank.passed;
};

/**
 * Interface for column filtering with fuzzy metadata
 */
declare module "@tanstack/react-table" {
  interface FilterMeta {
    itemRank: import("@tanstack/match-sorter-utils").RankingInfo;
  }
}
