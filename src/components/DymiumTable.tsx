import {
  Table,
  Button,
  Form,
  InputGroup,
  Row,
  Container,
  Pagination,
} from "react-bootstrap";
import { useState } from "react";
import { DymiumTableBody } from "./DymiumBody";
import { DymiumTableHeader } from "./DymiumHeader";
import { GenericItem, DummyLog } from "../dymiumTypes";

interface DymiumTableViewProps<T> extends Partial<HTMLTableElement> {
  data: T[];
  itemsPerPage?: number;
}

export const DymiumTableView = <T extends GenericItem<string>>({
  data,
  itemsPerPage = 15,
  ...props
}: DymiumTableViewProps<T>) => {
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = data.filter(
    (item) =>
      typeof item === "object" &&
      item !== null &&
      "message" in item &&
      item.message.toLowerCase().includes(filter.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <Container className={props.className ? `${props.className}` : ""}>
      {/* Header Section */}
      <Row className="container-fluid small w-100">
        <InputGroup>
          <Form.Control
            placeholder="Search by name..."
            value={filter}
            className="small"
            onChange={(e) => {
              setCurrentPage(1);
              setFilter(e.target.value);
            }}
          />
          <Button variant="outline-secondary small">Search</Button>
        </InputGroup>
      </Row>
      <Row className="container-fluid max-vh-80">
        <Table
          striped
          hover
          responsive
          className="container-fluid overflow-scroll table-responsive"
        >
          <DymiumTableHeader
            item={data.length > 0 ? data[0] : ({ id: "" } as DummyLog)}
          />
          <DymiumTableBody data={paginatedData} />
        </Table>
      </Row>
      <Row className="container-fluid w-100 mx-auto">
        <Pagination className="container-fluid">
          <Pagination.First
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          />
          <Pagination.Prev
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          />
          {totalPages > 1 && currentPage !== 1 ? (
            <>
              <Pagination.Item onClick={() => setCurrentPage(1)}>
                {1}
              </Pagination.Item>
              <Pagination.Ellipsis disabled />
            </>
          ) : null}
          <Pagination.Item active>{currentPage}</Pagination.Item>
          {totalPages > 1 && currentPage !== totalPages ? (
            <>
              <Pagination.Ellipsis disabled />
              <Pagination.Item onClick={() => setCurrentPage(totalPages)}>
                {totalPages}
              </Pagination.Item>
            </>
          ) : null}
          <Pagination.Next
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          />
          <Pagination.Last
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      </Row>
    </Container>
  );
};
