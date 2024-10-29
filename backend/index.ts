import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { authenticateToken } from './middlewares/authMiddleware';
import { register, login } from './controllers/authController';
import { uploadFile, viewMyFiles, shareFile, getFile } from './controllers/fileController';

const app = express();
const upload = multer({ dest: 'uploads/' });

// Enable CORS for all routes
app.use(cors({ origin: 'http://localhost:5173' })); // Allow requests from the frontend

app.use(express.json());

app.post('/register', register);
app.post('/login', login);
app.post('/upload', authenticateToken, upload.single('file'), uploadFile);
app.get('/my-files', authenticateToken, viewMyFiles);
app.post('/share-file', authenticateToken, shareFile);
app.get('/my-files/:filename', authenticateToken, getFile);

app.listen(3000, () => console.log('Server running on port 3000'));
