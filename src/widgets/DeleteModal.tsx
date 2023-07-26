import { Modal, Button } from "react-bootstrap";
import Loader from "./Loader";

type DeleteModalProps = {
  show: boolean;
  title: string;
  isLoading: boolean;
  handleClose: () => void;
  handleDelete: () => void;
};

function DeleteModal({ show, title, isLoading, handleClose, handleDelete }: DeleteModalProps) {
  return (
    <Modal show={show} onHide={handleClose} onEscapeKeyDown={handleClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex align-items-center justify-content-end gap-2">
          <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
            Close
          </Button>
          <Button variant="danger" disabled={isLoading} onClick={handleDelete}>
            Delete {isLoading && <Loader size="sm" />}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default DeleteModal;
