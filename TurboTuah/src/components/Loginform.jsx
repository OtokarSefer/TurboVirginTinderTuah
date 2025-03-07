import { useState, useEffect } from "react";
import './Loginform.css';
import Card from "./UI/Card";
import Popupad from "./popupad";
import Timer from './Timer'

const Loginform = ({ login, setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [canRun, setCanRun] = useState(false)
  const [fulldisabled, setDisabled] = useState(false)

// Every second and every canRun switch calls the useEffect thingy, and then checks if the parameters fit. 
// All of the code should go under the e.preventDefault learn from my mistakes, it refreshed the page and makes your life more miserable maybe.

  const handleTimerFinish = () => {
    setDisabled(false); 
    setCanRun(false)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (fulldisabled) return;

    console.log("Becoming fulldisabled and logging in ", {email})

    setDisabled(true)
    setCanRun(true)

    setErrors({});
    let validationErrors = {};
    if (!email.includes('@')) validationErrors.email = 'Email must be valid.';
    if (password.length < 6) validationErrors.password = 'Password must be at least 6 characters.';
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }


    try {
      const response = await login(email, password);

      if (response.token) {
        localStorage.setItem('authToken', response.token);
        console.log('Login token successful!');
        setIsLoggedIn(true)
      }
    } catch (error) {
      setErrors({ global: 'Invalid credentials or network error.' });
    }
  };

  return (
  <Card className='Loginform'>
    <h1>Login</h1>
    <form onSubmit={handleSubmit}>
      {errors.global && <div className="alert">{errors.global}</div>}
      <div>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        {errors.email && <div className="error">{errors.email}</div>}
      </div>
      <div>
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {errors.password && <div className="error">{errors.password}</div>}
      </div>
      <button type="submit" disabled={fulldisabled}>
        {!fulldisabled ? "Login" : "nah"}
      </button>
    </form>
    {canRun && <Timer onTimerFinish={handleTimerFinish}/>
    }
    <Popupad/>
  </Card>
  );
}

export default Loginform;