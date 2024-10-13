import React, { useState } from 'react';
import axios from 'axios';
import emojioneV1RecyclingSymbol from './assets/emojione-v1_recycling-symbol.svg';
import './styles/style.css';
import unsplashGci1Twuztz8 from './assets/image-1.jpeg';
import { useNavigate } from 'react-router-dom';

export const Register = () => {
    // State for form fields (corrected to use name and surname instead of username)
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    // Handle form submission
    const handleRegister = async (event) => {
        event.preventDefault(); // Prevent form from refreshing the page

        // Check if all fields are filled
        if (!name || !surname || !email || !password || !contactNumber) {
            setErrorMessage('Please fill in all fields');
            return;
        }

        try {
            // Send form data to backend API
            const response = await axios.post('http://localhost:5000/api/users/register', {
                name,     // User's name
                surname,  // User's surname
                email,    // User's email
                password, // User's password
                contact_number: contactNumber, // User's contact number
            });

            if (response.data.success) {
                alert('Registration Successful');
                navigate('/login'); // Redirect to login after successful registration
            } else {
                setErrorMessage('Registration failed: ' + response.data.message);
            }
        } catch (error) {
            setErrorMessage('Registration failed: ' + error.response?.data?.message || 'Server error');
        }
    };

    return (
        <div className="sign-up">
            <img className="unsplash" alt="Background" src={unsplashGci1Twuztz8} />
            <div className="frame">
                <div className="div">
                    <img className="emojione" alt="Logo" src={emojioneV1RecyclingSymbol} />
                    <div className="text-wrapper">AtQazan</div>
                </div>
                <div className="text-wrapper-2">Qeydiyyatdan keç</div>
                <form onSubmit={handleRegister} className="frame-2">
                    {/* Name Field */}
                    <div className="input-base">
                        <label className="label-2" htmlFor="first-name">Adınız</label>
                        <input
                            className="input"
                            id="first-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Adınızı daxil edin"
                            type="text"
                        />
                    </div>

                    {/* Surname Field */}
                    <div className="input-base">
                        <label className="label-2" htmlFor="last-name">Soyadınız</label>
                        <input
                            className="input"
                            id="last-name"
                            value={surname}
                            onChange={(e) => setSurname(e.target.value)}
                            placeholder="Soyadınızı daxil edin"
                            type="text"
                        />
                    </div>

                    {/* Email Field */}
                    <div className="input-base">
                        <label className="label-2" htmlFor="email">Email</label>
                        <input
                            className="input"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email adresinizi daxil edin"
                            type="email"
                        />
                    </div>

                    {/* Phone Number Field */}
                    <div className="input-base">
                        <label className="label-2" htmlFor="phone-number">Nömrə</label>
                        <input
                            className="input"
                            id="phone-number"
                            value={contactNumber}
                            onChange={(e) => setContactNumber(e.target.value)}
                            placeholder="Telefon nömrənizi daxil edin"
                            type="tel"
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
        </div>
    );
};

export default Register;
