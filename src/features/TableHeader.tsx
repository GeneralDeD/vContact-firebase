import { Row, Col, Button, Form, InputGroup } from "react-bootstrap";
import { PaginType } from "../types/CommonTypes";
import { LIMIT_OPTIONS } from "../shared/consts/LIMIT_OPTIONS";
import { AddIcon } from "../shared/icons/AddIcon";

type TableHeaderProps = {
  title: string;
  isLoading: boolean;
  pagin: PaginType;
  setPagin: React.Dispatch<React.SetStateAction<PaginType>>;
  handleAddTitle: string;
  handleAddNewItem: () => void;
};

function TableHeader({ title, isLoading, pagin, setPagin, handleAddTitle, handleAddNewItem }: TableHeaderProps) {
  return (
    <Row className="align-items-end mb-3">
      <Col>
        <h1 className="mb-0">{title}</h1>
      </Col>
      <Col className="d-flex align-items-center gap-3 justify-content-end">
        <InputGroup style={{ width: "300px" }}>
          <Form.Control type="search" placeholder="Tag name" disabled={isLoading} />
          <Button disabled={isLoading}>Search</Button>
        </InputGroup>
        <Form.Select
          onChange={(e) => setPagin((prev) => ({ ...prev, limit: +e.target.value }))}
          style={{ width: "80px" }}
          disabled={isLoading}
        >
          {LIMIT_OPTIONS.map((item) => (
            <option key={item} value={item} selected={pagin.limit === item}>
              {item}
            </option>
          ))}
        </Form.Select>
        <Button className="d-flex align-items-center gap-1" onClick={handleAddNewItem} disabled={isLoading}>
          {AddIcon}
          {handleAddTitle}
        </Button>
      </Col>
    </Row>
  );
}

export default TableHeader;
