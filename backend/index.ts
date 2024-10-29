import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { register, login } from './controllers/authController';

dotenv.config();
const app = express();
app.use(cors({ origin: 'http://localhost:5173' })); // adjust to your frontend port if different
app.use(express.json());

app.post('/register', register);
app.post('/login', login);

app.listen(3000, () => console.log('Server running on port 3000'));
