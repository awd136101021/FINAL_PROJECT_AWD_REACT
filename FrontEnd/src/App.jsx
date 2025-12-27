// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import ContactUs from "./pages/Contactus";
import AboutUs from "./pages/Aboutus";
import Faculty from "./pages/Faculty";
import Login from "./pages/Login";
import Programs from "./pages/Programs";
import FAQs from "./pages/Faqs";
import Chatbot from "./components/Chatbot";
import Dashboard from "./pages/Dashboard";


function App() {
  return (
    <Router>
      <div className="font-[Poppins] text-gray-800 bg-gray-100 overflow-x-hidden">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/faculty" element={<Faculty />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />

        </Routes>
        <Footer />
        <Chatbot />
      </div>
    </Router>
  );
}

export default App;