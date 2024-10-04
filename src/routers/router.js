const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/register', (req, res) => {
    const { name, email, password } = req.body;
    // Registration logic
    res.status(201).json({ message: 'User registered successfully' });
});

app.post('/api/login', (req, res) => {
    const { user, pwd } = req.body;
    // Login logic
    res.status(200).json({ message: 'User logged in successfully' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
