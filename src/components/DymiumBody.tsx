import { JSX } from "@emotion/react/jsx-runtime";
import { Button, Col, FormCheck, Row } from "react-bootstrap";
import { Edit, Delete } from "@mui/icons-material";
import { GenericItem } from "../dymiumTypes";
interface DymiumTableBodyProps<T> extends JSX.IntrinsicAttributes {
  data: T[];
}

const iso8601Regex =
  /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/;

export const DymiumTableBody = <T extends GenericItem<string>>({
  data,
}: DymiumTableBodyProps<T>) => {
  return data && data.length > 0 ? (
    <tbody className="max-vh-80 overflow-scroll">
      {data.map((item, i) => (
        <tr key={`${item.id}`} className="small">
          <td className="align-middle">
            <FormCheck />
          </td>
          {[
            "id",
            "timestamp",
            ...(Object.keys(data[0]) as (keyof T)[]).filter(
              (col) => col !== "id" && col !== "timestamp",
            ),
          ].map((col) => {
            const cellValue = item[col as keyof T];

            // Check if value is a string and matches ISO 8601 format
            const formattedValue =
              typeof cellValue === "string" && iso8601Regex.test(cellValue)
                ? new Date(cellValue).toLocaleDateString() +
                  " " +
                  new Date(cellValue).toLocaleTimeString()
                : cellValue;

            return (
              <td key={String(col)} className="align-middle text-truncate">
                {formattedValue}
              </td>
            );
          })}
          <td className="align-middle">
            <div className="d-flex flex-row gap-1">
              <Button variant="outline-info" className="text-small px-1">
                <Edit className="text-info" />
              </Button>
              <Button variant="outline-danger px-1">
                <Delete className="text-danger" />
              </Button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  ) : (
    <tbody>
      <tr>
        <td>There's nothing here</td>
      </tr>
    </tbody>
  );
};
