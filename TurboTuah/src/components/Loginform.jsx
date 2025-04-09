import { useState } from "react";
import "./Loginform.css";
import Card from "./UI/Card";

const token = localStorage.getItem("token");


const Loginform = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");


  
  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:3001/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    
    if (response.ok) {
      localStorage.setItem("token", data.token);
      alert("Login successful!");
    } else {
      alert(data.message || "Login failed");
    }
  };

  return (
    <Card className="Loginform">
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Enter name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </Card>
  );
};

export default Loginform;
