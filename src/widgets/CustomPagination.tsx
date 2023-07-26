import Pagination from "react-bootstrap/Pagination";
import { PaginType } from "../types/CommonTypes";

type CustomPaginationProps = {
  total: number;
  pagin: PaginType;
  setPagin: (value: React.SetStateAction<PaginType>) => void;
};

function CustomPagination({ total, pagin, setPagin }: CustomPaginationProps) {
  return (
    <Pagination className="justify-content-end">
      {new Array(total).fill(0).map((_, index) => (
        <Pagination.Item
          key={index}
          active={index + 1 === pagin.page}
          onClick={() => index + 1 !== pagin.page && setPagin((prev) => ({ ...prev, page: index + 1 }))}
        >
          {index + 1}
        </Pagination.Item>
      ))}
    </Pagination>
  );
}

export default CustomPagination;
