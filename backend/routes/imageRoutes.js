const express = require('express');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const db = require('../config/db');
const axios = require('axios');


const convertFileToBase64 = (filePath) => {
    return fs.readFileSync(filePath, { encoding: 'base64' }).replace(/data:image\/jpeg;base64,/g,'');;
};

// Initialize multer for file uploads
const upload = multer({
    dest: 'uploads/',
    fileFilter: (req, file, cb) => {
        // Accept only images
        const fileTypes = /jpeg|jpg|png/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = fileTypes.test(file.mimetype);
        if (extname && mimeType) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed'));
        }
    },
    limits: { fileSize: 15 * 1024 * 1024 } // 5MB limit
});

const router = express.Router();
const JWT_SECRET = 'your_jwt_secret';

// Middleware for checking authentication
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).send('Access Denied: No Token Provided');

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified; // Add the verified user data to the request
        next();
    } catch (err) {
        res.status(403).send('Invalid Token');
    }
};

// Route to handle image upload and processing
router.post('/upload', authenticateToken, upload.single('image'), async (req, res) => {
    try {
        const owner_id = req.user.id; // Extract user id from JWT
        const filePath = path.join(__dirname, '../uploads', req.file.filename);
        const fileName = req.file.filename;

        // Read the file and convert it to Base64
        const fileContent = fs.readFileSync(filePath, 'base64');

        // Save file details in the database
        const sql = 'INSERT INTO uploaded_images (owner_id, file_path, file_content) VALUES (?, ?, ?)';
        db.query(sql, [owner_id, filePath, fileContent], async (err, result) => {
            if (err) {
                console.error('Error saving to database:', err);
                return res.status(500).json({ success: false, message: 'Database error' });
            }
            try {
                // Convert uploaded file to base64
                const base64Image = await convertFileToBase64(filePath);
        
                // Process image with AI
                const aiResult = await processImageWithAi(base64Image);
        
                // Send the AI-processed image and items back to the frontend
                res.json({
                    success: true,
                    processedImage: aiResult.image,
                    fileName: fileName,
                    items: aiResult.items
                });
            } catch (error) {
                console.error('Error processing image:', error);
                res.status(500).json({ success: false, message: 'Failed to process image with AI' });
            }
            //res.json({ success: true, message: 'File uploaded successfully', fileName: req.file.filename });
        });
    } catch (error) {
        console.error('Error processing image:', error); // Log the full error stack for debugging
        res.status(500).send('Error processing image');
    }
});

const processImageWithAi = async (base64Image) => {
    try {
        // Sending the image to the AI API (replace with your actual AI API endpoint)
        const aiApiResponse = await axios.post('http://192.168.53.86:8001/predict', {
            image_base64: base64Image,
        });

        // Assuming the AI API responds with processed image and recyclable items
        

        return JSON.parse(aiApiResponse.data);
          
    } catch (error) {
        console.error('Error communicating with AI API:', error);
        throw new Error('Failed to process image with AI');
    }
};


// Mock function for AI model (replace this with actual model)
// async function processImageWithAI(imagePath) {
//     // This is a placeholder. In reality, you'd run your AI model here.
//     // For now, let's return some mock data.
//     return {
//         dimensions: '1024x768',
//         price: 120.00,
//     };
// }

module.exports = router;
