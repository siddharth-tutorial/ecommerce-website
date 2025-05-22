import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Toast,
  ToastContainer,
  Image,
  Form,
  Placeholder,
} from "react-bootstrap";
import { useCart } from "../Components/ProductContext";
import { useTheme } from "../Components/ThemeContext";
import { Link, useNavigate } from "react-router-dom";
import { FaCartShopping } from "react-icons/fa6";

function Cart() {
  const { cart, removetoCart, decrement, increment } = useCart();
  const { darkMode } = useTheme();
  const [loading, setLoading] = useState(true);

  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem("productReviews");
    return saved ? JSON.parse(saved) : {};
  });

  const SHIPPING_CHARGE = 50;
  const COUPON_CODE = "DISCOUNT10";
  const DISCOUNT_PERCENT = 10;

  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [showToast, setShowToast] = useState({ show: false, message: "" });

  const totalPriceBeforeDiscount = cart.reduce(
    (acc, product) => acc + product.price * product.quantity,
    0
  );
  const totalItems = cart.reduce((acc, product) => acc + product.quantity, 0);
  const totalPriceAfterDiscount =
    totalPriceBeforeDiscount - discount + SHIPPING_CHARGE;

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("productReviews", JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500); // Simulate load time
    return () => clearTimeout(timer);
  }, []);

  const handleRatingChange = (productId, rating) => {
    setReviews((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], rating },
    }));
  };

  const handleRemove = (productId) => {
    removetoCart(productId);
    setShowToast({ show: true, message: "Item removed from cart!" });
  };

  const handleApplyCoupon = () => {
    if (coupon.trim().toUpperCase() === COUPON_CODE) {
      const discountAmount = (totalPriceBeforeDiscount * DISCOUNT_PERCENT) / 100;
      setDiscount(discountAmount);
      setShowToast({ show: true, message: "Coupon applied! 10% discount granted." });
    } else {
      setDiscount(0);
      setShowToast({ show: true, message: "Invalid coupon code." });
    }
  };

  const handleCheckout = () => {
    setShowToast({ show: true, message: "Proceeding to checkout..." });
    setTimeout(() => {
      navigate("/checkout", { state: { cart } });
    }, 1000);
  };

  const SkeletonCard = () => (
    <Card className={`mb-4 shadow-sm border-0 rounded-4 ${darkMode ? "bg-dark text-white" : "bg-light text-dark"}`}>
      <Card.Body>
        <Row className="align-items-center">
          <Col md={3} xs={12} className="text-center mb-2 mb-md-0">
            <Placeholder animation="wave">
              <div className="bg-secondary" style={{ width: "100%", height: "180px", borderRadius: "8px" }}></div>
            </Placeholder>
          </Col>
          <Col md={6}>
            <Placeholder as="h5" animation="wave">
              <Placeholder xs={8} />
            </Placeholder>
            <Placeholder as="p" animation="wave">
              <Placeholder xs={10} /> <Placeholder xs={6} />
            </Placeholder>
            <Placeholder animation="wave">
              <Placeholder xs={2} /> <Placeholder xs={2} /> <Placeholder xs={2} />
            </Placeholder>
          </Col>
          <Col md={3}>
            <Placeholder as="h5" animation="wave">
              <Placeholder xs={4} />
            </Placeholder>
            <Placeholder.Button variant="secondary" xs={5} className="me-2" />
            <Placeholder.Button variant="secondary" xs={5} />
            <div className="mt-2">
              <Placeholder.Button variant="danger" xs={8} />
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );

  return (
    <div
      style={{
        backgroundColor: darkMode ? "#121212" : "#fff",
        color: darkMode ? "#eee" : "#000",
        minHeight: "100vh",
        padding: "1rem",
      }}
    >
      <Container className="py-4">
        <ToastContainer position="top-end" className="p-3">
          <Toast
            onClose={() => setShowToast({ show: false, message: "" })}
            show={showToast.show}
            delay={2000}
            autohide
            style={{
              backgroundColor: darkMode ? "#333" : "#fff",
              color: darkMode ? "#fff" : "#000",
              border: darkMode ? "1px solid #444" : "1px solid #ccc",
            }}
          >
            <Toast.Body>{showToast.message}</Toast.Body>
          </Toast>
        </ToastContainer>

        <h3 className="mb-4 fw-bold text-center">Your Shopping Cart</h3>

        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : cart.length === 0 ? (
          <div className="text-center">
            <h5>
              <FaCartShopping size={100} />
            </h5>
            <h5>Your Cart is Empty!</h5>
            <Link to="/">
              <Button variant="outline-primary" className="mt-3">
                Go Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <Row className="mb-3">
            <Col md={8}>
              {cart.map((product) => (
                <Card
                  key={product.id}
                  className={`mb-4 shadow-sm border-0 rounded-4 ${
                    darkMode ? "bg-dark text-white" : "bg-light text-dark"
                  }`}
                >
                  <Card.Body>
                    <Row className="align-items-center">
                      <Col md={3} xs={12} className="text-center mb-2 mb-md-0">
                        <Image
                          src={product.image}
                          fluid
                          style={{ maxHeight: "180px", objectFit: "contain" }}
                          alt={product.title}
                        />
                      </Col>
                      <Col md={6}>
                        <h5 className="fw-semibold">{product.title}</h5>
                        <p className="text-muted small">
                          {product.description.substring(0, 100)}...
                        </p>
                        <div>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <i
                              key={star}
                              className={`bi ${
                                reviews[product.id]?.rating >= star
                                  ? "bi-star-fill text-warning"
                                  : "bi-star text-secondary"
                              } me-1`}
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                handleRatingChange(product.id, star)
                              }
                            ></i>
                          ))}
                        </div>
                      </Col>
                      <Col md={3} className="text-md-end">
                        <h5 className="fw-bold mb-3">
                          ₹{(product.price * product.quantity).toFixed(2)}
                        </h5>
                        <div className="d-flex align-items-center justify-content-md-end mb-2">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => decrement(product.id)}
                          >
                            -
                          </Button>
                          <span className="mx-2 fw-semibold">
                            {product.quantity}
                          </span>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => increment(product.id)}
                          >
                            +
                          </Button>
                        </div>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleRemove(product.id)}
                        >
                          <i className="bi bi-trash3"></i> Remove
                        </Button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))}
            </Col>

            <Col md={4}>
              <Card
                className={darkMode ? "bg-dark text-white shadow-sm" : "shadow-sm"}
              >
                <Card.Header
                  className={
                    darkMode ? "bg-secondary text-white" : "bg-dark text-white"
                  }
                >
                  <h5 className="mb-0">Order Summary</h5>
                </Card.Header>
                <Card.Body>
                  <p>Total Items: {totalItems}</p>
                  <p>Subtotal: ₹{totalPriceBeforeDiscount.toFixed(2)}</p>
                  <p>Shipping Charge: ₹{SHIPPING_CHARGE.toFixed(2)}</p>
                  <Form.Group controlId="coupon" className="mb-3">
                    <Form.Label>Coupon Code</Form.Label>
                    <div className="d-flex">
                      <Form.Control
                        type="text"
                        placeholder="Enter coupon code"
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                        className={
                          darkMode
                            ? "bg-dark text-white border-secondary"
                            : ""
                        }
                      />
                      <Button
                        variant="primary"
                        className="ms-2"
                        onClick={handleApplyCoupon}
                      >
                        Apply
                      </Button>
                    </div>
                  </Form.Group>
                  {discount > 0 && (
                    <p className="text-success">
                      Discount Applied: -₹{discount.toFixed(2)} (10%)
                    </p>
                  )}
                  <hr />
                  <h5>Total: ₹{totalPriceAfterDiscount.toFixed(2)}</h5>
                  <Button
                    variant="success"
                    className="w-100 mt-3"
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                  </Button>
                  <Link to="/" className="d-block mt-3 text-center">
                    <Button variant="outline-secondary" className="w-100">
                      Continue Shopping
                    </Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
}

export default Cart;
