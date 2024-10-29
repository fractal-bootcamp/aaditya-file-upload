import React, { useState } from 'react';
import axios from 'axios';
import { getAuthHeader } from '../auth';


const API_URL = 'http://localhost:3000';

function FileUpload() {
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            await axios.post(`${API_URL}/upload`, formData, {
                headers: { ...getAuthHeader(), 'Content-Type': 'multipart/form-data' },
            });
            alert('File uploaded successfully!');
        } catch (error) {
            console.error('Error uploading file', error);
            alert('File upload failed');
        }
    };

    return (
        <div>
            <h2>Upload File</h2>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
}

export default FileUpload;
