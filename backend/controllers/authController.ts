import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../prisma';

export const register = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Ensure no duplicate email
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).send('User already exists');

    // Hash password and create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
        data: { email, password: hashedPassword },
    });

    res.status(201).json({ message: 'User registered' });
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).send('User not found');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(403).send('Invalid password');

    const token = jwt.sign({ userId: user.id, email }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
    res.json({ token });
};
