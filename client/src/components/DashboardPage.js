import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import emojioneV1RecyclingSymbol from "./assets/emojione-v1_recycling-symbol.svg";
import "./styles/dashboard-style.css"; // Import the updated CSS

export const DashboardPage = () => {
    const [selectedFile, setSelectedFile] = useState(null); // For selected file state
    const [message, setMessage] = useState(""); // For displaying upload status messages
    const [userFullName, setUserFullName] = useState(""); // For user's full name
    const [uploadedImagePath, setUploadedImagePath] = useState(null); // For storing uploaded image path
    const [aiProcessedImage, setAiProcessedImage] = useState(null); // AI-processed image (base64)
    const [recyclableItems, setRecyclableItems] = useState([]); // List of recyclable items returned from AI
    const [totalPrice, setTotalPrice] = useState(0); // Total price for all items
    const navigate = useNavigate();

    // Handle file selection
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        setMessage(""); // Clear message when a new file is selected
    };

    // Fetch user details from JWT
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decodedToken = jwtDecode(token);
            const fullName = `${decodedToken.name} ${decodedToken.surname}`;
            setUserFullName(fullName);
        }
    }, []);

    // Handle file upload process
    const handleUpload = async () => {
        if (!selectedFile) {
            setMessage("Please select a file to upload.");
            return;
        }

        const formData = new FormData();
        formData.append("image", selectedFile);

        try {
            // Upload the image to the backend and send it to AI API for processing
            const response = await axios.post("http://localhost:5000/api/images/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            // Set the uploaded image and handle the AI API response
            setMessage("File uploaded successfully.");
            setUploadedImagePath(response.data.fileName);

            // Set AI-processed image (base64) and recyclable items
            setAiProcessedImage(response.data.processedImage);
            const items = response.data.items.map(item => ({
                ...item,
                weight: 0, // Initialize weight for each item
                totalPrice: 0 // Initialize total price for each item
            }));
            setRecyclableItems(items);
        } catch (error) {
            setMessage("Failed to upload file.");
            console.error(error);
        }
    };

    // Handle weight input change
    const handleWeightChange = (e, itemIndex) => {
        const weight = parseFloat(e.target.value) || 0;
        const updatedItems = recyclableItems.map((item, index) => {
            if (index === itemIndex) {
                const totalPrice = weight * item.price;
                return { ...item, weight, totalPrice };
            }
            return item;
        });

        setRecyclableItems(updatedItems);
        calculateTotalPrice(updatedItems);
    };

    // Calculate total price for all items
    const calculateTotalPrice = (updatedItems) => {
        const total = updatedItems.reduce((acc, item) => acc + item.totalPrice, 0);
        setTotalPrice(total);
    };

    // Handle item deletion
    const handleDeleteItem = (itemIndex) => {
        const updatedItems = recyclableItems.filter((_, index) => index !== itemIndex);
        setRecyclableItems(updatedItems);
        calculateTotalPrice(updatedItems);
    };

    // Handle navigation to different routes
    const handleNavigation = (path) => {
        navigate(path); // Navigate to the selected path
    };

    return (
        <div className="home-default">
            {/* Top Navigation Bar */}
            <div className="frame">
                <div className="div">
                    <img className="emojione" alt="Logo" src={emojioneV1RecyclingSymbol} />
                    <div className="text-wrapper">AtQazan</div>
                </div>
                <button className="button" onClick={() => handleNavigation("/profile")}>
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
                        onClick={() => handleNavigation("/dashboard")}
                    >
                        Trashback
                    </button>
                    <button
                        className="button-4 inactive"
                        onMouseEnter={(e) => e.target.classList.remove('inactive')}
                        onMouseLeave={(e) => e.target.classList.add('inactive')}
                        onClick={() => handleNavigation("/report")}
                    >
                        Hesabat
                    </button>
                    <button
                        className="button-4 inactive"
                        onMouseEnter={(e) => e.target.classList.remove('inactive')}
                        onMouseLeave={(e) => e.target.classList.add('inactive')}
                        onClick={() => handleNavigation("/wallet")}
                    >
                        Pul kisəsi
                    </button>
                    <button
                        className="button-4 inactive"
                        onMouseEnter={(e) => e.target.classList.remove('inactive')}
                        onMouseLeave={(e) => e.target.classList.add('inactive')}
                        onClick={() => handleNavigation("/profile")}
                    >
                        Profil
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="frame-3">
                <div className="frame-4">
                    <p className="p">Əşyalarınızı təkrar emal etmək üçün şəkillərini yükləyin.</p>
                    <p className="text-wrapper-2">
                        Şəkil yükləməklə ətraf mühitin qorunmasına kömək edə bilərsiniz. Şəkli əlavə etmək üçün, aşağıdakı
                        düyməyə klik edin və cihazınızdakı faylı seçin.
                    </p>
                </div>

                {/* File Upload Button */}
                <div className="button-5">
                    <input 
                        type="file" name="image"
                        onChange={handleFileChange} 
                        style={{ display: "none" }} 
                        id="file" 
                    />
                    <label htmlFor="file" className="button-3">
                        Faylı seçin
                    </label>
                </div>

                {/* Upload Status Message */}
                {message && <p style={{ color: "red", marginTop: "10px" }}>{message}</p>}

                {/* Upload Button */}
                <button className="button-5" onClick={handleUpload}>
                    Faylı yükləyin
                </button>

                {/* Display Uploaded Image */}
                {uploadedImagePath && (
                    <div style={{ marginTop: '20px' }}>
                        <h3>Yüklədiyiniz şəkil:</h3>
                        <img 
                            src={`http://localhost:5000/uploads/${uploadedImagePath}`} 
                            alt="Uploaded" 
                            style={{ maxWidth: '100%', height: 'auto' }} 
                        />
                    </div>
                )}

                {/* Display AI Processed Image */}
                {aiProcessedImage && (
                    <div style={{ marginTop: '20px' }}>
                        <h3>AI tərəfindən emal edilmiş şəkil:</h3>
                        <img 
                            src={`data:image/jpeg;base64,${aiProcessedImage}`} 
                            alt="AI Processed" 
                            style={{ maxWidth: '100%', height: 'auto' }} 
                        />
                    </div>
                )}

                {/* Display Recyclable Items */}
                {recyclableItems.length > 0 && (
                <div className="recyclable-items-section">
                    <h3>AI tərəfindən təyin edilmiş təkrar emal edilə bilən əşyalar:</h3>
                    <div className="recyclable-items-list">
                        {recyclableItems.map((item, index) => (
                            <div key={index} className="recyclable-item">
                                <span className="item-name">
                                    {item.name} - Qiymət: {item.price}₼/qr
                                </span>
                                <input
                                    type="number"
                                    placeholder="Çəkisini daxil edin (qr)"
                                    value={item.weight}
                                    onChange={(e) => handleWeightChange(e, index)}
                                    className="item-weight-input"
                                />
                                <span className="item-total">
                                    Ümumi məbləğ: {(item.totalPrice || 0).toFixed(2)}₼
                                </span>
                                <button onClick={() => handleDeleteItem(index)} className="delete-button">
                                    <i className="fas fa-trash"></i> {/* Trash icon */}
                                </button>
                            </div>
                        ))}
                    </div>
                    {/* Display total price for all items */}
                    <div className="total-price">
                        Total: {totalPrice.toFixed(2)}₼
                    </div>
                </div>
            )}

            </div>
        </div>
    );
};

export default DashboardPage;
