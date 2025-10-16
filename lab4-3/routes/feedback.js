// routes/feedback.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const FEEDBACK_FILE = path.join(__dirname, '../data/feedbacks.json');

// Helper: อ่าน feedbacks
const loadFeedbacks = () => {
    try {
        const data = fs.readFileSync(FEEDBACK_FILE, 'utf8');
        return JSON.parse(data);
    } catch {
        return [];
    }
};

// Helper: บันทึก feedbacks
const saveFeedbacks = (feedbacks) => {
    fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(feedbacks, null, 2));
};

// POST /api/feedback
router.post('/', (req, res) => {
    const { rating, comment, email } = req.body;
    if (!rating || !comment) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const feedbacks = loadFeedbacks();
    const newFeedback = { id: Date.now(), rating, comment, email, createdAt: new Date() };
    feedbacks.push(newFeedback);
    saveFeedbacks(feedbacks);

    res.json({ success: true, data: newFeedback });
});

// GET /api/feedback/stats
router.get('/stats', (req, res) => {
    const feedbacks = loadFeedbacks();
    const total = feedbacks.length;
    const avgRating = total === 0 ? 0 : (feedbacks.reduce((sum, f) => sum + f.rating, 0) / total).toFixed(2);

    res.json({
        success: true,
        totalFeedbacks: total,
        averageRating: parseFloat(avgRating)
    });
});

module.exports = router;
