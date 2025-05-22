import { useState } from "react";
import { Form, Button, Alert, InputGroup } from "react-bootstrap";
import { FaEye, FaEyeSlash, FaGoogle, FaFacebook } from "react-icons/fa";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !password) {
      setError("Please fill in all fields");
      toast.error("Please fill in all fields", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      toast.error("Please enter a valid email address", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    setError(null);
    toast.success(`Logging in with\nEmail: ${email}`, {
      position: "top-center",
      autoClose: 3000,
    });
  };

  const handleGoogleLogin = () => {
    toast.info("Google OAuth clicked", {
      position: "top-center",
      autoClose: 2000,
    });
  };

  const handleFacebookLogin = () => {
    toast.info("Facebook OAuth clicked", {
      position: "top-center",
      autoClose: 2000,
    });
  };

  return (
    <div>
      <h3 className="mb-4 fw-bold">Sign-In</h3>
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Social Login Buttons */}
      <div className="d-flex justify-content-between mb-3">
        <Button
          variant="outline-danger"
          className="d-flex align-items-center flex-grow-1 me-2"
          onClick={handleGoogleLogin}
          style={{ gap: "0.5rem" }}
        >
          <FaGoogle />
          Google
        </Button>
        <Button
          variant="outline-primary"
          className="d-flex align-items-center flex-grow-1 ms-2"
          onClick={handleFacebookLogin}
          style={{ gap: "0.5rem" }}
        >
          <FaFacebook />
          Facebook
        </Button>
      </div>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="loginEmail">
          <Form.Label className="fw-bold">
            Email or mobile phone number
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter email or mobile number"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="animated-input"
          />
        </Form.Group>

        <Form.Group className="mb-4" controlId="loginPassword">
          <Form.Label className="fw-bold">Password</Form.Label>
          <InputGroup>
            <Form.Control
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="animated-input"
            />
            <Button
              type="button"
              variant="outline-secondary"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </Button>
          </InputGroup>
        </Form.Group>

        <Button
          variant="warning"
          type="submit"
          className="w-100 fw-bold"
          style={{
            backgroundColor: "#f0c14b",
            borderColor: "#a88734",
            color: "#111",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#ddb347";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#f0c14b";
          }}
        >
          Sign-In
        </Button>
      </Form>

      <div
        className="mt-4 text-center"
        style={{ fontSize: "0.9rem", color: "#555" }}
      >
        <small>
          By signing-in, you agree to Amazon's{" "}
          <a href="/conditions" style={{ textDecoration: "underline" }}>
            Conditions of Use
          </a>{" "}
          and{" "}
          <a href="/privacy" style={{ textDecoration: "underline" }}>
            Privacy Notice
          </a>
          .
        </small>
      </div>

      {/* Toast Container */}
      <ToastContainer />

      {/* Custom CSS for input animation */}
      <style>{`
        .animated-input {
          border-radius: 4px;
          padding: 10px;
          border: 1px solid #ddd;
          transition: border-color 0.3s ease;
        }
        .animated-input:focus {
          border-color: #f0c14b;
          box-shadow: 0 0 5px #f0c14b;
          outline: none;
        }
      `}</style>
    </div>
  );
}

export default Login;
