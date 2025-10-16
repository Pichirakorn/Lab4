// Global variables
let isSubmitting = false;

// DOM Elements
const contactForm = document.getElementById('contactForm');
const feedbackForm = document.getElementById('feedbackForm');
const statusMessages = document.getElementById('statusMessages');
const apiResults = document.getElementById('apiResults');
const ratingSlider = document.getElementById('rating');
const ratingValue = document.getElementById('ratingValue');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeForms();
    setupEventListeners();
});

function initializeForms() {
    // Update rating display
    ratingSlider.addEventListener('input', () => {
        ratingValue.textContent = ratingSlider.value;
    });
}

function setupEventListeners() {
    // Contact form submission
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await submitContactForm();
    });

    // Feedback form submission
    feedbackForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await submitFeedbackForm();
    });

    // TODO: เพิ่ม real-time validation สำหรับ input fields
    // ใช้ addEventListener กับ 'input' event
    // Real-time validation
    contactForm.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', () => {
            const { isValid, message } = validateField(input.name, input.value);
            if (!isValid) {
                input.classList.add('invalid');
                showStatusMessage(message, 'error');
            } else {
                input.classList.remove('invalid');
            }
        });
    });
}

// TODO: สร้างฟังก์ชัน validateField สำหรับ client-side validation
function validateField(fieldName, value) {
    // ตรวจสอบ field แต่ละประเภท
    // return { isValid: boolean, message: string }
    value = value.trim();
    switch (fieldName) {
        case 'name':
            if (!value) return { isValid: false, message: 'Name is required' };
            if (value.length < 2 || value.length > 100) return { isValid: false, message: 'Name must be 2-100 characters' };
            return { isValid: true, message: '' };
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) return { isValid: false, message: 'Email is required' };
            if (!emailRegex.test(value)) return { isValid: false, message: 'Invalid email format' };
            return { isValid: true, message: '' };
        case 'subject':
            if (!value) return { isValid: false, message: 'Subject is required' };
            if (value.length < 5 || value.length > 200) return { isValid: false, message: 'Subject must be 5-200 characters' };
            return { isValid: true, message: '' };
        case 'message':
            if (!value) return { isValid: false, message: 'Message is required' };
            if (value.length < 10 || value.length > 1000) return { isValid: false, message: 'Message must be 10-1000 characters' };
            return { isValid: true, message: '' };
        case 'phone':
            if (!value) return { isValid: true, message: '' };
            if (!/^[0-9]{9,10}$/.test(value)) return { isValid: false, message: 'Phone must be 9-10 digits' };
            return { isValid: true, message: '' };
        case 'company':
            if (value.length > 100) return { isValid: false, message: 'Company must not exceed 100 characters' };
            return { isValid: true, message: '' };
        case 'rating':
            const num = parseInt(value);
            if (isNaN(num) || num < 1 || num > 5) return { isValid: false, message: 'Rating must be 1-5' };
            return { isValid: true, message: '' };
        case 'comment':
            if (!value) return { isValid: false, message: 'Comment is required' };
            if (value.length < 5 || value.length > 500) return { isValid: false, message: 'Comment must be 5-500 characters' };
            return { isValid: true, message: '' };
        default:
            return { isValid: true, message: '' };
    }
}

async function submitContactForm() {
    if (isSubmitting) return;

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());

    try {
        isSubmitting = true;
        updateSubmitButton('contactSubmit', 'กำลังส่ง...', true);

        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            showStatusMessage('✅ ส่งข้อความสำเร็จ! เราจะติดต่อกลับโดยเร็ว', 'success');
            contactForm.reset();
        } else {
            showStatusMessage(`❌ เกิดข้อผิดพลาด: ${result.message}`, 'error');
            if (result.errors) {
                displayValidationErrors(result.errors);
            }
        }
    } catch (error) {
        showStatusMessage('❌ เกิดข้อผิดพลาดในการเชื่อมต่อ', 'error');
        console.error('Error:', error);
    } finally {
        isSubmitting = false;
        updateSubmitButton('contactSubmit', 'ส่งข้อความ', false);
    }
}

async function submitFeedbackForm() {
    if (isSubmitting) return;

    const formData = new FormData(feedbackForm);
    const data = Object.fromEntries(formData.entries());
    data.rating = parseInt(data.rating);

    try {
        isSubmitting = true;
        updateSubmitButton('feedbackSubmit', 'กำลังส่ง...', true);

        // TODO: ส่งข้อมูลไปยัง /api/feedback endpoint
        // ใช้ fetch API

        // TODO: จัดการ response และแสดงผลลัพธ์
        const response = await fetch('/api/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            showStatusMessage('✅ ส่งความคิดเห็นสำเร็จ! ขอบคุณสำหรับ feedback', 'success');
            feedbackForm.reset();
            ratingValue.textContent = ratingSlider.value;
        } else {
            showStatusMessage(`❌ เกิดข้อผิดพลาด: ${result.message}`, 'error');
            if (result.errors) displayValidationErrors(result.errors);
        }

    } catch (error) {
        showStatusMessage('❌ เกิดข้อผิดพลาดในการเชื่อมต่อ', 'error');
        console.error('Error:', error);
    } finally {
        isSubmitting = false;
        updateSubmitButton('feedbackSubmit', 'ส่งความคิดเห็น', false);
    }
}

function showStatusMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `status-message ${type}`;
    messageDiv.textContent = message;

    statusMessages.appendChild(messageDiv);

    // Auto remove after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

function updateSubmitButton(buttonId, text, disabled) {
    const button = document.getElementById(buttonId);
    button.textContent = text;
    button.disabled = disabled;
}

function displayValidationErrors(errors) {
    errors.forEach(error => {
        showStatusMessage(`🔸 ${error}`, 'error');
    });
}

// API Testing Functions
async function loadContacts() {
    try {
        // TODO: เรียก GET /api/contact และแสดงผลลัพธ์
        apiResults.textContent = 'Loading contacts...';
        const response = await fetch('/api/contact');
        const data = await response.json();
        apiResults.textContent = JSON.stringify(data, null, 2);
    } catch (error) {
        apiResults.textContent = 'Error loading contacts: ' + error.message;
    }
}

async function loadFeedbackStats() {
    try {
        // TODO: เรียก GET /api/feedback/stats และแสดงผลลัพธ์
        apiResults.textContent = 'Loading feedback stats...';
        const response = await fetch('/api/feedback/stats');
        const data = await response.json();
        apiResults.textContent = JSON.stringify(data, null, 2);
    } catch (error) {
        apiResults.textContent = 'Error loading feedback stats: ' + error.message;
    }
}

async function loadAPIStatus() {
    try {
        // TODO: เรียก GET /api/status และแสดงผลลัพธ์
        apiResults.textContent = 'Loading API status...';
        const response = await fetch('/api/status');
        const data = await response.json();
        apiResults.textContent = JSON.stringify(data, null, 2);
    } catch (error) {
        apiResults.textContent = 'Error loading API status: ' + error.message;
    }
}

async function loadAPIDocs() {
    try {
        const response = await fetch('/api/docs');
        const data = await response.json();
        apiResults.textContent = JSON.stringify(data, null, 2);
    } catch (error) {
        apiResults.textContent = 'Error loading API docs: ' + error.message;
    }
}