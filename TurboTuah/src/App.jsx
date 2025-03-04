import React, { useEffect, useState } from 'react';
import './index.css';
import Loginform from './components/Loginform'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Home from "./pages/index";
import Contact from "./pages/contact";
import About from "./pages/about";

function App() {
  const handleLogin = async (email, password) => {
    try {
      // console.log("Sending login request...", { email, password }); Just to not log the email and password

      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json(); 
      console.log("Login successful!");

      return data;
    } catch (error) {
      console.error("Login error:", error.message);
      throw error;
    }
  };

  return( 
  <Router>
    <Routes>
        <Route path="/" element={<Loginform login={handleLogin}/>} />
        <Route exact path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route
            path="/contact"
            element={<Contact />}
        />
    </Routes>
  </Router>
)}

export default App;
