// server.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from './db'; // Asumiendo que tienes un módulo de conexión a la base de datos

const app = express();
app.use(express.json());

const { PORT = 3001 } = process.env;

app.post('/register', async (req, res) => {
    const { email, password, name } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        // Asumiendo que 'users' es tu tabla de usuarios
        const result = await db.query('INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING *', [email, hashedPassword, name]);
        res.status(201).send(result.rows[0]);
    } catch (error) {
        res.status(500).send("Error registering new user.");
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = rows[0];

        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ id: user.id, email: user.email }, 'secret', { expiresIn: '1h' });
            res.json({ token });
        } else {
            res.status(400).send("Invalid Credentials");
        }
    } catch (error) {
        res.status(500).send("Error logging in user.");
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
