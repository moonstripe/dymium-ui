import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { GenericItem } from "../dymiumTypes";

interface FilterModalProps<T> {
  show: boolean;
  onHide: () => void;
  column: string;
  onApplyFilter: (column: string, value: string, operator: string) => void;
  currentFilter?: {
    value: string;
    operator: string;
  };
}

export const FilterModal = <T extends GenericItem<string>>({
  show,
  onHide,
  column,
  onApplyFilter,
  currentFilter,
}: FilterModalProps<T>) => {
  const [filterValue, setFilterValue] = useState(currentFilter?.value || "");
  const [operator, setOperator] = useState(
    currentFilter?.operator || "contains",
  );

  const handleApply = () => {
    onApplyFilter(column, filterValue, operator);
    onHide();
  };

  const handleClear = () => {
    onApplyFilter(column, "", "");
    onHide();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission
    handleApply();
  };

  // Format column name for display
  const columnName = column
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <Modal show={show} onHide={onHide} centered size="sm">
      <Modal.Header closeButton>
        <Modal.Title className="small">Filter by {columnName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="small">Operator</Form.Label>
            <Form.Select
              size="sm"
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
            >
              <option value="contains">Contains</option>
              <option value="equals">Equals</option>
              <option value="startsWith">Starts With</option>
              <option value="endsWith">Ends With</option>
              {(column === "timestamp" || column === "id") && (
                <>
                  <option value="greaterThan">Greater Than</option>
                  <option value="lessThan">Less Than</option>
                </>
              )}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="small">Value</Form.Label>
            <Form.Control
              size="sm"
              type="text"
              placeholder="Enter filter value"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleApply();
                }
              }}
            />
          </Form.Group>
          {/* Hidden submit button for form submission via Enter key */}
          <button type="submit" style={{ display: "none" }}></button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" size="sm" onClick={handleClear}>
          Clear
        </Button>
        <Button variant="primary" size="sm" onClick={handleApply}>
          Apply Filter
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
