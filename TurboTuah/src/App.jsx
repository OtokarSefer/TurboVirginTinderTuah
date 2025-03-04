import React, { useState } from "react";
import Loginform from "./components/Loginform";

function App() {
  const handleLogin = async (email, password) => {
    try {
      console.log("Sending login request...", { email, password });

      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      console.log("Login successful:", data);

      return data; // Send back user data & token
    } catch (error) {
      console.error("Login error:", error.message);
      throw error;
    }
  };

  return <Loginform login={handleLogin} />;
}

export default App;
