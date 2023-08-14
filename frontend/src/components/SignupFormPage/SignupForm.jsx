import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import * as sessionActions from "../../store/session";
import { Link } from "react-router-dom";
import './SignupForm.css'; // Update the path to your CSS file

function SignupForm() {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);

  if (sessionUser) return <Redirect to="/" />;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password) {
      setErrors([]);
      return dispatch(sessionActions.signup({ email, username, password }))
        .catch(async (res) => {
          let data;
          try {
            data = await res.clone().json();
          } catch {
            data = await res.text();
          }
          if (data?.errors) setErrors(data.errors);
          else if (data) setErrors([data]);
          else setErrors([res.statusText]);
        });
    }
    // return setErrors(['Confirm Password field must be the same as the Password field']);
  };

  return (
    
    <div className="signup-form-container">

      <h1>Find your voice</h1>
      <form onSubmit={handleSubmit}>
        <ul>
          {errors.map((error) => <li key={error}>{error}</li>)}
        </ul>

        {/* Email Input */}
        <div className="input-container">
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            id="email-input"
          />
          <label htmlFor="email-input">Email</label>
        </div>

        {/* Username Input */}
        <div className="input-container">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            id="username-input"
          />
          <label htmlFor="username-input">Username</label>
        </div>

        {/* Password Input */}
        <div className="input-container">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            id="password-input"
          />
          <label htmlFor="password-input">Password</label>
        </div>
        <div className="button-container">
          <button type="submit">Sign Up</button>
        </div>
      </form>
      <div className="login-link">
                Already a member? 
                <Link to="/login"> Login</Link>
            </div>
    </div>
  );
}

export default SignupForm;


