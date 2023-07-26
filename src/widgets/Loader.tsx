import Spinner from "react-bootstrap/Spinner";

function Loader({ size }: { size?: "sm" }) {
  return (
    <Spinner animation="border" size={size} role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  );
}

export default Loader;
