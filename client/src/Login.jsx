import React, { useState } from 'react';
import './Login.css';

function LoginPage({ onLoginSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Hardcoded credentials for the login
    const correctUsername = "admin";
    const correctPassword = "1234";

    const handleLogin = () => {
        // Check if the entered credentials match the hardcoded credentials
        if (username === correctUsername && password === correctPassword) {
            onLoginSuccess(); // Call the success handler on successful login
        } else {
            setErrorMessage("Invalid username or password.");
        }
    };

    return (
        <div className="login-container">
            <h2>Staff Login</h2>
            <div className="login-form">
                <input 
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <div className='login-input'>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                </div>
                <button className="submitbutton" onClick={handleLogin}>Login</button>
                {errorMessage && <p className="error">{errorMessage}</p>}
            </div>
        </div>
    );
}

export default LoginPage;