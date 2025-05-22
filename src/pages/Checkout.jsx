import React, { useState, useEffect } from "react";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Image,
  Card,
  Toast,
  ToastContainer,
  ProgressBar,
  Spinner,
  ListGroup,
} from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../Components/ProductContext";
import { useTheme } from "../Components/ThemeContext";

const steps = ["Delivery Details", "Payment Details", "Review & Confirm"];

export default function Checkout() {
  const { clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const cart = location.state?.cart || [];
  const { darkMode } = useTheme();

  const [currentStep, setCurrentStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    upiId: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [errors, setErrors] = useState({});
  const [showToast, setShowToast] = useState({
    show: false,
    message: "",
    bg: "success",
  });
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Simulate loading for 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const totalAmount = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const cardNumberPattern = /^\d{16}$/;
  const expiryPattern = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
  const cvvPattern = /^\d{3,4}$/;
  const upiPattern = /^[\w.-]+@[\w]+$/;

  const validateStep = () => {
    const newErrors = {};
    if (currentStep === 0) {
      if (!formData.fullName.trim())
        newErrors.fullName = "Full name is required";
      if (!formData.address.trim()) newErrors.address = "Address is required";
    }
    if (currentStep === 1) {
      if (paymentMethod === "UPI") {
        if (!formData.upiId.trim()) newErrors.upiId = "UPI ID is required";
        else if (!upiPattern.test(formData.upiId.trim()))
          newErrors.upiId = "Invalid UPI ID";
      }
      if (paymentMethod === "Credit Card") {
        if (!cardNumberPattern.test(formData.cardNumber.replace(/\s/g, "")))
          newErrors.cardNumber = "Card number must be 16 digits";
        if (!expiryPattern.test(formData.expiry.trim()))
          newErrors.expiry = "Expiry must be in MM/YY";
        if (!cvvPattern.test(formData.cvv.trim()))
          newErrors.cvv = "CVV must be 3 or 4 digits";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
      setErrors({});
    } else {
      setShowToast({
        show: true,
        message: "Please fix form errors.",
        bg: "danger",
      });
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = () => {
    if (!validateStep()) {
      setShowToast({
        show: true,
        message: "Please fix form errors.",
        bg: "danger",
      });
      return;
    }
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      clearCart();
      setShowToast({
        show: true,
        message: "Payment successful! Order placed.",
        bg: "success",
      });
      setTimeout(() => navigate("/thankyou"), 1500);
    }, 2500);
  };

  return (
    <div
      style={{
        backgroundColor: darkMode ? "#121212" : "#fff",
        color: darkMode ? "#eee" : "#000",
        minHeight: "100vh",
        padding: "1rem",
      }}
    >
      <Container
        className="py-5"
        style={{ maxWidth: "1100px", fontFamily: "'Amazon Ember', sans-serif" }}
      >
        <ToastContainer
          position="top-end"
          className="p-3"
          style={{ zIndex: 1055 }}
        >
          <Toast
            onClose={() =>
              setShowToast({ show: false, message: "", bg: "success" })
            }
            show={showToast.show}
            delay={3000}
            autohide
            bg={showToast.bg}
          >
            <Toast.Body className="text-white">{showToast.message}</Toast.Body>
          </Toast>
        </ToastContainer>

        <h2 className="mb-4 fw-bold">Checkout</h2>
        <ProgressBar
          now={((currentStep + 1) / steps.length) * 100}
          variant="warning"
          className="mb-4"
        />

        <Row>
          {/* FORM AREA */}
          <Col md={7}>
            <Card
              className="p-4 shadow-sm border-0 mb-4"
              style={{ minHeight: "400px" }}
            >
              {loading ? (
                <>
                  <Skeleton height={40} width={200} className="mb-3" />
                  <Skeleton count={3} height={50} className="mb-2" />
                </>
              ) : (
                <>
                  {currentStep === 0 && (
                    <>
                      <h5 className="mb-3 fw-bold">Delivery Details</h5>
                      <Form>
                        <Form.Group className="mb-3">
                          <Form.Label>Full Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            isInvalid={!!errors.fullName}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.fullName}
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group>
                          <Form.Label>Address</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            isInvalid={!!errors.address}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.address}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Form>
                    </>
                  )}

                  {currentStep === 1 && (
                    <>
                      <h5 className="mb-3 fw-bold">Payment Details</h5>
                      <Form>
                        <Form.Group className="mb-3">
                          <Form.Label>Payment Method</Form.Label>
                          <Form.Select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                          >
                            <option>Cash on Delivery</option>
                            <option>UPI</option>
                            <option>Credit Card</option>
                          </Form.Select>
                        </Form.Group>

                        {paymentMethod === "UPI" && (
                          <Form.Group>
                            <Form.Label>UPI ID</Form.Label>
                            <Form.Control
                              type="text"
                              name="upiId"
                              value={formData.upiId}
                              onChange={handleChange}
                              isInvalid={!!errors.upiId}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.upiId}
                            </Form.Control.Feedback>
                          </Form.Group>
                        )}

                        {paymentMethod === "Credit Card" && (
                          <>
                            <Form.Group className="mb-3">
                              <Form.Label>Card Number</Form.Label>
                              <Form.Control
                                type="text"
                                name="cardNumber"
                                maxLength={19}
                                placeholder="1234 5678 9012 3456"
                                value={formData.cardNumber}
                                onChange={(e) => {
                                  let val = e.target.value.replace(/\D/g, "");
                                  val = val.match(/.{1,4}/g)?.join(" ") || "";
                                  setFormData((prev) => ({
                                    ...prev,
                                    cardNumber: val,
                                  }));
                                }}
                                isInvalid={!!errors.cardNumber}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.cardNumber}
                              </Form.Control.Feedback>
                            </Form.Group>

                            <Row>
                              <Col>
                                <Form.Group>
                                  <Form.Label>Expiry</Form.Label>
                                  <Form.Control
                                    type="text"
                                    name="expiry"
                                    placeholder="MM/YY"
                                    maxLength={5}
                                    value={formData.expiry}
                                    onChange={handleChange}
                                    isInvalid={!!errors.expiry}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {errors.expiry}
                                  </Form.Control.Feedback>
                                </Form.Group>
                              </Col>
                              <Col>
                                <Form.Group>
                                  <Form.Label>CVV</Form.Label>
                                  <Form.Control
                                    type="password"
                                    name="cvv"
                                    maxLength={4}
                                    placeholder="123"
                                    value={formData.cvv}
                                    onChange={handleChange}
                                    isInvalid={!!errors.cvv}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {errors.cvv}
                                  </Form.Control.Feedback>
                                </Form.Group>
                              </Col>
                            </Row>
                          </>
                        )}
                      </Form>
                    </>
                  )}

                  {currentStep === 2 && (
                    <>
                      <h5 className="mb-3 fw-bold">Review & Confirm</h5>
                      <ListGroup variant="flush">
                        {cart.map((item, index) => (
                          <ListGroup.Item
                            key={index}
                            className="d-flex align-items-center justify-content-between"
                          >
                            <div>
                              <strong>{item.title}</strong> × {item.quantity}
                            </div>
                            <span>
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </span>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                      <div className="mt-4 text-end">
                        <h5>Total: ₹{totalAmount.toFixed(2)}</h5>
                      </div>
                    </>
                  )}

                  <div className="mt-4 d-flex justify-content-between">
                    <Button
                      variant="outline-secondary"
                      onClick={handleBack}
                      disabled={currentStep === 0 || processing}
                    >
                      Back
                    </Button>
                    {currentStep < steps.length - 1 ? (
                      <Button
                        variant="warning"
                        onClick={handleNext}
                        disabled={processing}
                      >
                        Next
                      </Button>
                    ) : (
                      <Button
                        variant="success"
                        onClick={handlePlaceOrder}
                        disabled={processing}
                      >
                        {processing ? (
                          <>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                              className="me-2"
                            />
                            Processing...
                          </>
                        ) : (
                          "Place Order"
                        )}
                      </Button>
                    )}
                  </div>
                </>
              )}
            </Card>
          </Col>

          {/* CART SUMMARY AREA */}
          <Col md={5}>
            <Card
              className="p-3 shadow-sm border-0"
              style={{ minHeight: "400px" }}
              bg={darkMode ? "dark" : "light"}
              text={darkMode ? "light" : "dark"}
            >
              <h5 className="mb-3 fw-bold">Cart Summary</h5>
              {loading ? (
                <>
                  <Skeleton height={30} count={5} className="mb-2" />
                  <Skeleton height={25} width={100} className="mt-3" />
                </>
              ) : (
                <>
                  <ListGroup variant="flush">
                    {cart.map((item, idx) => (
                      <ListGroup.Item
                        key={idx}
                        className="d-flex justify-content-between align-items-center"
                        style={{
                          backgroundColor: darkMode ? "#212121" : "transparent",
                          color: darkMode ? "#fff" : "#000",  
                          border: "none",
                          padding: "0.5rem 0",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <Image
                            src={item.image}
                            alt={item.title}
                            style={{
                              width: "60px",
                              height: "60px",
                              objectFit: "contain",
                            }}
                            className="me-3"
                          />
                          <div>
                            <div className="fw-semibold">{item.title}</div>
                            <div
                              style={{
                                fontSize: "0.85rem",
                                color: darkMode ? "#fff" : "#555",
                              }}
                            >
                              Qty: {item.quantity}
                            </div>
                          </div>
                        </div>
                        <div className="fw-bold">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                  <hr />
                  <div className="d-flex justify-content-between fw-bold fs-5">
                    <div>Total Amount:</div>
                    <div>₹{totalAmount.toFixed(2)}</div>
                  </div>
                </>
              )}
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
