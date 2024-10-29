import { Request, Response } from 'express';
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import s3 from '../config/aws';
import prisma from '../prisma';
import fs from 'fs';

export const uploadFile = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            console.error('No file found in the request');
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { userId } = req.user;
        const fileContent = fs.readFileSync(req.file.path);
        const filename = req.file.originalname;
        const size = req.file.size;

        // Upload file to S3
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME as string,
            Key: `${userId}/${filename}`,
            Body: fileContent,
        };

        const command = new PutObjectCommand(params);
        await s3.send(command);

        // Store file metadata in the database
        const file = await prisma.file.create({
            data: {
                filename,
                size,
                url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${userId}/${filename}`,
                userId,
            },
        });

        res.json(file);
    } catch (error) {
        console.error('Error during file upload:', error);
        res.status(403).json({ error: 'Forbidden', details: error.message });
    }
};

export const getFile = async (req: Request, res: Response) => {
    const { userId } = req.user;
    const { filename } = req.params;

    // Find the file in the database
    const file = await prisma.file.findFirst({
        where: { filename, userId },
    });

    if (!file) return res.status(404).json({ error: 'File not found' });

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME as string,
        Key: `${userId}/${filename}`,
    };

    try {
        const command = new GetObjectCommand(params);
        const data = await s3.send(command);

        data.Body.pipe(res);
    } catch (error) {
        console.error('Error retrieving file:', error);
        res.status(500).json({ error: 'Error retrieving file' });
    }
};

export const getMyFiles = async (req: Request, res: Response) => {
    try {
        const { userId } = req.user;

        // Fetch files from the database associated with the user
        const files = await prisma.file.findMany({
            where: { userId },
            select: {
                id: true,
                filename: true,
                createdAt: true,
                size: true,
                url: true,
            },
        });

        res.json(files);
    } catch (error) {
        console.error('Error retrieving files:', error);
        res.status(500).json({ error: 'Error retrieving files' });
    }
};

