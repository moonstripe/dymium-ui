import {
  Table,
  Button,
  Form,
  InputGroup,
  Row,
  Container,
  Pagination,
  Col,
} from "react-bootstrap";
import { useState, useEffect, useRef, useMemo } from "react";
import { DymiumTableBody } from "./DymiumBody";
import { DymiumTableHeader } from "./DymiumHeader";
import { GenericLiveItem, DummyLog } from "../dymiumTypes";
import { Pause, PlayArrow } from "@mui/icons-material";

interface DymiumTableViewProps extends Partial<HTMLTableElement> {
  itemsPerPage?: number;
  sseUrl: string;
}

export const DymiumLiveTable = <T extends GenericLiveItem<string>>({
  itemsPerPage = 12,
  sseUrl,
  ...props
}: DymiumTableViewProps) => {
  const [searchFilter, setSearchFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [columnFilters, setColumnFilters] = useState<{
    [column: string]: {
      value: string;
      operator: string;
    };
  }>({});
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [pauseBuffer, setPauseBuffer] = useState<T[]>([]);
  const [liveItems, setLiveItems] = useState<T[]>([]);
  const sseRef = useRef<EventSource>(null);

  useEffect(() => {
    sseRef.current = new EventSource(sseUrl);
    sseRef.current.onopen = (e) => {
      console.log("open", e);
    };

    sseRef.current.onmessage = (e: MessageEvent<string>) => {
      console.log(JSON.parse(e.data));

      const messageData: T = JSON.parse(e.data);
      if (isPaused) {
        setPauseBuffer((prevPauseBuffer) => [messageData, ...prevPauseBuffer]);
      } else {
        setLiveItems((prevLiveItems) => [messageData, ...prevLiveItems]);
      }
    };

    return () => sseRef.current?.close();
  }, [isPaused]);

  const handleApplyFilter = (
    column: string,
    value: string,
    operator: string,
  ) => {
    setCurrentPage(1); // Reset to first page when filter changes

    if (value === "" && operator === "") {
      // Clear the filter for this column
      const newFilters = { ...columnFilters };
      delete newFilters[column];
      setColumnFilters(newFilters);
    } else {
      // Set the filter
      setColumnFilters({
        ...columnFilters,
        [column]: { value, operator },
      });
    }
  };

  const applyFilters = (item: T): boolean => {
    // Check if item matches text search
    const matchesSearch =
      typeof item === "object" &&
      item !== null &&
      "message" in item &&
      item.message.toLowerCase().includes(searchFilter.toLowerCase());

    if (!matchesSearch) return false;

    // Check if item matches all column filters
    for (const [column, filter] of Object.entries(columnFilters)) {
      const value = String(item[column as keyof T] || "").toLowerCase();
      const filterValue = filter.value.toLowerCase();

      switch (filter.operator) {
        case "contains":
          if (!value.includes(filterValue)) return false;
          break;
        case "equals":
          if (value !== filterValue) return false;
          break;
        case "startsWith":
          if (!value.startsWith(filterValue)) return false;
          break;
        case "endsWith":
          if (!value.endsWith(filterValue)) return false;
          break;
        case "greaterThan":
          if (value <= filterValue) return false;
          break;
        case "lessThan":
          if (value >= filterValue) return false;
          break;
        default:
          break;
      }
    }

    return true;
  };

  const filteredData = useMemo(() => {
    return liveItems.filter(applyFilters);
  }, [liveItems, searchFilter, columnFilters]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleClearAllFilters = () => {
    setSearchFilter("");
    setColumnFilters({});
    setCurrentPage(1);
  };

  const activeFilterCount =
    Object.keys(columnFilters).length + (searchFilter ? 1 : 0);

  const handlePlayPause = () => {
    if (isPaused) {
      // going from paused to live
      setLiveItems((prevItems) => [...pauseBuffer, ...prevItems]);
      setPauseBuffer([]);
    }
    setIsPaused((prevState) => !prevState);
  };

  return (
    <div
      className={
        props.className ? `${props.className}` : "w-100 px-0 container-fluid"
      }
    >
      {/* Header Section */}
      <Row className="d-flex w-100 px-0 w-100 my-2 mx-auto">
        <Col xs={12} md={3} className="containter-fluid my-auto">
          <InputGroup className="container-fluid h-100 px-0">
            {liveItems.length === 0 ? (
              <>
                <Button variant="outline-secondary small">Loading...</Button>
              </>
            ) : !isPaused ? (
              <>
                <Button
                  disabled
                  variant="outline-secondary small bg-success text-light"
                >
                  Live
                </Button>
                <Button
                  variant="outline-secondary small p-1"
                  onClick={handlePlayPause}
                >
                  <Pause />
                </Button>
              </>
            ) : (
              <>
                <Button disabled variant="outline-secondary small bg-warning">
                  Paused
                </Button>
                <Button
                  variant="outline-secondary  small p-1"
                  onClick={handlePlayPause}
                >
                  <PlayArrow />
                </Button>
              </>
            )}
          </InputGroup>
        </Col>
        <Col xs={12} md={6} className="container-fluid flex-row my-auto">
          <InputGroup className="container-fluid h-100">
            <Form.Control
              placeholder="Search by message..."
              value={searchFilter}
              className="small"
              onChange={(e) => {
                setCurrentPage(1);
                setSearchFilter(e.target.value);
              }}
            />
            <Button variant="outline-secondary small">Search</Button>
            {activeFilterCount > 0 && (
              <Button
                variant="outline-danger small"
                onClick={handleClearAllFilters}
              >
                Clear All Filters ({activeFilterCount})
              </Button>
            )}
          </InputGroup>
        </Col>
        <Col xs={12} md={3} className="d-flex flex-col px-0">
          <div className="w-100 d-flex flex-col justify-content-end px-0 me-0">
            <Pagination size="sm" className="me-0 flex-nowrap small my-auto">
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
                  {currentPage > 2 && <Pagination.Ellipsis disabled />}
                </>
              ) : null}
              <Pagination.Item active>{currentPage}</Pagination.Item>
              {totalPages > 1 && currentPage !== totalPages ? (
                <>
                  {currentPage < totalPages - 1 && (
                    <Pagination.Ellipsis disabled />
                  )}
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
          </div>
        </Col>
      </Row>
      <Row className="d-flex w-100 px-8 w-100 max-vh-80 overflow-x-scroll mx-auto">
        <Table striped hover className="table-fixed px-0 containter-fluid">
          <DymiumTableHeader
            item={
              liveItems.length > 0 ? liveItems[0] : ({ id: "" } as DummyLog)
            }
            activeFilters={columnFilters}
            onApplyFilter={handleApplyFilter}
          />
          {isPaused ? (
            <tr>
              <td
                colSpan={10}
                className="small text-secondary py-2 text-center new-logs"
                onClick={handlePlayPause}
              >
                <a>{pauseBuffer.length} more recent logs...</a>
              </td>
            </tr>
          ) : null}
          <DymiumTableBody data={paginatedData} />
        </Table>
      </Row>
    </div>
  );
};
