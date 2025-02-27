import { JSX } from "@emotion/react/jsx-runtime";
import { Button, FormCheck } from "react-bootstrap";
import { FilterAlt } from "@mui/icons-material";
import { GenericItem } from "../dymiumTypes";
import { useState } from "react";
import { FilterModal } from "./FilterModal";

interface DymiumTableHeaderProps<T> extends JSX.IntrinsicAttributes {
  item: T;
  activeFilters: {
    [column: string]: {
      value: string;
      operator: string;
    };
  };
  onApplyFilter: (column: string, value: string, operator: string) => void;
}

export const DymiumTableHeader = <T extends GenericItem<string>>({
  item,
  activeFilters,
  onApplyFilter,
}: DymiumTableHeaderProps<T>) => {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterColumn, setFilterColumn] = useState("");

  const columns = [
    "id",
    "timestamp",
    ...(Object.keys(item) as (keyof T)[]).filter(
      (col) => col !== "id" && col !== "timestamp",
    ),
  ];

  const handleFilterClick = (column: string) => {
    setFilterColumn(column);
    setShowFilterModal(true);
  };

  return (
    <>
      <thead>
        <tr>
          {/* Static "select" column */}
          <th className="align-middle small">
            <FormCheck />
          </th>

          {/* Dynamically generated column headers */}
          {columns.map((col) => {
            const columnStr = String(col);
            const hasActiveFilter =
              activeFilters[columnStr] && activeFilters[columnStr].value !== "";

            return (
              <th
                key={columnStr}
                className="container align-middle text-truncate small"
              >
                <Button
                  className={`small px-1 py-0 ${hasActiveFilter ? "bg-primary border-primary" : "bg-secondary border-secondary"} fs-8`}
                  onClick={() => handleFilterClick(columnStr)}
                >
                  {columnStr
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                  <FilterAlt
                    fontSize="inherit"
                    style={{ marginLeft: "0.25rem" }}
                  />
                </Button>
              </th>
            );
          })}

          {/* Static "action" column */}
          <th className="align-middle small container-fluid">
            <Button className="small w-100 px-1 py-0 container bg-secondary border-secondary fs-8">
              Actions
            </Button>
          </th>
        </tr>
      </thead>

      {/* Filter Modal */}
      <FilterModal
        show={showFilterModal}
        onHide={() => setShowFilterModal(false)}
        column={filterColumn}
        onApplyFilter={onApplyFilter}
        currentFilter={activeFilters[filterColumn]}
      />
    </>
  );
};
