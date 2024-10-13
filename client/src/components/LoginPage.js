import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import emojioneV1RecyclingSymbol from "./assets/emojione-v1_recycling-symbol.svg";
import "./styles/style2.css";
import unsplashOkva4Wuixss from "./assets/67233cbeada48924f2a333b324a0a3ca9dfcb9f3.jpg";

export const Login = () => {
    // State for form fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    // Handle login form submission
    const handleLogin = async (event) => {
        event.preventDefault();

        if (!email || !password) {
            setErrorMessage('Please fill in all fields');
            return;
        }

        try {
            // Send form data to backend API
            const response = await axios.post('http://localhost:5000/api/users/login', {
                email,
                password
            });

            if (response.data.token) {
                // Store the JWT token in localStorage or sessionStorage
                localStorage.setItem('token', response.data.token);
                alert('Login Successful');
                navigate('/dashboard'); // Redirect to dashboard after successful login
            } else {
                setErrorMessage('Login failed: ' + response.data.message);
            }
        } catch (error) {
            setErrorMessage('Login failed: ' + (error.response?.data?.message || 'Server error'));
        }
    };

    return (
        <div className="login">
            <div className="overlap-group">
                <div className="frame">
                    <div className="div">
                        <img className="emojione" alt="Emojione" src={emojioneV1RecyclingSymbol} />
                        <div className="text-wrapper">AtQazan</div>
                    </div>
                    <div className="text-wrapper-2">Giriş et</div>
                    <form onSubmit={handleLogin} className="frame-2">
                        {/* Email Field */}
                        <div className="input-base">
                            <label className="label-2" htmlFor="email">Email</label>
                            <input
                                className="input"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Emailinizi daxil edin"
                                type="email"
                            />
                        </div>

                        {/* Password Field */}
                        <div className="input-base">
                            <label className="label-2" htmlFor="password">Şifrə</label>
                            <input
                                className="input"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Şifrənizi daxil edin"
                                type="password"
                            />
                        </div>

                        {/* Submit Button */}
                        <button className="button" type="submit">
                            <div className="button-wrapper">
                                <span className="button-2">Təsdiq et</span>
                            </div>
                        </button>

                        {/* Error Message */}
                        {errorMessage && <div className="error-message">{errorMessage}</div>}
                    </form>
                </div>
                <img className="unsplash" alt="Unsplash" src={unsplashOkva4Wuixss} />
            </div>
        </div>
    );
};

export default Login;
