const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');

// import routes
const contactRoutes = require('./routes/contact');
const feedbackRoutes = require('./routes/feedback');

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { success: false, message: 'Too many requests, please try again later' }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/api', limiter);

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use('/api/contact', contactRoutes);
app.use('/api/feedback', feedbackRoutes);

// GET /api/status
app.get('/api/status', (req, res) => {
    const contacts = require('./routes/contact') ? require('fs').readFileSync(path.join(__dirname, 'data/contacts.json'), 'utf8') : '[]';
    const feedbacks = require('./routes/feedback') ? require('fs').readFileSync(path.join(__dirname, 'data/feedbacks.json'), 'utf8') : '[]';
    
    res.json({
        success: true,
        status: 'API running',
        totalContacts: JSON.parse(contacts).length,
        totalFeedbacks: JSON.parse(feedbacks).length
    });
});

// API documentation
app.get('/api/docs', (req, res) => {
    res.json({
        title: 'Contact Form API Documentation',
        version: '1.0.0',
        endpoints: {
            'POST /api/contact': {
                description: 'Submit contact form',
                requiredFields: ['name', 'email', 'subject', 'message'],
                optionalFields: ['phone', 'company']
            },
            'GET /api/contact': { description: 'Get all contact submissions (admin)' },
            'POST /api/feedback': { description: 'Submit feedback', requiredFields: ['rating', 'comment'], optionalFields: ['email'] },
            'GET /api/feedback/stats': { description: 'Get feedback statistics' }
        }
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ success: false, message: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`🚀 Contact Form API running on http://localhost:${PORT}`);
    console.log(`📖 API Documentation: http://localhost:${PORT}/api/docs`);
});
