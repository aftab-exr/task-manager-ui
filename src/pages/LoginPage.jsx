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
            const res = await authService.login({ username, password });
            const token = res?.token ?? res?.data?.token;
            if (!token) {
                setError("ERR: INVALID_TOKEN_RESPONSE");
                return;
            }
            localStorage.setItem("token", token);
            const user = res?.user ?? res?.data?.user ?? {
                username,
                fullName: res?.fullName ?? res?.data?.fullName,
            };
            localStorage.setItem("user", JSON.stringify(user));
            navigate("/dashboard");
        } catch (err) {
            setError(typeof err === "string" ? err : "ERR: AUTHENTICATION_FAILED");
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-[#0c0f0f] px-4">
            <form onSubmit={handleSubmit} className="bg-[#121414] border border-[#3A4D4D] p-10 w-full max-w-md flex flex-col gap-6 rounded-none">
                <div className="border-b border-[#3A4D4D] pb-4 mb-2">
                    <h2 className="text-2xl font-bold text-[#e2e2e2] tracking-widest">A_UTH_REQ</h2>
                    <p className="font-['JetBrains_Mono'] text-xs text-[#8c9291] mt-1">Please provide clearance credentials.</p>
                </div>
                
                {error && <div className="bg-[#93000a] border border-[#ffb4ab] text-[#ffdad6] p-3 text-sm font-['JetBrains_Mono'] uppercase">! {error}</div>}
                
                <input type="text" placeholder="ID_STRING" required className="obsidian-input p-3"
                    onChange={(e) => setUsername(e.target.value)} />
                
                <input type="password" placeholder="KEY_HASH" required className="obsidian-input p-3"
                    onChange={(e) => setPassword(e.target.value)} />
                
                <button type="submit" className="obsidian-btn-primary p-4 mt-4">Verify Identity</button>
                <p className="text-xs text-center font-['JetBrains_Mono'] text-[#8c9291]">
                    NO CLEARANCE? <Link to="/register" className="text-[#dac3a9] hover:text-[#00FFC2]">REQUEST ACCESS</Link>
                </p>
            </form>
        </div>
    );
}