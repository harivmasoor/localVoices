import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import "./LoginForm.css";

function LoginForm({ setShowModal, setShowSignupModal }) { 
    const dispatch = useDispatch();
    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false); 
    const [errors, setErrors] = useState([]);

    const handleSignUpClick = () => {
        setShowModal(false);  // close the login modal
        setShowSignupModal(true); // open the signup modal
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors([]);
        return dispatch(sessionActions.login({ credential, password }))
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

    return (
        <>
            <h1>Welcome Back</h1>
            <form onSubmit={handleSubmit}>
                <ul>
                    {errors.map(error => <li key={error}>{error}</li>)}
                </ul>
                <div className="input-container">
                    <input
                        type="text"
                        value={credential}
                        onChange={(e) => setCredential(e.target.value)}
                        required
                        id="credential-input"
                        placeholder=""
                    />
                    <label htmlFor="credential-input">Username or Email</label>
                </div>
                <div className="input-container">
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                <button type="submit">Log In</button>
            </form>
            <div className="signup-link">
                New to Localvoices? 
                <span onClick={handleSignUpClick}>
                    Sign up
                </span>
            </div>
        </>
    );
}

export default LoginForm;


