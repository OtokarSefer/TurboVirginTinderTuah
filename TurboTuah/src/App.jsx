import React, { useEffect, useState } from 'react';
import './index.css';
import './App.css'
import Loginform from './components/Loginform'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link
} from "react-router-dom";
import Home from "./pages/home";
import Contact from "./pages/contact";
import About from "./pages/about";
import Navbar from './components/UI/Navbar';
import LogNavbar from './components/UI/LogNavbar';
import '@picocss/pico/css/pico.min.css';
import Chat from './pages/userPages/chat';
import Match from './pages/userPages/match';



function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  console.log(isLoggedIn)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:5000/auth/verify", {
          method: "GET",
          credentials: "include", 
        });
  
        if (response.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error verifying session:", error);
        setIsLoggedIn(false);
      }
    };
  
    checkAuth();
  }, []);


  const handleLogin = async (email, password) => {
    try {
      // console.log("Sending login request...", { email, password }); Just to not log the email and password

      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
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

  return (
    <Router>
      {isLoggedIn ? <LogNavbar setIsLoggedIn={setIsLoggedIn} /> : <Navbar />}

      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/home" />
            ) : (
              <Loginform login={handleLogin} setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />
            )
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/home"
          element={
            isLoggedIn ? <Home setIsLoggedIns={setIsLoggedIn} isLoggedIn={isLoggedIn} /> : <Navigate to="/" />
          }
          
        />
        <Route
          path="/match"
          element={
            isLoggedIn ? <Match/> : <Navigate to="/" />
          }
          
        />
        <Route
          path="/chat"
          element={
            isLoggedIn ? <Chat/> : <Navigate to="/" />
          }
          
        />
      </Routes>
    </Router>
  );
}



export default App;
