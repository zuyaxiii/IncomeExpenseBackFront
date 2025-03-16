import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!username || !password || !confirmPassword) {
            setError('Please fill out the application form before submitting it.');
            return;
        }

        if (password !== confirmPassword) {
            setError(`Password and Confirm Password Doesn't match`);
            return
        }

        try {
            const response = await axios.post('http://localhost:4000/auth/register',
                { username, password },
                { headers: { 'Content-Type': 'application/json' } }
            );

            if (response.status === 201 || response.status === 200) {
                setSuccessMessage('Sign up Success!');
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } else {
                setError('An error occurred while registering. Please try again.');
            }
        } catch (error) {
            setError('Register failure! Please try again.')
        }
    }

    return (
        <div className="form">
            <h1>Sign Up</h1>
            {error && <div className="error">{error}</div>}
            {successMessage && <div className="error">{successMessage}</div>}
            <form onSubmit={handleRegister}>
                <div className="control block-cube block-input">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <div className="bg-top">
                        <div className="bg-inner"></div>
                    </div>
                    <div className="bg-right">
                        <div className="bg-inner"></div>
                    </div>
                    <div className="bg">
                        <div className="bg-inner"></div>
                    </div>
                </div>
                <div className="control block-cube block-input">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="bg-top">
                        <div className="bg-inner"></div>
                    </div>
                    <div className="bg-right">
                        <div className="bg-inner"></div>
                    </div>
                    <div className="bg">
                        <div className="bg-inner"></div>
                    </div>
                </div>
                <div className="control block-cube block-input">
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <div className="bg-top">
                        <div className="bg-inner"></div>
                    </div>
                    <div className="bg-right">
                        <div className="bg-inner"></div>
                    </div>
                    <div className="bg">
                        <div className="bg-inner"></div>
                    </div>
                </div>
                <button type="submit" className="btn block-cube block-cube-hover">
                    <div className="bg-top">
                        <div className="bg-inner"></div>
                    </div>
                    <div className="bg-right">
                        <div className="bg-inner"></div>
                    </div>
                    <div className="bg">
                        <div className="bg-inner"></div>
                    </div>
                    <span className="text">Sign Up</span>
                </button>
            </form>
        </div>
    )
}

export default Register;