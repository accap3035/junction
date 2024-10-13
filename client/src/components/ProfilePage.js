import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { QRCodeCanvas } from 'qrcode.react'; // Import QRCode generator
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Decode JWT token
import emojioneV1RecyclingSymbol from "./assets/emojione-v1_recycling-symbol.svg";
import './styles/dashboard-style.css'; // Use the same style for consistency

function ProfilePage() {
    const [userFullName, setUserFullName] = useState('');
    const [qrValue, setQrValue] = useState(''); // This will hold the generated token
    const [qrGenerated, setQrGenerated] = useState(false); // To track if the QR is generated
    const navigate = useNavigate(); // For navigation

    // Fetch user details from JWT when the component mounts
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            const fullName = `${decodedToken.name} ${decodedToken.surname}`;
            setUserFullName(fullName);
        }
    }, []);

    // Function to generate a random token and request the backend to bind it to the user
    const generateQRCode = async () => {
        try {
            // Generate random token
            const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            setQrValue(token); // Set the token as the QR code value
            setQrGenerated(true);

            // Optionally: You can bind the generated token with the user in the backend
            // Example: Uncomment the following code if you need to send the token to the backend

            /*
            const response = await axios.post('http://localhost:5000/api/users/bind-token', {
                username: userFullName,
                token: token,
            });

            if (response.data.success) {
                alert('QR Code generated and token saved successfully!');
            } else {
                alert('Error saving token to the database.');
            }
            */
        } catch (error) {
            console.error('Error generating QR code:', error);
            alert('Error generating QR code');
        }
    };

    return (
        <div className="home-default">
            {/* Top Navigation Bar */}
            <div className="frame">
                <div className="div">
                    <img className="emojione" alt="Logo" src={emojioneV1RecyclingSymbol} />
                    <div className="text-wrapper">AtQazan</div>
                </div>
                <button className="button" onClick={() => navigate("/profile")}>
                    {userFullName}
                </button>
            </div>

            {/* Sidebar Navigation */}
            <div className="frame-wrapper">
                <div className="frame-2">
                    <button
                        className="div-wrapper inactive"
                        onMouseEnter={(e) => e.target.classList.remove('inactive')}
                        onMouseLeave={(e) => e.target.classList.add('inactive')}
                        onClick={() => navigate("/dashboard")}
                    >
                        Trashback
                    </button>
                    <button
                        className="button-4 inactive"
                        onMouseEnter={(e) => e.target.classList.remove('inactive')}
                        onMouseLeave={(e) => e.target.classList.add('inactive')}
                        onClick={() => navigate("/report")}
                    >
                        Hesabat
                    </button>
                    <button
                        className="button-4 inactive"
                        onMouseEnter={(e) => e.target.classList.remove('inactive')}
                        onMouseLeave={(e) => e.target.classList.add('inactive')}
                        onClick={() => navigate("/wallet")}
                    >
                        Pul kisəsi
                    </button>
                    <button
                        className="button-4 inactive"
                        onMouseEnter={(e) => e.target.classList.remove('inactive')}
                        onMouseLeave={(e) => e.target.classList.add('inactive')}
                        onClick={() => navigate("/profile")}
                    >
                        Profil
                    </button>
                </div>
            </div>

            {/* Main Content for QR Code */}
            <div className="frame-3">
                <Box className="profile-box">
                    <Typography component="h1" variant="h5" className="profile-title">
                        Create Your QR Code
                    </Typography>

                    {/* Button to Generate QR Code */}
                    <Button
                        className="profile-button"
                        onClick={generateQRCode}
                        disabled={qrGenerated} // Disable button after generating QR code
                    >
                        Create QR Code
                    </Button>

                    {/* Show QR Code if generated */}
                    {qrGenerated && (
                        <Box className="qr-container">
                            <QRCodeCanvas value={qrValue} className="qr-code" />
                            <Typography variant="body2" className="qr-text">
                                Your QR code is ready to be scanned.
                            </Typography>
                        </Box>
                    )}
                </Box>
            </div>
        </div>
    );
}

export default ProfilePage;
