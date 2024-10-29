import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getAuthHeader } from '../auth';

const API_URL = 'http://localhost:3000';

type FileMetadata = {
    filename: string;
    createdAt: string;
    size: number;
    url: string;
};

function MyFiles() {
    const [files, setFiles] = useState<FileMetadata[]>([]);

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await axios.get(`${API_URL}/my-files`, {
                    headers: getAuthHeader(),
                });
                setFiles(response.data);
            } catch (error) {
                console.error('Error fetching files', error);
                alert('Failed to fetch files');
            }
        };

        fetchFiles();
    }, []);

    return (
        <div>
            <h2>My Files</h2>
            <ul>
                {files.map((file) => (
                    <li key={file.filename}>
                        <p>Filename: {file.filename}</p>
                        <p>Uploaded At: {new Date(file.createdAt).toLocaleString()}</p>
                        <p>Size: {file.size} bytes</p>
                        <a href={file.url} target="_blank" rel="noopener noreferrer">
                            View File
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default MyFiles;
