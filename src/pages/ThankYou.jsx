import React from "react";
import { useWindowSize } from "@react-hook/window-size";
import Confetti from "react-confetti";
import { Player } from "@lottiefiles/react-lottie-player";
import tickAnimation from "../assets/tick.json"; // Place tick.json in src/assets/
import { useNavigate } from "react-router-dom";
import { useTheme } from "../Components/ThemeContext";

const ThankYou = ({ userName }) => {
  const [width, height] = useWindowSize();
  const navigate = useNavigate();
  const {darkMode} =useTheme()
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#fff",
        padding: "2rem",
        textAlign: "center",
         backgroundColor: darkMode ? "#333" : "#fff",  
        color: darkMode ? "#fff" : "#000",
      }}
    >
      {/* Confetti raining */}
      <Confetti width={width} height={height} />

      {/* Big green tick animation */}
      <Player
        autoplay
        loop={false}
        src={tickAnimation}
        style={{ height: 150, width: 150, marginBottom: "1.5rem" }}
      />

      {/* Thank you text with optional username */}
      <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem", color: "#2E7D32" }}>
        Thank You{userName ? `, ${userName}` : ""}!
      </h1>

      <p style={{ fontSize: "1.2rem", color: "#555", marginBottom: "2rem" }}>
        Your order has been placed successfully.
      </p>

      {/* Amazon style yellow button */}
      <button
        onClick={() => navigate("/")}
        style={{
          backgroundColor: "#f0c14b",
          border: "1px solid #a88734",
          padding: "0.75rem 2rem",
          fontSize: "1rem",
          borderRadius: "4px",
          cursor: "pointer",
          fontWeight: "bold",
          boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
          transition: "background-color 0.3s",
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = "#ddb347")}
        onMouseLeave={(e) => (e.target.style.backgroundColor = "#f0c14b")}
      >
        Back to Home
      </button>
    </div>
  );
};

export default ThankYou;
