import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import { useToastStore } from "../store/useToastStore";

function CustomToast() {
  const { isShow, status, message, variant, setIsShow } = useToastStore();

  return (
    <ToastContainer className="p-3" position="top-end">
      <Toast show={isShow} bg={variant} onClose={() => setIsShow(false)} delay={3000} autohide>
        <Toast.Header className="justify-content-between">
          <strong>{status}</strong>
        </Toast.Header>
        <Toast.Body>{message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
}

export default CustomToast;
