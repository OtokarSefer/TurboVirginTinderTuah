import React, { useState } from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
// ADD USERNAME TO THE USER MAKING PART
// It's illegal to update the styling before implementing the functionality

const Popupad = () => {
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupCap, setSignupCap] = useState("");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [canCap, setcanCap] = useState(false);
  const [isCooldown, setIsCooldown] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");

    let newErrors = {};

    if (!signupEmail) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(signupEmail)) {
      newErrors.email = "Invalid email format";
    }

    if (!signupPassword) {
      newErrors.password = "Password is required";
    } else if (signupPassword.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!signupUsername) {
        newErrors.username = "Username is required";
      } else if (signupUsername.length < 5) {
        newErrors.username = "Username must be at least 5 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const apiCall = async (url, method, body) => {
      try {
        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          setErrors({ global: data.error || "Something went wrong." });
          return null; // Return null on error
        }
  
        return data; // Return data on success
      } catch (error) {
        setErrors({ global: "Something went wrong. Please try again." });
        return null;
      }
    };
  
    if (!canCap) {
      // Request CAPTCHA
      const captchaResponse = await apiCall("http://localhost:5000/api/captcha", "POST", { email: signupEmail });
  
      if (captchaResponse) {
        setSuccessMessage("CAPTCHA SENT MFER, PLEASE GO AND VERIFY YOURSELF");
        setcanCap(true);
      }
    } else {
      const signupResponse = await apiCall("http://localhost:5000/api/signup", "POST", {
        email: signupEmail,
        password: signupPassword,
        name: signupUsername,
        captcha: signupCap,
      });
  
      if (signupResponse) {
        setSuccessMessage("Account created successfully!");
        setSignupEmail("");
        setSignupPassword("");
        setSignupUsername("");
        setSignupCap("");
        setcanCap(false);
      }
    }
    setTimeout(() => setIsCooldown(false), 3000)
  }    

  return (
    <div>
      <Popup trigger={<button>Make your account here!</button>} modal nested>
        {(close) => (
          <div>
            <form onSubmit={handleSignup}>
              {errors.global && <div className="alert">{errors.global}</div>}
              {successMessage && <div className="success">{successMessage}</div>}

              <h3>Complete the signup form</h3>
              <div>
                <label>Username:</label>
                <input
                  type="username"
                  value={signupUsername}
                  onChange={(e) => setSignupUsername(e.target.value)}
                />
                {errors.username && <div className="error">{errors.username}</div>}
              </div>


              <div>
                <label>Email:</label>
                <input
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                />
                {errors.email && <div className="error">{errors.email}</div>}
              </div>

              <div>
                <label>Password:</label>
                <input
                  type="password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                />
                {errors.password && <div className="error">{errors.password}</div>}
              </div>


              {canCap && 
              <div>
                <label>Enter captcha here:</label>
                  <input
                    type="cap"
                    value={signupCap}
                    onChange={(e) => setSignupCap(e.target.value)}
                  />
                  {errors.captcha && <div className="error">{errors.captcha}</div>}
              </div>}

              <button type="submit" onClick={handleSignup} disabled={isCooldown}>
                {isCooldown ? "Cooldown..." : "Sign Up"}
              </button>
            </form>
            <button onClick={() => close()}>Close</button>
          </div>
        )}
      </Popup>
    </div>
  );
};

export default Popupad;
