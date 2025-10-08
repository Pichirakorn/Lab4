// routes/foods.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const FOODS_FILE = path.join(__dirname, '../data/foods.json');

// อ่านข้อมูลจากไฟล์ JSON
const loadFoods = () => {
    try {
        const data = fs.readFileSync(FOODS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading foods:', error);
        return [];
    }
};

// ✅ GET /api/foods - ดึงรายการอาหารทั้งหมด (พร้อม filtering)
router.get('/', (req, res) => {
    try {
        let foods = loadFoods();

        const { search, category, maxSpicy, vegetarian, available, maxPrice } = req.query;

        // Filtering logic
        if (search) {
            const keyword = search.toLowerCase();
            foods = foods.filter(
                f =>
                    f.name.toLowerCase().includes(keyword) ||
                    f.description.toLowerCase().includes(keyword)
            );
        }

        if (category) {
            foods = foods.filter(f => f.category === category);
        }

        if (maxSpicy) {
            const max = parseInt(maxSpicy);
            foods = foods.filter(f => f.spicyLevel <= max);
        }

        if (vegetarian) {
            const isVeg = vegetarian === 'true';
            foods = foods.filter(f => f.vegetarian === isVeg);
        }

        if (available) {
            const isAvail = available === 'true';
            foods = foods.filter(f => f.available === isAvail);
        }

        if (maxPrice) {
            const price = parseInt(maxPrice);
            foods = foods.filter(f => f.price <= price);
        }

        res.json({
            success: true,
            total: foods.length,
            data: foods,
            filters: { search, category, maxSpicy, vegetarian, available, maxPrice }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching foods' });
    }
});

// ✅ GET /api/foods/:id - ดึงข้อมูลอาหารตาม ID
router.get('/:id', (req, res) => {
    const foods = loadFoods();
    const food = foods.find(f => f.id === parseInt(req.params.id));
    if (!food) {
        return res.status(404).json({ success: false, message: 'Food not found' });
    }
    res.json({ success: true, data: food });
});

// ✅ GET /api/foods/category/:category - ดึงอาหารตามประเภท
router.get('/category/:category', (req, res) => {
    const foods = loadFoods();
    const filtered = foods.filter(f => f.category === req.params.category);
    if (filtered.length === 0) {
        return res.status(404).json({ success: false, message: 'No foods in this category' });
    }
    res.json({ success: true, total: filtered.length, data: filtered });
});

// ✅ GET /api/foods/random - ดึงอาหารแบบสุ่ม 1 จาน
router.get('/random', (req, res) => {
    const foods = loadFoods();
    const randomFood = foods[Math.floor(Math.random() * foods.length)];
    res.json({ success: true, data: randomFood });
});

module.exports = router;
