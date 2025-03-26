import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./login.css"; // Import the CSS file

function Login() {
    const [role, setRole] = useState("operator");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate(); // Hook for redirection

    const handleLogin = (e) => {
        e.preventDefault();
        console.log("Logging in as:", { username, password, role });

        // Redirect based on role
        if (role === "operator") navigate("/operator");
        else if (role === "supervisor") navigate("/supervisor");
        else if (role === "admin") navigate("/admin");
    };

    return (
        <div className="container">
            {/* Left Side - Role Selection */}
            <div className="left-side">
                <select 
                    className="role-select" 
                    value={role} 
                    onChange={(e) => setRole(e.target.value)}
                >
                    <option value="operator">Operator</option>
                    <option value="supervisor">Supervisor</option>
                    <option value="admin">Admin</option>
                </select>
                <button className="continue-btn">Continue As</button>
            </div>

            {/* Right Side - Login Form */}
            <div className="right-side">
                <h2>Login</h2>
                <form onSubmit={handleLogin} id="login-form">
                    <input 
                        type="text" 
                        placeholder="Username" 
                        required 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input 
                        type="password" 
                        placeholder="Enter Password" 
                        required 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit" className="login-btn">Login</button>
                </form>
            </div>
        </div>
    );
}

export default Login;
