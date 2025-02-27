import { JSX } from "@emotion/react/jsx-runtime";
import { Button, FormCheck } from "react-bootstrap";
import { FilterAlt, FilterList } from "@mui/icons-material";
import { GenericItem } from "../dymiumTypes";

interface DymiumTableHeaderProps<T> extends JSX.IntrinsicAttributes {
  item: T;
}

export const DymiumTableHeader = <T extends GenericItem<string>>({
  item,
}: DymiumTableHeaderProps<T>) => {
  const columns = [
    "id",
    "timestamp",
    ...(Object.keys(item) as (keyof T)[]).filter(
      (col) => col !== "id" && col !== "timestamp",
    ),
  ];
  return (
    <thead>
      <tr>
        {/* Static "select" column */}
        <th className="align-middle small">
          <FormCheck />
        </th>

        {/* Dynamically generated column headers */}
        {columns.map((col) => (
          <th
            key={String(col)}
            className="container align-middle text-truncate small"
          >
            <Button className="small px-1 py-0 bg-secondary border-secondary fs-8">
              {String(col)
                .split("_")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
              <FilterAlt fontSize="inherit" style={{ marginLeft: "0.25rem" }} />
            </Button>
          </th>
        ))}

        {/* Static "action" column */}
        <th className="align-middle small container-fluid">
          <Button className="small w-100 px-1 py-0 container bg-secondary border-secondary fs-8">
            Actions
          </Button>
        </th>
      </tr>
    </thead>
  );
};
