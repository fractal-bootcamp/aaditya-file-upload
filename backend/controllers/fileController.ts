import { Request, Response } from 'express';
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import s3 from '../config/aws';
import { users, fileShares } from '../models/userModel';
import nodemailer from 'nodemailer';
import fs from 'fs';

export const uploadFile = async (req: Request, res: Response) => {
    const fileContent = fs.readFileSync(req.file.path);
    const { email } = req.user;

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME as string,
        Key: `${email}/${req.file.originalname}`,
        Body: fileContent,
    };

    try {
        const command = new PutObjectCommand(params);
        await s3.send(command);

        const fileMetadata = {
            filename: req.file.originalname,
            createdAt: new Date(),
            size: req.file.size,
            url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${email}/${req.file.originalname}`,
        };

        users[email].files.push(fileMetadata);
        res.json(fileMetadata);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const viewMyFiles = (req: Request, res: Response) => {
    const { email } = req.user;
    res.json(users[email].files);
};

export const shareFile = async (req: Request, res: Response) => {
    const { recipientEmail, fileId } = req.body;
    const { email } = req.user;

    if (!users[recipientEmail]) return res.status(404).send('Recipient not found');
    if (!users[email].files.some((file) => file.filename === fileId)) return res.status(403).send('File not found');

    if (!fileShares[fileId]) fileShares[fileId] = [];
    fileShares[fileId].push(recipientEmail);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipientEmail,
        subject: 'File Shared with You',
        text: `A file has been shared with you. Access it here: http://yourapp.com/shared-files/${fileId}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).send('File shared successfully');
};

export const getFile = async (req: Request, res: Response) => {
    const { email } = req.user;
    const { filename } = req.params;

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME as string,
        Key: `${email}/${filename}`,
    };

    try {
        const command = new GetObjectCommand(params);
        const data = await s3.send(command);
        data.Body.pipe(res); // Stream data directly to the response
    } catch (error) {
        res.status(500).send(error);
    }
};
