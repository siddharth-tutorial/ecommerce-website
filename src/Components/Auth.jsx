
import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Container, Card, Nav, Image } from "react-bootstrap";
import { useTheme } from "../Components/ThemeContext";
import logos from "../img/logos.png";
import logo from "../img/logo.png";
import "./auth.css";

function Auth() {
  const location = useLocation();
  const { darkMode } = useTheme();

  // Loading state for demo (simulate loading for 2s)
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        background: darkMode
          ? "linear-gradient(to bottom, #0f0f0f, #1e1e1e)"
          : "linear-gradient(to bottom, #fdfdfd, #e9ecef)",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
        transition: "background 0.3s ease",
      }}
    >
      <Container style={{ maxWidth: 420 }} className="p-0">
        {/* Logo */}
        <div className="text-center mb-4">
          <Link to="/">
            <Image
              src={darkMode ? logos : logo}
              alt="Amazon Logo"
              style={{ width: 130 }}
              fluid
            />
          </Link>
        </div>

        <Card
          className="shadow-lg border-0"
          style={{
            borderRadius: "20px",
            padding: "2rem",
            backgroundColor: darkMode ? "#1f1f1f" : "#ffffffcc",
            color: darkMode ? "#f0f0f0" : "#000",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            transition: "all 0.3s ease-in-out",
            minHeight: 400,
          }}
        >
          {/* Skeleton Loader */}
          {loading ? (
            <div className="skeleton-wrapper">
              <div className="skeleton-nav" />
              <div className="skeleton-input" />
              <div className="skeleton-input" />
              <div className="skeleton-button" />
              <div className="skeleton-footer" />
            </div>
          ) : (
            <>
              {/* Navigation Tabs */}
              <Nav
                variant="pills"
                fill
                defaultActiveKey={
                  location.pathname.includes("register") ? "register" : "login"
                }
                className="mb-4 nav-pills-modern"
              >
                <Nav.Item>
                  <Nav.Link
                    as={Link}
                    to="login"
                    eventKey="login"
                    active={
                      location.pathname.endsWith("login") ||
                      location.pathname === "/auth"
                    }
                    className="fw-semibold"
                    style={{ borderRadius: "10px", fontSize: "1rem" }}
                  >
                    Log In
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    as={Link}
                    to="register"
                    eventKey="register"
                    active={location.pathname.endsWith("register")}
                    className="fw-semibold"
                    style={{ borderRadius: "10px", fontSize: "1rem" }}
                  >
                    Register
                  </Nav.Link>
                </Nav.Item>
              </Nav>

              {/* Auth Form */}
              <div className="mb-2">
                <Outlet />
              </div>

              {/* Footer */}
              <div
                className="text-center mt-3"
                style={{
                  fontSize: "0.85rem",
                  color: darkMode ? "#aaa" : "#555",
                }}
              >
                By continuing, you agree to Amazon's{" "}
                <Link
                  to="/"
                  style={{
                    textDecoration: "underline",
                    color: darkMode ? "#ccc" : "#000",
                  }}
                >
                  Conditions of Use
                </Link>{" "}
                and{" "}
                <Link
                  to="/"
                  style={{
                    textDecoration: "underline",
                    color: darkMode ? "#ccc" : "#000",
                  }}
                >
                  Privacy Notice
                </Link>
                .
              </div>
            </>
          )}
        </Card>
      </Container>
    </div>
  );
}

export default Auth;
