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
    const [errors, setErrors] = useState([]);
    const credentialRef = useRef();
    const passwordRef = useRef();
    const sessionUser = useSelector(state => state.session.user);
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
        setErrors([]);
        return dispatch(sessionActions.login({ credential, password }))
            .then(() => {
            // Navigate after successful dispatch
                history.push("/news_feed");
            })
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
    };

    const handleDemoLogin = () => {
        setCredential("July4th@1776.com");
        setPassword("password");
        credentialRef.current.focus();
        setTimeout(() => passwordRef.current.focus(), 100);
      }

    return (
        <div className="login-form-container">
            <h1>Welcome Back</h1>
            <form onSubmit={handleSubmit}>
                <ul>
                    {errors.map(error => <li key={error}>{error}</li>)}
                </ul>
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
                    <label htmlFor="credential-input">Username, Email, or Phone Number</label>
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



