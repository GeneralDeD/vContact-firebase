import { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useToastStore } from "../store/useToastStore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase-config";
import Loader from "../widgets/Loader";
import { LINKS } from "../shared/consts/LINKS";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";

function Registration() {
  const [isLoading, setIsLoading] = useState(false);
  const setInfoToast = useToastStore((store) => store.setInfoToast);
  const navigate = useNavigate();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const email = event.target[0].value;
    const password = event.target[1].value;

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setInfoToast(true, "Success", "You successfully created account. Please Log in", "success");
      navigate(LINKS.LOGIN);
    } catch (err: FirebaseError | any) {
      setInfoToast(true, "Error", err.message, "danger");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center vh-100 ">
      <Row className="p-5 shadow rounded-2">
        <Col>
          <h1 className="mb-4 text-center">Registration</h1>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="name@example.com" required disabled={isLoading} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="********" required disabled={isLoading} />
            </Form.Group>
            <Button variant="outline-primary" type="submit" disabled={isLoading}>
              Submit {isLoading && <Loader size="sm" />}
            </Button>
            <div className="mt-2">
              <small>
                Do you have an account? <Link to={LINKS.LOGIN}>Login</Link>
              </small>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Registration;
