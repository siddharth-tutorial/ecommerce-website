import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Carousel,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useTheme } from "../Components/ThemeContext";
import { useSearch } from "../Components/SearchContext";

const fakestoreCategories = [
  "electronics",
  "jewelery",
  "men's clothing",
  "women's clothing",
];

function Home() {
  const [categoryData, setCategoryData] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const { searchTerm } = useSearch();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const allData = {};
        for (const category of fakestoreCategories) {
          const response = await fetch(
            `https://fakestoreapi.com/products/category/${category}`
          );
          if (!response.ok) throw new Error("Failed to fetch " + category);
          const data = await response.json();
          allData[category] = data;
        }
        setCategoryData(allData);
        setLoading(false);
      } catch (error) {
        console.error("Error loading categories", error);
      }
    };

    fetchCategories();
  }, []);

  const banners = [
    {
      src: "https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=1200&q=80",
      alt: "Fashion",
      caption: "Trendy Fashion for Men & Women",
    },
    {
      src: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80",
      alt: "Jewelry",
      caption: "Exquisite Jewelry Collection",
    },
    {
      src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
      alt: "Home & Kitchen",
      caption: "Home & Kitchen Essentials",
    },
    {
      src: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=1200&q=80",
      alt: "New Arrivals",
      caption: "Discover Our New Arrivals",
    },
    {
      src: "https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1200&q=80",
      alt: "Seasonal",
      caption: "Seasonal Specials - Summer & Winter",
    },
  ];

  if (loading) {
    return (
      <div
        style={{
          backgroundColor: darkMode ? "#121212" : "#fff",
          color: darkMode ? "#eee" : "#000",
          minHeight: "100vh",
          padding: "1rem",
        }}
      >
        <Container className="my-4">
          {/* Skeleton Carousel Banner */}
          <Skeleton
            height={450}
            borderRadius={12}
            baseColor={darkMode ? "#333" : "#e0e0e0"}
            highlightColor={darkMode ? "#444" : "#f0f0f0"}
            className="mb-5"
          />

          {/* Skeleton Categories */}
          {fakestoreCategories.map((category, index) => (
            <div key={index} className="mb-5">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Skeleton width={160} height={30} />
                <Skeleton width={100} height={30} />
              </div>
              <Row>
                {[...Array(4)].map((_, i) => (
                  <Col key={i} xs={12} sm={6} md={4} lg={3} className="mb-4">
                    <Card className="h-100 shadow-sm border-0">
                      <Skeleton
                        height={220}
                        borderRadius={0}
                        style={{ marginBottom: 10 }}
                      />
                      <Card.Body>
                        <Skeleton count={2} height={20} className="mb-2" />
                        <Skeleton width={80} height={25} />
                        <Skeleton height={35} className="mt-3" />
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          ))}
        </Container>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: darkMode ? "#121212" : "#fff",
        color: darkMode ? "#eee" : "#000",
        minHeight: "100vh",
        padding: "1rem",
      }}
    >
      <Carousel fade controls indicators={false} interval={3000}>
        {banners.map(({ src, alt, caption }, index) => (
          <Carousel.Item key={index}>
            <img
              className="d-block w-100"
              src={src}
              alt={alt}
              style={{ width: "100%", height: "450px", objectFit: "cover" }}
            />
            <Carousel.Caption
              className="bg-dark bg-opacity-50 rounded px-3 py-2"
              style={{ bottom: "20%", maxWidth: "60%", margin: "0 auto" }}
            >
              <h2 className="fw-bold text-light">{caption}</h2>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>

      <Container className="my-5">
        {fakestoreCategories.map((category) => {
          const filteredProducts = categoryData[category]?.filter((product) =>
            product.title.toLowerCase().includes(searchTerm.toLowerCase())
          );

          if (filteredProducts?.length === 0) return null;

          return (
            <div key={category} className="mb-5">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="text-capitalize fw-bold">{category}</h3>
                 <Button variant="outline-primary">View All</Button>
              </div>
              <Row>
                {filteredProducts.slice(0, 4).map((product) => (
                  <Col
                    key={product.id}
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    className="mb-4"
                  >
                    <Card
                      className="h-100 shadow-sm border-0 product-card"
                      style={{ cursor: "pointer", transition: "transform 0.2s" }}
                    >
                      <Card.Img
                        variant="top"
                        src={product.image}
                        loading="lazy"
                        style={{
                          height: "220px",
                          width: "100%",
                          objectFit: "contain",
                          padding: "15px",
                          backgroundColor: "#f8f9fa",
                          
                        }}
                        
                      />
                      <Card.Body className="d-flex flex-column px-3">
                        <Card.Title
                          className="mb-2"
                          style={{
                            fontSize: "1rem",
                            height: "2.6em",
                            overflow: "hidden",
                            
                          }}
                        >
                          {product.title}
                        </Card.Title>
                        <Card.Text className="fw-bold text-success mb-3 fs-5">
                          ₹{product.price}
                        </Card.Text>
                        <Button
                          variant="warning"
                          className="mt-auto"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/product/${product.id}`);
                          }}
                        >
                          View Details
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          );
        })}
      </Container>
    </div>
  );
}

export default Home;
