import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../api/authService.js";

export default function Register() {
    const [formData, setFormData] = useState({ username: "", email: "", password: "", fullName: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "TASK_CMD";
    }, []);

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
        <div className="flex h-screen items-center justify-center bg-[#0c0f0f] px-4">
            <form onSubmit={handleSubmit} className="bg-[#121414] border border-[#3A4D4D] p-10 w-full max-w-md flex flex-col gap-6 rounded-none">
                <div className="border-b border-[#3A4D4D] pb-4 mb-2">
                    <h2 className="text-2xl font-bold text-[#e2e2e2] tracking-widest">SIGN_IN</h2>
                    <p className="font-['JetBrains_Mono'] text-xs text-[#8c9291] mt-1">Establish new user protocol.</p>
                </div>
                
                {error && <div className="bg-[#93000a] border border-[#ffb4ab] text-[#ffdad6] p-3 text-sm font-['JetBrains_Mono'] uppercase">! {error}</div>}
                
                <input type="text" placeholder="DESIGNATION (FULL NAME)" required className="obsidian-input p-3"
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
                
                <input type="text" placeholder="ID_STRING (USERNAME)" required className="obsidian-input p-3"
                    onChange={(e) => setFormData({...formData, username: e.target.value})} />
                
                <input type="email" placeholder="COMMS_CHANNEL (EMAIL)" required className="obsidian-input p-3"
                    onChange={(e) => setFormData({...formData, email: e.target.value})} />
                
                <input type="password" placeholder="KEY_HASH (PASSWORD)" required className="obsidian-input p-3"
                    onChange={(e) => setFormData({...formData, password: e.target.value})} />
                
                <button type="submit" className="obsidian-btn-primary p-4 mt-4">Request Access</button>
                <p className="text-xs text-center font-['JetBrains_Mono'] text-[#8c9291]">
                    EXISTING USER? <Link to="/login" className="text-[#dac3a9] hover:text-[#00FFC2]">LOGIN</Link>
                </p>
            </form>
        </div>
    );
}