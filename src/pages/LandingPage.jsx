import { Link } from "react-router-dom";

export default function LandingPage() {
    return (
        <div className="min-h-screen flex flex-col bg-[#0c0f0f] text-[#e2e2e2]">
            {/* Top Bar */}
            <nav className="flex justify-between items-center p-6 border-b border-[#3A4D4D] max-w-[1440px] w-full mx-auto">
                <div className="text-2xl font-extrabold tracking-widest text-[#e2e2e2]">
                    OBSIDIAN<span className="text-[#00FFC2]">_PROTOCOL</span>
                </div>
                <div className="flex gap-4">
                    <Link to="/login" className="obsidian-btn-secondary px-6 py-2 text-sm">Initialize</Link>
                    <Link to="/register" className="obsidian-btn-primary px-6 py-2 text-sm">Deploy</Link>
                </div>
            </nav>

            {/* Main Terminal View */}
            <main className="flex-grow flex flex-col items-start justify-center px-6 md:px-16 max-w-[1440px] w-full mx-auto">
                <div className="border-l-2 border-[#00FFC2] pl-6 py-2 mb-8">
                    <p className="font-['JetBrains_Mono'] text-[#dac3a9] text-sm uppercase tracking-widest mb-4">
                        System Status: <span className="text-[#00FFC2]">Online</span>
                    </p>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6 leading-none">
                        ENGINEERING <br />
                        <span className="text-[#3A4D4D]">WORKSPACE</span>
                    </h1>
                </div>
                
                <p className="text-lg text-[#c1c8c7] mb-10 max-w-2xl leading-relaxed">
                    {'> '}A high-density, low-distraction environment for technical sprints. <br/>
                    {'> '}Connect to the MongoDB Atlas cluster.<br/>
                    {'> '}Organize deployments, hackathon tasks, and operational objectives <span className="terminal-cursor"></span>
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <Link to="/register" className="obsidian-btn-primary px-8 py-4 text-lg">
                        Execute Sequence
                    </Link>
                    <Link to="/login" className="obsidian-btn-secondary px-8 py-4 text-lg">
                        Access Matrix
                    </Link>
                </div>
            </main>

            {/* Data Grid Footer */}
            <footer className="border-t border-[#3A4D4D] bg-[#121414] py-8">
                <div className="max-w-[1440px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 font-['JetBrains_Mono'] text-xs text-[#8c9291]">
                    <div className="flex flex-col gap-2 border-t border-[#3A4D4D] pt-4">
                        <span className="text-[#dac3a9] uppercase">Node 01: Architecture</span>
                        <span>Zero-roundedness structural containers.</span>
                    </div>
                    <div className="flex flex-col gap-2 border-t border-[#3A4D4D] pt-4">
                        <span className="text-[#dac3a9] uppercase">Node 02: Performance</span>
                        <span>MERN Stack / Vite / Render / Vercel.</span>
                    </div>
                    <div className="flex flex-col gap-2 border-t border-[#3A4D4D] pt-4">
                        <span className="text-[#dac3a9] uppercase">Node 03: Security</span>
                        <span>JWT Encrypted Auth Protocol.</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}