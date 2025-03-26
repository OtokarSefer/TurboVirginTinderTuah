import React, { useState, useEffect } from "react";
import Card from "../components/UI/Card";
import { Navigate } from "react-router-dom";

const Home = ({ setIsLoggedIn }) => {

  const handleLogout = async () => {
    await fetch("http://localhost:5000/logout", { method: "POST", credentials: "include" });
    setIsLoggedIn(false);
  };


  return (
    <div>
      <h1>Welcome to TwinderTuah home page, it's filled with desperate people!</h1>

      <button onClick={handleLogout}>Click me for crack</button>

      <Card className="bio">
          <div>
            <h2>User Info:</h2>
          </div>
      </Card>
    </div>
  );
};

export default Home;
