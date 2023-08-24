import React, { useState, useRef } from "react";
import { Link, useHistory, Redirect } from 'react-router-dom';
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useSelector } from 'react-redux';
import "./LoginForm.css";


function LoginForm({ setShowModal, setShowSignupModal }) { 
    const dispatch = useDispatch();
    const history = useHistory();
    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false); 
    const credentialRef = useRef();
    const passwordRef = useRef();
    const sessionUser = useSelector(state => state.session.user);
    const sessionErrors = useSelector(state => state.errors.session)// for session errors
    if (sessionUser) {
      return <Redirect to='/news_feed' />
    }

    const handleCredentialChange = (e) => {
        setCredential(e.target.value);
        if(!e.target.value) e.target.placeholder = " ";
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if(!e.target.value) e.target.placeholder = " ";
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(sessionActions.login({ credential, password }))
    };

    const handleDemoLogin = () => {
        setCredential("July4th@1776.com");
        setPassword("password");
        credentialRef.current.focus();
        setTimeout(() => passwordRef.current.focus(), 100);
      }

    return (
        <div className="login-form-container">
            <form className="logInForm" onSubmit={handleSubmit}>
            <h1>Welcome Back</h1>
            <div className={`error-container ${sessionErrors?.length ? 'active' : ''}`}>
                {sessionErrors?.map((error) => <span key={error} className="error-item">{error}</span>)}
            </div>
                <div className="input-container">
                    <input
                        ref={credentialRef}
                        type="text"
                        value={credential}
                        onChange={handleCredentialChange}
                        required
                        id="credential-input"
                        placeholder=""
                    />
                    <label htmlFor="credential-input">name, phone, email</label>
                </div>
                <div className="input-container">
                    <input
                        ref={passwordRef}
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={handlePasswordChange}
                        required
                        id="password-input"
                        placeholder=""
                    />
                    <label htmlFor="password-input">Password</label>
                    <button 
                        type="button" 
                        className="toggle-password"
                        onClick={() => setShowPassword(prev => !prev)}
                    >
                        {showPassword ? '🙈' : '👁'}
                    </button>
                </div>
                <div className="button-container">
                <button type="submit">Log In</button>
                </div>
                <div className="or-separator">
                        OR
                    </div>


                <div className="demo-container">
                    <button onClick={handleDemoLogin}>George Washington</button>
                </div>
                <div className="signup-link">
                New to Localvoices? 
                <Link to="/"> Sign up</Link>
            </div>
            </form>
        </div>
    );
}

export default LoginForm;



