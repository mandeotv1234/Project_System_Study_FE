import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "../../Style/style.css";
import "../../Style/Header.scss";

function Header() {
  const navigate = useNavigate();

  // Kiểm tra trạng thái đăng nhập
  const isLoggedIn = !!localStorage.getItem("token"); // Kiểm tra token trong localStorage

  const handleLogout = () => {
    localStorage.removeItem("token"); // Xóa token
    localStorage.removeItem("role"); // Xóa role nếu có
    alert("Bạn đã đăng xuất!");
    navigate("/login"); // Điều hướng về trang đăng nhập
  };

  return (
    <>
      <Navbar variant="light" expand="lg" fixed="top">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <i className="fas fa-university"></i> Dom Dom <br />
            <small>Group</small>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="ml-auto">
              <Nav.Link as={NavLink} to="/" className="navbar__item">
                Trang chủ
              </Nav.Link>
              {isLoggedIn ? (
                <Button
                  variant="outline-danger"
                  className="ms-3"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              ) : (
                <Nav.Link as={NavLink} to="/login" className="navbar__item">
                  Login
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;