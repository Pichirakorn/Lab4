// validation.js

// Contact form validation
const validateContact = (req, res, next) => {
    const { name, email, subject, message, phone, company } = req.body;
    const errors = [];

    // name
    if (!name || typeof name !== 'string') {
        errors.push('Name is required and must be a string.');
    } else if (name.trim().length < 2 || name.trim().length > 100) {
        errors.push('Name must be between 2 and 100 characters.');
    }

    // email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string') {
        errors.push('Email is required and must be a string.');
    } else if (!emailRegex.test(email.trim())) {
        errors.push('Email format is invalid.');
    }

    // subject
    if (!subject || typeof subject !== 'string') {
        errors.push('Subject is required and must be a string.');
    } else if (subject.trim().length < 5 || subject.trim().length > 200) {
        errors.push('Subject must be between 5 and 200 characters.');
    }

    // message
    if (!message || typeof message !== 'string') {
        errors.push('Message is required and must be a string.');
    } else if (message.trim().length < 10 || message.trim().length > 1000) {
        errors.push('Message must be between 10 and 1000 characters.');
    }

    // phone (optional)
    const phoneRegex = /^[0-9]{9,10}$/;
    if (phone && !phoneRegex.test(phone)) {
        errors.push('Phone must be 9 or 10 digits.');
    }

    // company (optional)
    if (company && company.trim().length > 100) {
        errors.push('Company name must not exceed 100 characters.');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors
        });
    }

    // Sanitize data
    req.body.name = name.trim();
    req.body.email = email.trim().toLowerCase();
    req.body.subject = subject.trim();
    req.body.message = message.trim();
    next();
};

// Feedback validation
const validateFeedback = (req, res, next) => {
    const { rating, comment, email } = req.body;
    const errors = [];

    // rating
    const numRating = Number(rating);
    if (rating === undefined || isNaN(numRating)) {
        errors.push('Rating is required and must be a number.');
    } else if (numRating < 1 || numRating > 5) {
        errors.push('Rating must be between 1 and 5.');
    }

    // comment
    if (!comment || typeof comment !== 'string') {
        errors.push('Comment is required and must be a string.');
    } else if (comment.trim().length < 5 || comment.trim().length > 500) {
        errors.push('Comment must be between 5 and 500 characters.');
    }

    // email (optional)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email.trim())) {
        errors.push('Email format is invalid.');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors
        });
    }

    // Sanitize data
    if (email) req.body.email = email.trim().toLowerCase();
    req.body.comment = comment.trim();
    req.body.rating = numRating;

    next();
};

module.exports = {
    validateContact,
    validateFeedback
};
