import { useState } from "react";
import { Form, Button, Alert, InputGroup } from "react-bootstrap";
import { FaEye, FaEyeSlash, FaGoogle, FaFacebook } from "react-icons/fa";
import { toast } from "react-toastify";
import { useTheme } from "../Components/ThemeContext";
import './register.css'
function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { darkMode } = useTheme();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!name || !email || !password || !confirmPass) {
      setError("Please fill in all fields");
      toast.error("Please fill in all fields", {
        autoClose: 2000,
        onClose: () => setIsSubmitting(false),
      });
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email");
      toast.error("Please enter a valid email", {
        autoClose: 2000,
        onClose: () => setIsSubmitting(false),
      });
      return;
    }

    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters, include one uppercase letter, one number, and one special character"
      );
      toast.error(
        "Password must be 8+ chars, 1 uppercase, 1 number & 1 special char",
        {
          autoClose: 2000,
          onClose: () => setIsSubmitting(false),
        }
      );
      return;
    }

    if (password !== confirmPass) {
      setError("Passwords do not match");
      toast.error("Passwords do not match", {
        autoClose: 2000,
        onClose: () => setIsSubmitting(false),
      });
      return;
    }

    setError(null);
    toast.success(`Registered successfully! Welcome, ${name}`, {
      autoClose: 2000,
      onClose: () => {
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPass("");
        setIsSubmitting(false);
      },
    });
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold">Create account</h3>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <div className="d-flex justify-content-between mb-3">
        <Button
          variant="outline-danger"
          className="d-flex align-items-center flex-grow-1 me-2"
          onClick={() =>
            toast.info("Google OAuth coming soon!", { autoClose: 2500 })
          }
          style={{ gap: "0.5rem" }}
        >
          <FaGoogle />
          Google
        </Button>
        <Button
          variant="outline-primary"
          className="d-flex align-items-center flex-grow-1 ms-2"
          onClick={() =>
            toast.info("Facebook OAuth coming soon!", { autoClose: 2500 })
          }
          style={{ gap: "0.5rem" }}
        >
          <FaFacebook />
          Facebook
        </Button>
      </div>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="registerName">
          <Form.Label className="fw-bold">Your name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="animated-input"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="registerEmail">
          <Form.Label className="fw-bold">Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="animated-input"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="registerPassword">
          <Form.Label className="fw-bold">Password</Form.Label>
          <InputGroup>
            <Form.Control
              type={showPassword ? "text" : "password"}
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="animated-input"
            />
            <Button
              variant="outline-secondary"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              style={{
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </Button>
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-4" controlId="registerConfirmPassword">
          <Form.Label className="fw-bold">Re-enter password</Form.Label>
          <InputGroup>
            <Form.Control
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter password"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              className="animated-input"
            />
            <Button
              variant="outline-secondary"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              tabIndex={-1}
              style={{
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
              }}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </Button>
          </InputGroup>
        </Form.Group>

        <Button
          variant="warning"
          type="submit"
          className="w-100 fw-bold"
          disabled={isSubmitting}
          style={{
            backgroundColor: "#f0c14b",
            borderColor: "#a88734",
            color: "#111",
            transition: "all 0.3s ease",
            cursor: isSubmitting ? "not-allowed" : "pointer",
          }}
          onMouseEnter={(e) => {
            if (!isSubmitting)
              e.currentTarget.style.backgroundColor = "#ddb347";
          }}
          onMouseLeave={(e) => {
            if (!isSubmitting)
              e.currentTarget.style.backgroundColor = "#f0c14b";
          }}
        >
          {isSubmitting ? "Please wait..." : "Create your Amazon account"}
        </Button>
      </Form>

      <div
        className="mt-4 text-center"
        style={{ fontSize: "0.9rem", color: darkMode ? "#bbb" : "#555" }}
      >
        <small>
          By creating an account, you agree to Amazon's{" "}
          <a href="/" style={{ textDecoration: "underline" }}>
            Conditions of Use
          </a>{" "}
          and{" "}
          <a href="/" style={{ textDecoration: "underline" }}>
            Privacy Notice
          </a>
          .
        </small>
      </div>

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

export default Register;
