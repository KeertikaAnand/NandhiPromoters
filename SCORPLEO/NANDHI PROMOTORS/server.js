const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '.'))); // Serve static files from the root directory

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.error('MongoDB connection error:', err));

// Contact Schema
const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    inquiryType: {
        type: String,
        required: true,
        enum: ['buying', 'selling', 'renting', 'propertyManagement']
    },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);

// API route
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, phone, inquiryType, message } = req.body;

        // Save to MongoDB
        const newContact = new Contact({ name, email, phone, inquiryType, message });
        await newContact.save();

        // Inquiry labels for Web3Forms
        const inquiryTypesWeb3Forms = {
            buying: 'Buying Property',
            selling: 'Selling Property',
            renting: 'Renting Property',
            propertyManagement: 'Property Management'
        };

        // Send to Web3Forms
        try {
            const web3Response = await axios.post('https://api.web3forms.com/submit', {
                access_key: process.env.WEB3FORMS_ACCESS_KEY, // Use environment variable for security
                name,
                email,
                phone,
                inquiryType: inquiryTypesWeb3Forms[inquiryType],
                message
            });

            if (web3Response.data.success) {
                res.status(200).json({ success: true, message: 'Form submitted successfully!' });
            } else {
                console.error('Web3Forms submission failed:', web3Response.data);
                res.status(500).json({ success: false, message: 'Saved to DB, but Web3Forms failed to send. Check server logs.' });
            }
        } catch (web3Error) {
            console.error('Error sending to Web3Forms:', web3Error);
            res.status(500).json({ success: false, message: 'Saved to DB, but error sending via Web3Forms. Check server logs.' });
        }

    } catch (error) {
        console.error('Error submitting form:', error);
        res.status(500).json({ success: false, message: 'An error occurred while submitting the form' });
    }
});

// HTML routes - Serving directly from the root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'contact.html'));
});
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'about.html'));
});
app.get('/home.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});
app.get('/contact.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'contact.html'));
});
app.get('/about.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'about.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});