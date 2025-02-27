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
    <tbody className="max-vh-80 overflow-scroll w-100 px-0">
      {data.map((item, i) => (
        <tr key={`${item.id}`} className="small px-0">
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

            if (col === "level") {
              switch (formattedValue) {
                case "INFO":
                  return (
                    <td
                      key={String(col)}
                      className="align-middle text-truncate w-fit"
                    >
                      <span className="rounded bg-primary disabled text-light p-1">
                        {formattedValue}
                      </span>
                    </td>
                  );

                case "WARN":
                  return (
                    <td
                      key={String(col)}
                      className="align-middle text-truncate w-fit"
                    >
                      <span className="rounded disabled bg-warning text-light p-1">
                        {formattedValue}
                      </span>
                    </td>
                  );
                case "ERROR":
                  return (
                    <td
                      key={String(col)}
                      className="align-middle text-truncate w-fit"
                    >
                      <span className="rounded disabled bg-danger text-light p-1">
                        {formattedValue}
                      </span>
                    </td>
                  );

                default:
                  console.error("New level invented");
                  break;
              }
              return (
                <td
                  key={String(col)}
                  className="align-middle text-truncate w-fit"
                >
                  <span className="rounded background">{formattedValue}</span>
                </td>
              );
            }

            return (
              <td
                key={String(col)}
                className="align-middle text-truncate w-fit"
              >
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
        <td colSpan={10} className="small text-secondary">
          There's nothing here...
        </td>
      </tr>
    </tbody>
  );
};
