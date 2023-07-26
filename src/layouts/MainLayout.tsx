import { Outlet } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import CustomNavbar from "../widgets/CustomNavbar";

function MainLayout() {
  return (
    <Container fluid="xxl">
      <Row>
        <Col>
          <CustomNavbar />
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
}

export default MainLayout;
