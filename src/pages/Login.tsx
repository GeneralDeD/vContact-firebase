import { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useToastStore } from "../store/useToastStore";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase-config";
import { useAuthStore } from "../store/useAuthStore";
import Loader from "../widgets/Loader";
import { LINKS } from "../shared/consts/LINKS";
import { Link } from "react-router-dom";
import { FirebaseError } from "firebase/app";

function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const setInfoToast = useToastStore((store) => store.setInfoToast);
  const setIsAuth = useAuthStore((store) => store.setIsAuth);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const email = event.target[0].value;
    const password = event.target[1].value;

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const user = res.user;
      setInfoToast(true, "Success", "You are logged in", "success");
      setIsAuth(true, { name: user.displayName, email: user.email });
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
          <h1 className="mb-4 text-center">vContact</h1>

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
              Sign in {isLoading && <Loader size="sm" />}
            </Button>
            <div className="mt-2">
              <small>
                Don't have an account? <Link to={LINKS.REGISTRATION}>Register</Link>
              </small>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
