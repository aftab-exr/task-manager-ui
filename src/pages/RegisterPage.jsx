import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../api/authService.js";

export default function Register() {
    const [formData, setFormData] = useState({ username: "", email: "", password: "", fullName: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await authService.register(formData);
            navigate("/login");
        } catch (err) {
            setError(err);
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96 flex flex-col gap-4">
                <h2 className="text-2xl font-bold text-center mb-2">Sign Up</h2>
                {error && <div className="bg-red-100 text-red-600 p-2 text-sm rounded">{error}</div>}
                
                <input type="text" placeholder="Full Name" required className="border p-2 rounded"
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
                
                <input type="text" placeholder="Username" required className="border p-2 rounded"
                    onChange={(e) => setFormData({...formData, username: e.target.value})} />
                
                <input type="email" placeholder="Email" required className="border p-2 rounded"
                    onChange={(e) => setFormData({...formData, email: e.target.value})} />
                
                <input type="password" placeholder="Password" required className="border p-2 rounded"
                    onChange={(e) => setFormData({...formData, password: e.target.value})} />
                
                <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Register</button>
                <p className="text-sm text-center">Already have an account? <Link to="/login" className="text-blue-600">Login</Link></p>
            </form>
        </div>
    );
}