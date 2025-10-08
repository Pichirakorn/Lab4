// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');

// ✅ import routes & middleware
const foodRoutes = require('./routes/foods');
const logger = require('./middleware/logger');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(logger); // ✅ Logger middleware

// Routes
app.get('/', (req, res) => {
    res.json({
        message: '🍜 Welcome to Food API!',
        version: '1.0.0',
        endpoints: {
            foods: '/api/foods',
            search: '/api/foods?search=ผัด',
            category: '/api/foods?category=แกง',
            spicy: '/api/foods?maxSpicy=3',
            vegetarian: '/api/foods?vegetarian=true',
            documentation: '/api/docs'
        }
    });
});

// ✅ ใช้ foodRoutes สำหรับ /api/foods
app.use('/api/foods', foodRoutes);

// ✅ สร้าง route GET /api/docs
app.get('/api/docs', (req, res) => {
    res.json({
        title: '🍱 Food API Documentation',
        version: '1.0.0',
        routes: {
            '/api/foods': 'Get all foods with optional filters',
            '/api/foods/:id': 'Get food by ID',
            '/api/foods/category/:category': 'Get foods by category',
            '/api/foods/random': 'Get a random food',
            '/api/stats': 'Get menu statistics'
        },
        filters: {
            search: 'Search foods by name or description',
            category: 'Filter by category name',
            maxSpicy: 'Filter by maximum spicy level',
            vegetarian: 'Filter vegetarian (true/false)',
            available: 'Filter available dishes (true/false)',
            maxPrice: 'Filter by maximum price'
        }
    });
});

// ✅ สร้าง route GET /api/stats
app.get('/api/stats', (req, res) => {
    const foods = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/foods.json'), 'utf8'));

    const total = foods.length;
    const byCategory = {};
    foods.forEach(f => {
        byCategory[f.category] = (byCategory[f.category] || 0) + 1;
    });

    const avgPrice = (
        foods.reduce((sum, f) => sum + f.price, 0) / total
    ).toFixed(2);

    const availableCount = foods.filter(f => f.available).length;
    const vegetarianCount = foods.filter(f => f.vegetarian).length;

    res.json({
        success: true,
        totalFoods: total,
        availableFoods: availableCount,
        vegetarianFoods: vegetarianCount,
        averagePrice: parseFloat(avgPrice),
        byCategory
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'API endpoint not found',
        requestedUrl: req.originalUrl
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Food API Server running on http://localhost:${PORT}`);
    console.log(`📖 API Documentation: http://localhost:${PORT}/api/docs`);
});
