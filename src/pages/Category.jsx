import React, { useState, useEffect, useMemo } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Card,
  Button,
  Placeholder,
} from "react-bootstrap";
import { useTheme } from "../Components/ThemeContext";
import { useSearch } from "../Components/SearchContext";
import { useCart } from "../Components/ProductContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./category.css";

function Category() {
  const { darkMode } = useTheme();
  const { searchTerm } = useSearch();
  const { addtoCart } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [categories, setCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [sortOrder, setSortOrder] = useState("");

  const handleAddToCart = (product) => {
    addtoCart(product);
    toast.success(`Added "${product.title}" to cart!`);
  };

  console.log(error);
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch("https://fakestoreapi.com/products");
        const data = await res.json();
        setProducts(data);
        const cats = Array.from(new Set(data.map((p) => p.category)));
        setCategories(cats);
        const maxPrice = Math.ceil(Math.max(...data.map((p) => p.price)));
        setPriceRange([0, maxPrice]);
      } catch (e) {
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handlePriceChange = (e) => {
    const value = Number(e.target.value);
    setPriceRange([0, value]);
  };

  const handleRatingChange = (e) => {
    setRatingFilter(Number(e.target.value));
  };

  const resetFilters = () => {
    setCategoryFilter("all");
    setPriceRange([0, Math.ceil(Math.max(...products.map((p) => p.price)))]);
    setRatingFilter(0);
    setSortOrder("");
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={"star-full-" + i} className="text-warning">
          ★
        </span>
      );
    }
    if (hasHalfStar)
      stars.push(
        <span key="half" className="text-warning">
          ☆
        </span>
      );
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={"empty-" + i} className="text-muted">
          ☆
        </span>
      );
    }
    return stars;
  };

  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    if (categoryFilter !== "all") {
      filtered = filtered.filter((p) => p.category === categoryFilter);
    }
    if (searchTerm.trim()) {
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );
    if (ratingFilter > 0) {
      filtered = filtered.filter(
        (p) => Math.floor(p.rating.rate) >= ratingFilter
      );
    }
    if (sortOrder === "asc") filtered.sort((a, b) => a.price - b.price);
    else if (sortOrder === "desc") filtered.sort((a, b) => b.price - a.price);
    return filtered;
  }, [
    products,
    categoryFilter,
    searchTerm,
    priceRange,
    ratingFilter,
    sortOrder,
  ]);

  return (
    <div
      style={{
        backgroundColor: darkMode ? "#121212" : "#fff",
        color: darkMode ? "#eee" : "#000",
        minHeight: "100vh",
        padding: "1rem",
      }}
    >
      <ToastContainer autoClose={2000} theme={darkMode ? "dark" : "light"} />
      <Container fluid className="my-4 p-3 rounded shadow-sm">
        <Row>
          {/* Filters */}
          <Col md={3} className="mb-4">
            <Card
              bg={darkMode ? "dark" : "light"}
              text={darkMode ? "light" : "dark"}
              className="p-3 shadow-sm"
            >
              {loading ? (
                <>
                  <Placeholder animation="wave">
                    <Placeholder xs={6} />
                  </Placeholder>
                  <Placeholder
                    as={Form.Select}
                    animation="wave"
                    className="mb-3"
                  />
                  <Placeholder animation="wave">
                    <Placeholder xs={4} />
                  </Placeholder>
                  <Placeholder
                    className="w-100"
                    animation="wave"
                    style={{ height: "38px" }}
                  />
                  <Placeholder animation="wave">
                    <Placeholder xs={5} />
                  </Placeholder>
                  <Placeholder
                    as={Form.Select}
                    animation="wave"
                    className="mb-3"
                  />
                  <Placeholder.Button variant="secondary" xs={12} />
                </>
              ) : (
                <>
                  <h5>Filters</h5>
                  <Form.Group className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                      <option value="all">All</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Max Price: ₹{priceRange[1]}</Form.Label>
                    <Form.Range
                      min={0}
                      max={Math.ceil(Math.max(...products.map((p) => p.price)))}
                      value={priceRange[1]}
                      onChange={handlePriceChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Minimum Rating</Form.Label>
                    <Form.Select
                      value={ratingFilter}
                      onChange={handleRatingChange}
                    >
                      <option value={0}>All Ratings</option>
                      <option value={1}>1 star & up</option>
                      <option value={2}>2 stars & up</option>
                      <option value={3}>3 stars & up</option>
                      <option value={4}>4 stars & up</option>
                      <option value={5}>5 stars only</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Sort By Price</Form.Label>
                    <Form.Select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                    >
                      <option value="">Default</option>
                      <option value="asc">Low to High</option>
                      <option value="desc">High to Low</option>
                    </Form.Select>
                  </Form.Group>
                  <Button
                    variant={darkMode ? "outline-light" : "outline-secondary"}
                    onClick={resetFilters}
                    className="w-100"
                  >
                    Reset Filters
                  </Button>
                </>
              )}
            </Card>
          </Col>

          {/* Products */}
          <Col md={9}>
            {loading ? (
              <Row xs={1} md={3} className="g-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Col key={i}>
                    <Card className="h-100 shadow-sm skeleton-card">
                      <Placeholder
                        as={Card.Img}
                        animation="wave"
                        style={{ height: "220px", background: "#e0e0e0" }}
                      />
                      <Card.Body>
                        <Placeholder animation="wave">
                          <Placeholder xs={8} />
                        </Placeholder>
                        <Placeholder animation="wave">
                          <Placeholder xs={4} />
                        </Placeholder>
                        <Placeholder animation="wave">
                          <Placeholder xs={6} />
                        </Placeholder>
                        <Placeholder.Button variant="warning" xs={12} />
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : filteredProducts.length === 0 ? (
              <h5>No products found.</h5>
            ) : (
              <Row xs={1} md={3} className="g-4">
                {filteredProducts.map((product) => (
                  <Col key={product.id}>
                    <Card className="h-100 shadow-sm border-0 product-card">
                      <Card.Img
                        variant="top"
                        src={product.image}
                        loading="lazy"
                        style={{
                          height: "220px",
                          objectFit: "contain",
                          padding: "15px",
                          backgroundColor: "#f8f9fa",
                        }}
                      />
                      <Card.Body className="d-flex flex-column">
                        <Card.Title style={{ fontSize: "1rem" }}>
                          {product.title.length > 40
                            ? product.title.slice(0, 40) + "..."
                            : product.title}
                        </Card.Title>
                        <Card.Text className="fw-bold fs-5">
                          ₹{product.price.toFixed(2)}
                        </Card.Text>
                        <Card.Text>
                          Rating: {renderStars(product.rating.rate)} (
                          {product.rating.count})
                        </Card.Text>
                        <Button
                          variant="warning"
                          onClick={() => handleAddToCart(product)}
                        >
                          Add to Cart
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Category;
