import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:4000/auth/login',
                { username, password });

            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError('Login failed! Please check your credentials.');
        }
    };

    return (
        <div className="form">
            <h1>Login</h1>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleLogin}>
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
                    <span className="text">Sign in</span>
                </button>
            </form>
            <p className="register">
            Don't Have an Account? <a href="/register">Sign up</a> here
            </p>
        </div>
    );
};

export default Login;