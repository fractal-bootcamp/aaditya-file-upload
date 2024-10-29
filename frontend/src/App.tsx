import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import MyFiles from './components/MyFiles';
import { login, register } from './auth';

const App: React.FC = () => {
    const [view, setView] = useState<'upload' | 'myFiles' | 'auth'>('auth');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        try {
            await register(email, password);
            alert('Registered successfully!');
        } catch (error) {
            alert('Registration failed');
        }
    };

    const handleLogin = async () => {
        try {
            await login(email, password);
            alert('Logged in successfully!');
            setView('upload');
        } catch (error) {
            alert('Login failed');
        }
    };

    return (
        <div>
            <header>
                <h1>Secure File Storage</h1>
                <nav>
                    <button onClick={() => setView('upload')}>Upload Files</button>
                    <button onClick={() => setView('myFiles')}>My Files</button>
                </nav>
            </header>

            <main>
                {view === 'auth' && (
                    <div>
                        <h2>Login or Register</h2>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button onClick={handleLogin}>Login</button>
                        <button onClick={handleRegister}>Register</button>
                    </div>
                )}
                {view === 'upload' && <FileUpload />}
                {view === 'myFiles' && <MyFiles />}
            </main>
        </div>
    );
};

export default App;
