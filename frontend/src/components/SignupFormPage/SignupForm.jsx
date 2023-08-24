import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { useHistory } from 'react-router-dom';
import { Redirect } from "react-router-dom";
import * as sessionActions from "../../store/session";
import { Link } from "react-router-dom";
import './SignupForm.css'; 
import BackgroundContext from "../../context/backgroundContext";
import localImage from '../../assets/local.png';

function SignupForm() {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const { setBackground } = useContext(BackgroundContext);
  const sessionErrors = useSelector(state => state.errors.session)// for session errors

  useEffect(() => { 
    setBackground(`url(${localImage})`); // set the background when the component mounts

    return () => {
      setBackground(''); // revert to original when the component unmounts
    }
  }, [setBackground]);


  if (sessionUser) return <Redirect to="/news_feed" />;

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(sessionActions.signup({ email, username, password, phone_number }))
  }
  return (
    <div className="signup-form-container">

      <form className="signUpForm" onSubmit={handleSubmit}>
      <h1>Find your voice</h1>
      <div className={`error-container ${sessionErrors?.length ? 'active' : ''}`}>
          {sessionErrors?.map((error) => <span key={error} className="error-item">{error}</span>)}
      </div>


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
      <div className="login-link">
                Already a member? 
                <Link to="/login"> Login</Link>
            </div>
      </form>
    </div>
  );
}

export default SignupForm;


