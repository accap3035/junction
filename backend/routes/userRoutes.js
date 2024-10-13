const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const router = express.Router();

// JWT secret key (use an environment variable in production)
const JWT_SECRET = 'your_jwt_secret'; 


// Register new user
router.post('/register', async (req, res) => {
    const { name, surname, email, password, contact_number } = req.body;

    try {
        // Check if email already exists
        const checkQuery = 'SELECT * FROM users WHERE email = ?';
        db.query(checkQuery, [email], async (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ success: false, message: 'Database error' });
            }
            if (results.length > 0) {
                return res.status(400).json({ success: false, message: 'Email is already registered' });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Save the new user to the database
            const insertQuery = 'INSERT INTO users (name, surname, email, contact_number, password) VALUES (?, ?, ?, ?, ?)';
            db.query(insertQuery, [name, surname, email, contact_number, hashedPassword], (err, result) => {
                if (err) {
                    console.error('Error saving user:', err);
                    return res.status(500).json({ success: false, message: 'Database error' });
                }

                res.json({ success: true, message: 'User registered successfully' });
            });
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});





// Login User
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Check if all fields are provided
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Please fill in all fields' });
    }

    const sql = 'SELECT * FROM users WHERE email = ?';
    
    db.query(sql, [email], async (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Compare the provided password with the hashed password stored in the database
        const comparison = await bcrypt.compare(password, results[0].password);
        if (comparison) {
            // Create a JWT payload with the user's ID, name, and surname
            const token = jwt.sign(
                { id: results[0].id, name: results[0].name, surname: results[0].surname },
                JWT_SECRET,
                { expiresIn: '1h' } // Token will expire in 1 hour
            );
            
            // Return the token and the user's name
            return res.json({
                success: true,
                token,
                user: {
                    id: results[0].id,
                    name: results[0].name,
                    surname: results[0].surname,
                    email: results[0].email,
                    contact_number: results[0].contact_number
                }
            });
        } else {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    });
});

// Middleware to verify JWT token
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

router.post('/bind-token', async (req, res) => {
    const { username, token } = req.body;

    try {
        // Update the 'users' table to bind the QR token to the user
        const sql = 'UPDATE users SET qr_token = ? WHERE username = ?';
        db.query(sql, [token, username], (err, result) => {
            if (err) {
                console.error('Error updating user with token:', err);
                return res.status(500).json({ success: false, message: 'Database error' });
            }
            res.json({ success: true, message: 'Token bound to user successfully' });
        });
    } catch (error) {
        console.error('Error binding token:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

router.get('/profile', authenticateToken, (req, res) => {
    const username = req.user.username;

    // Fetch user data from the database
    const sql = 'SELECT name, email, contact_number FROM users WHERE email = ?';
    db.query(sql, [username], (err, results) => {
        if (err) {
            console.error('Error fetching user profile:', err);
            return res.status(500).send('Server error');
        }
        if (results.length > 0) {
            const userProfile = {
                username: results[0].username,
                email: results[0].email,
                contact_number: results[0].contact_number,
            };
            res.json(userProfile);
        } else {
            res.status(404).send('User not found');
        }
    });
});

// Protected route example (Dashboard)
router.get('/dashboard', authenticateToken, (req, res) => {
    res.send(`Welcome to the dashboard, ${req.user.username}`);
});

module.exports = router;
