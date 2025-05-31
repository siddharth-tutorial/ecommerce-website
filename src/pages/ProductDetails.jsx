import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  ProgressBar,
  Toast,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../Components/ProductContext";
import { useTheme } from "../Components/ThemeContext";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addtoCart } = useCart();
  const { darkMode } = useTheme();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        window.scrollTo(0, 0); // Scroll to top when product changes
        const res = await fetch(`https://fakestoreapi.com/products/${id}`);
        const data = await res.json();
        setProduct(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching product:", err);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (!product?.category) return;
    const fetchRelated = async () => {
      try {
        const res = await fetch(
          `https://fakestoreapi.com/products/category/${product.category}`
        );
        const data = await res.json();
        setRelatedProducts(data.filter((p) => p.id !== product.id));
      } catch (err) {
        console.error("Error fetching related products", err);
      }
    };
    fetchRelated();
  }, [product]);

  const handleAddToCart = () => {
    addtoCart(product);
    setShowToast(true);
  };

  return (
    <Container
      fluid
      className={`py-4 ${darkMode ? "bg-dark text-light" : "bg-light text-dark"}`}
      style={{ minHeight: "100vh" }}
    >
      <Container>
        <Row>
          <Col md={5}>
            <Card
              className="shadow-sm mb-4"
              style={{
                backgroundColor: darkMode ? "#1e1e1e" : "#fff",
                color: darkMode ? "#f1f1f1" : "#000",
              }}
            >
              {loading ? (
                <Skeleton height={400} />
              ) : (
                <Card.Img
                  variant="top"
                  src={product.image}
                  style={{ height: "400px", objectFit: "contain", padding: "20px" }}
                />
              )}
            </Card>
          </Col>

          <Col md={7}>
            {loading ? (
              <>
                <Skeleton height={30} width={`80%`} />
                <Skeleton height={20} width={`40%`} className="my-2" />
                <Skeleton height={30} width={`20%`} className="my-2" />
                <Skeleton height={25} width={`50%`} className="my-2" />
                <Skeleton count={3} className="my-2" />
                <div className="d-flex gap-2 mt-3">
                  <Skeleton height={40} width={100} />
                  <Skeleton height={40} width={120} />
                </div>
              </>
            ) : (
              <>
                <h3>{product.title}</h3>
                <p className="text-muted">{product.category}</p>
                <h4 className="text-danger">₹{product.price}</h4>
                <Badge bg="warning" text="dark" className="mb-2">
                  {product.rating?.rate} ★ ({product.rating?.count} reviews)
                </Badge>
                <p>{product.description}</p>
                <div className="d-flex flex-wrap gap-2 mt-3">
                
                  <Button variant="success" onClick={handleAddToCart}>
                    Add to Cart
                  </Button>
                </div>
              </>
            )}
          </Col>
        </Row>

        {/* Rating Summary */}
        <Row className="mt-5">
          <Col md={6}>
            <h5>Rating Summary</h5>
            {[5, 4, 3, 2, 1].map((star) => {
              const percent = Math.floor(
                ((product?.rating?.rate || 0) / 5) * 100 * (star / 5)
              );
              return (
                <div key={star} className="mb-2">
                  <strong>{star} ★</strong>
                  {loading ? (
                    <Skeleton height={20} />
                  ) : (
                    <ProgressBar
                      now={percent}
                      label={`${percent}%`}
                      variant="info"
                      className="mt-1"
                    />
                  )}
                </div>
              );
            })}
          </Col>
        </Row>

        {/* Related Products */}
        <hr className="my-5" />
        <h4 className="mb-4">Related Products</h4>
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {loading
            ? Array.from({ length: 4 }).map((_, idx) => (
                <Col key={idx}>
                  <Card
                    style={{
                      backgroundColor: darkMode ? "#1e1e1e" : "#fff",
                    }}
                    className="shadow-sm"
                  >
                    <Skeleton height={200} />
                    <Card.Body>
                      <Skeleton height={20} width="80%" />
                      <Skeleton height={20} width="40%" />
                      <Skeleton height={20} width="30%" />
                    </Card.Body>
                  </Card>
                </Col>
              ))
            : relatedProducts.length === 0 ? (
                <p>No related products found.</p>
              ) : (
                relatedProducts.map((item) => (
                  <Col key={item.id}>
                    <Card
                      onClick={() => navigate(`/product/${item.id}`)}
                      style={{
                        cursor: "pointer",
                        backgroundColor: darkMode ? "#1e1e1e" : "#fff",
                        color: darkMode ? "#eee" : "#000",
                      }}
                      className="h-100 shadow-sm"
                    >
                      <Card.Img
                        variant="top"
                        src={item.image}
                        style={{
                          height: "200px",
                          objectFit: "contain",
                          padding: "10px",
                        }}
                      />
                      <Card.Body>
                        <Card.Title className="text-truncate">
                          {item.title}
                        </Card.Title>
                        <Card.Text className="text-danger fw-bold">
                          ₹{item.price}
                        </Card.Text>
                        <Badge bg="warning" text="dark">
                          {item.rating?.rate} ★
                        </Badge>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              )}
        </Row>
      </Container>

      {/* Toast Notification */}
      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={3000}
        autohide
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          minWidth: "200px",
          zIndex: 9999,
          backgroundColor: darkMode ? "#333" : "#fff",
          color: darkMode ? "#fff" : "#000",
          border: darkMode ? "1px solid #555" : "1px solid #ddd",
        }}
      >
        <Toast.Header
          style={{
            backgroundColor: darkMode ? "#444" : "#f1f1f1",
            color: darkMode ? "#fff" : "#000",
          }}
        >
          <strong className="me-auto">Cart</strong>
        </Toast.Header>
        <Toast.Body>Product added to cart!</Toast.Body>
      </Toast>
    </Container>
  );
};

export default ProductDetails;
