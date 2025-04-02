const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname)));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/loading', (req, res) => {
    res.sendFile(path.join(__dirname, 'loading.html'));
});

app.get('/soldier', (req, res) => {
    res.sendFile(path.join(__dirname, 'soldier.html'));
});

app.get('/weapon', (req, res) => {
    res.sendFile(path.join(__dirname, 'weapon.html'));
});

// API Endpoints
const DATA_FILE = path.join(__dirname, 'data.json');

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({
        soldiers: [],
        weapons: []
    }));
}

// Soldier API
app.post('/api/soldier', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(DATA_FILE));
        const newSoldier = {
            id: Date.now(),
            ...req.body,
            createdAt: new Date().toISOString()
        };
        data.soldiers.push(newSoldier);
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        res.status(201).json(newSoldier);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save soldier configuration' });
    }
});

app.get('/api/soldier/:id', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(DATA_FILE));
        const soldier = data.soldiers.find(s => s.id == req.params.id);
        if (soldier) {
            res.json(soldier);
        } else {
            res.status(404).json({ error: 'Soldier not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve soldier' });
    }
});

// Weapon API
app.post('/api/weapon', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(DATA_FILE));
        const newWeapon = {
            id: Date.now(),
            ...req.body,
            createdAt: new Date().toISOString()
        };
        data.weapons.push(newWeapon);
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        res.status(201).json(newWeapon);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save weapon configuration' });
    }
});

app.get('/api/weapon/:id', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(DATA_FILE));
        const weapon = data.weapons.find(w => w.id == req.params.id);
        if (weapon) {
            res.json(weapon);
        } else {
            res.status(404).json({ error: 'Weapon not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve weapon' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Visit: http://localhost:${PORT}`);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
