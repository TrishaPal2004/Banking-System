import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './style.css';

const Login = () => {
    const [loginData, setLoginData] = useState({ username: "", password: "" });
    const [loginType, setLoginType] = useState("user"); // Default to user login
    
    const navigate = useNavigate();
    
    const handleChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };
    
    // Toggle between user and admin
    const switchToAdmin = () => {
        navigate("/admin"); // Navigate to your existing admin page
    };
    
    const handleLogin = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: loginData.username,
                    password: loginData.password
                }),
            });
            const data = await response.json();
            console.log(data);
            if (data.success) {
                alert("Login successful!");
                localStorage.setItem("user", JSON.stringify(data.user));
                console.log("User Data:", data.user);
                navigate("/user");
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Login failed.");
        }
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <h2>User Login</h2>
                
                {/* Login Type Toggle */}
                
                
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={loginData.username}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={loginData.password}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit">Sign In</button>
                </form>
                <div className="login-type-toggle">
                    
                    <button 
                        type="button"
                        onClick={switchToAdmin}
                    >
                        Admin Login
                    </button>
                </div>
                <div className="login-hint">
                    Enter your credentials to access your account
                </div>
            </div>
        </div>
    );
};

export default Login;