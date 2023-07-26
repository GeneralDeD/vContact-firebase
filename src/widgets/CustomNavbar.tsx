import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { LINKS } from "../shared/consts/LINKS";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

function CustomNavbar() {
  const menu = [
    {
      link: LINKS.HOME,
      title: "Home",
    },
    {
      link: LINKS.TAGS,
      title: "Tags",
    },
  ];

  const setIsAuth = useAuthStore((store) => store.setIsAuth);

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container fluid="xxl">
        <Navbar.Brand>vContact</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto flex gap-3">
            {menu.map((item) => (
              <Link key={item.link} to={item.link}>
                {item.title}
              </Link>
            ))}
          </Nav>
          <NavDropdown title="User" align="end">
            <NavDropdown.Item onClick={() => setIsAuth(false, null)}>Logout</NavDropdown.Item>
          </NavDropdown>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CustomNavbar;
