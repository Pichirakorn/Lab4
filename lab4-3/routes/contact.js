// routes/contact.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const CONTACT_FILE = path.join(__dirname, '../data/contacts.json');

// Helper: อ่าน contacts
const loadContacts = () => {
    try {
        const data = fs.readFileSync(CONTACT_FILE, 'utf8');
        return JSON.parse(data);
    } catch {
        return [];
    }
};

// Helper: บันทึก contacts
const saveContacts = (contacts) => {
    fs.writeFileSync(CONTACT_FILE, JSON.stringify(contacts, null, 2));
};

// POST /api/contact - submit form
router.post('/', (req, res) => {
    const { name, email, subject, message, phone, company } = req.body;
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const contacts = loadContacts();
    const newContact = { id: Date.now(), name, email, subject, message, phone, company, createdAt: new Date() };
    contacts.push(newContact);
    saveContacts(contacts);

    res.json({ success: true, data: newContact });
});

// GET /api/contact - get all submissions (pagination)
router.get('/', (req, res) => {
    const contacts = loadContacts();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const start = (page - 1) * limit;
    const end = start + limit;

    res.json({
        success: true,
        page,
        limit,
        total: contacts.length,
        data: contacts.slice(start, end)
    });
});

module.exports = router;
