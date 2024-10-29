import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { users } from '../models/userModel';

export const register = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (users[email]) return res.status(400).send('User already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    users[email] = { email, password: hashedPassword, files: [] };
    res.status(201).send('User registered');
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = users[email];
    if (!user) return res.status(400).send('User not found');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(403).send('Invalid password');

    const token = jwt.sign({ email }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
    res.json({ token });
};
