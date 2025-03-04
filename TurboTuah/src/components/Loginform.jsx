import { useState } from "react";
import './Loginform.css';
import Card from "./UI/Card";

function Loginform({ login }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        console.log('Login successful!');
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
      <button type="submit">Login</button>
    </form>
  </Card>
  );
}

export default Loginform;
