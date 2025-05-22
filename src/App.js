import "./App.css";
import { Route, Routes } from "react-router";
import Cart from "./pages/Cart";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Category from "./pages/Category";
import Header from "./pages/Header";
import Footer from "./pages/Footer";
import Checkout from "./pages/Checkout";
import ThankYou from "./pages/ThankYou";
import Auth from "./Components/Auth";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/category" element={<Category />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/thankyou" element={<ThankYou />} />
        {/*  Nested Login/Register */}
        <Route path="auth" element={<Auth />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
            <Route index element={<Login />} />
        </Route>
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
