import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from 'react-router-dom';
import { Redirect } from "react-router-dom";
import * as sessionActions from "../../store/session";
import { Link } from "react-router-dom";
import './SignupForm.css'; 

function SignupForm() {
  const dispatch = useDispatch();
  const history = useHistory();
  const sessionUser = useSelector(state => state.session.user);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  if (sessionUser) return <Redirect to="/news_feed" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    try {
      await dispatch(sessionActions.signup({ email, username, password, phone_number }));
      history.push("/news_feed");
    } catch (res) {
      let data;
      try {
        data = await res.clone().json();
      } catch {
        data = await res.text();
      }
      if (data?.errors) setErrors(data.errors);
      else if (data) setErrors([data]);
      else setErrors([res.statusText]);
    }
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
            placeholder=" "
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
            placeholder=" "
          />
          <label htmlFor="username-input">Username</label>
        </div>
        {/* Phone Number Input */}
<div className="input-container">
    <input
        type="tel"
        value={phone_number} // Ensure you've set up state for this.
        onChange={(e) => setPhoneNumber(e.target.value)}
        required
        id="phone-number-input"
        placeholder=" "
    />
    <label htmlFor="phone-number-input">Phone Number</label>
</div>
        {/* Password Input */}
        <div className="input-container">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            id="password-input"
            placeholder=" "
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


