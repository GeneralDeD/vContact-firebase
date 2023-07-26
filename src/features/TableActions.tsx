import { Button } from "react-bootstrap";
import { EditIcon } from "../shared/icons/EditIcon";
import { DeleteIcon } from "../shared/icons/DeleteIcon";

type TableActionsProps = {
  handleEdit: () => void;
  handleDelete: () => void;
};

function TableActions({ handleEdit, handleDelete }: TableActionsProps) {
  return (
    <div className="d-flex align-items-center justify-content-center gap-2">
      <Button className="d-flex align-items-center gap-1" variant="warning" onClick={handleEdit}>
        {EditIcon}
        Edit
      </Button>
      <Button className="d-flex align-items-center gap-1" variant="danger" onClick={handleDelete}>
        {DeleteIcon}
        Delete
      </Button>
    </div>
  );
}

export default TableActions;
