import React from "react";
import {
  Badge,
  Container,
  Nav,
  Navbar,
  Form,
  FormControl,
  Button,
} from "react-bootstrap";
import {
  FaShoppingCart,
  FaMoon,
  FaSun,
  FaUserCircle,
  FaSearch,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../Components/ProductContext";
import logo from "../img/logo.png";
import logos from "../img/logos.png";
import { useTheme } from "../Components/ThemeContext";
import { useSearch } from "../Components/SearchContext";
import "./Header.css";
function Header({ handleCartToggle }) {
  const { cart } = useCart();
  const cartCount = cart.length;
  const { darkMode, toggleDarkMode } = useTheme();
  const { searchTerm, setSearchTerm } = useSearch();
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmedTerm = searchTerm.trim();
    if (trimmedTerm) {
      setSearchTerm(trimmedTerm);
      navigate(`/search?query=${encodeURIComponent(trimmedTerm)}`);
    }
  };

  return (
    <Navbar
      bg={darkMode ? "dark" : "light"}
      variant={darkMode ? "dark" : "light"}
      expand="lg"
      className="shadow-sm sticky-top"
      aria-label="Main Navigation Bar"
      style={{ fontSize: "1rem" }}
    >
      <Container className="d-flex align-items-center justify-content-between">
        {/* Logo */}
        <Navbar.Brand
          as={Link}
          to="/"
          aria-label="Go to homepage"
          className="d-flex align-items-center"
          style={{ maxHeight: 60 }}
        >
          <img
            src={darkMode ? logos : logo}
            alt="Store Logo"
            style={{
              height: "50px",
              width: "auto",
              objectFit: "contain",
              transition: "transform 0.3s ease",
              cursor: "pointer",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar-nav" aria-expanded="false" />

        <Navbar.Collapse id="main-navbar-nav">
          {/* Nav Links */}

          <Nav
            className="me-auto my-2 my-lg-0"
            role="menubar"
            aria-label="Primary navigation"
          >
            <Nav.Link
              as={Link}
              to="/"
              role="menuitem"
              className="rounded-pill-custom"
            >
              Home
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/category"
              role="menuitem"
              className="rounded-pill-custom"
            >
              Category
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/checkout"
              role="menuitem"
              className="rounded-pill-custom"
            >
              Checkout
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/thankyou"
              role="menuitem"
              className="rounded-pill-custom"
            >
              Thank You
            </Nav.Link>
          </Nav>

          {/* Search bar */}
          <Form
            className="d-flex align-items-center me-3"
            onSubmit={handleSearchSubmit}
            role="search"
            aria-label="Product search form"
            style={{ maxWidth: 350, width: "100%" }}
          >
            <FormControl
              type="search"
              placeholder="Search products..."
              className="me-2 rounded-pill"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search products"
              autoComplete="off"
              spellCheck="false"
              style={{
                padding: "0.375rem 1.5rem 0.375rem 1rem",
                boxShadow: "0 2px 6px rgb(0 0 0 / 0.1)",
                border: darkMode ? "1px solid #555" : "1px solid #ccc",
                transition: "border-color 0.3s ease",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#007bff")}
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = darkMode ? "#555" : "#ccc")
              }
            />
            <Button
              variant={darkMode ? "primary" : "outline-primary"}
              type="submit"
              aria-label="Submit search"
              style={{ borderRadius: "50%", padding: "0.4rem 0.6rem" }}
              title="Search"
            >
              <FaSearch />
            </Button>
          </Form>

          {/* Icons */}
          <Nav
            className="align-items-center gap-3"
            role="menubar"
            aria-label="User and cart actions"
          >
            <Button
              variant={darkMode ? "outline-light" : "outline-dark"}
              onClick={toggleDarkMode}
              aria-label={`Switch to ${darkMode ? "light" : "dark"} mode`}
              title="Toggle dark mode"
              className="p-2 d-flex align-items-center justify-content-center"
              style={{
                borderRadius: "50%",
                transition: "background-color 0.3s ease, color 0.3s ease",
                fontSize: "1.1rem",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = darkMode
                  ? "#fff"
                  : "#000";
                e.currentTarget.style.color = darkMode ? "#000" : "#fff";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = darkMode ? "#fff" : "#000";
              }}
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </Button>

            <Nav.Link
              as={Link}
              to="/auth"
              role="menuitem"
              aria-label="User login"
              title="User Login/Register"
            >
              <FaUserCircle size={24} aria-hidden="true" />
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/cart"
              onClick={handleCartToggle}
              className="position-relative"
              aria-label={`View Cart, ${cartCount} item${
                cartCount !== 1 ? "s" : ""
              }`}
              title="Shopping Cart"
            >
              <FaShoppingCart size={24} />
              {cartCount > 0 && (
                <Badge
                  pill
                  bg="danger"
                  className="position-absolute top-0 start-100 translate-middle"
                  style={{
                    fontSize: "0.7rem",
                    minWidth: "18px",
                    height: "18px",
                  }}
                  aria-live="polite"
                >
                  {cartCount}
                </Badge>
              )}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
