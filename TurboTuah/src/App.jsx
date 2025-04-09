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
import SignUpForm from "./components/signupform";
import Blogs from "./pages/cringe";
import About from "./pages/about";

const App = () => {
  return (
    <Router>
        <Routes>
            <Route path="/" element={<Loginform />} />
            <Route path="/signup" element={<SignUpForm />} />
            <Route exact path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route
                path="/contact"
                element={<Contact />}
            />
        </Routes>
    </Router>
);
}


export default App;