import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../api/authService.js";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); 
        
        try {
            console.log("1. Sending login request...");
            const res = await authService.login({ username, password });
            
            console.log("2. Backend responded!", res);

            // Let's aggressively check if the token actually exists in the response
            const token = res?.data?.token;

            if (!token) {
                console.error("🚨 CRITICAL ERROR: The backend did not send an accessToken!");
                setError("Backend configuration error: No token received.");
                return; // Stop the function here so it doesn't try to navigate
            }

            // If it made it this far, we have a real token
            localStorage.setItem("token", res.data.token);
            console.log("3. Token saved successfully. Navigating to Dashboard...");
            
            navigate("/dashboard");
            
        } catch (err) {
            console.error("LOGIN FAILED:", err);
            setError(typeof err === "string" ? err : "Invalid username or password");
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96 flex flex-col gap-4">
                <h2 className="text-2xl font-bold text-center mb-2">Log In</h2>
                {error && <div className="bg-red-100 text-red-600 p-2 text-sm rounded">{error}</div>}
                
                <input type="text" placeholder="Username" required className="border p-2 rounded"
                    onChange={(e) => setUsername(e.target.value)} />
                
                <input type="password" placeholder="Password" required className="border p-2 rounded"
                    onChange={(e) => setPassword(e.target.value)} />
                
                <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Log In</button>
                <p className="text-sm text-center">Need an account? <Link to="/register" className="text-blue-600">Sign Up</Link></p>
            </form>
        </div>
    );
}