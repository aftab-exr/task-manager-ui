import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";

const COMMANDS = [
    {
        id: "create",
        label: "task create",
        hint: "Deploy objectives with title, notes, and priority (Low / Medium / High).",
    },
    {
        id: "board",
        label: "board view --kanban",
        hint: "Run sprints on a three-lane board: Pending → In Progress → Completed.",
    },
    {
        id: "move",
        label: "task move --drag",
        hint: "Drag cards between columns; status updates sync to your workspace instantly.",
    },
    {
        id: "queue",
        label: "task list --mine",
        hint: "Every operator gets a private queue—only your tasks, no cross-wire.",
    },
];

export default function LandingPage() {
    const [activeId, setActiveId] = useState(COMMANDS[0].id);
    const [paused, setPaused] = useState(false);

    const active = COMMANDS.find((c) => c.id === activeId) ?? COMMANDS[0];

    const cycleNext = useCallback(() => {
        setActiveId((prev) => {
            const i = COMMANDS.findIndex((c) => c.id === prev);
            return COMMANDS[(i + 1) % COMMANDS.length].id;
        });
    }, []);

    useEffect(() => {
        document.title = "TASK_CMD";
    }, []);

    useEffect(() => {
        if (paused) return;
        const timer = setInterval(cycleNext, 4000);
        return () => clearInterval(timer);
    }, [paused, cycleNext]);
    return (
        <div className="min-h-screen flex flex-col bg-[#0c0f0f] text-[#e2e2e2]">
            {/* Top Bar */}
            <nav className="flex justify-between items-center p-6 border-b border-[#3A4D4D] max-w-[1440px] w-full mx-auto">
                <div className="text-2xl font-extrabold tracking-widest text-[#e2e2e2]">
                    TASK<span className="text-[#00FFC2]">_CMD</span>
                </div>
                <div className="flex gap-4">
                    <Link to="/login" className="obsidian-btn-secondary px-6 py-2 text-sm">LOG_IN</Link>
                    <Link to="/register" className="obsidian-btn-primary px-6 py-2 text-sm">SIGN_UP</Link>
                </div>
            </nav>

            {/* Main Terminal View */}
            <main className="flex-grow flex flex-col items-start justify-center px-6 pb-6 md:px-16 max-w-[1440px] w-full mx-auto">
                <div className="border-l-2 border-[#00FFC2] pl-6 py-2 mb-8">
                    <p className="font-['JetBrains_Mono'] text-[#dac3a9] text-sm uppercase tracking-widest mb-4">
                        System Status: <span className="text-[#00FFC2]">Online</span>
                    </p>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6 leading-none">
                        ENGINEERING <br />
                        <span className="text-[#3A4D4D]">WORKSPACE</span>
                    </h1>
                </div>
                
                <div
                    className="mb-10 max-w-2xl w-full"
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                >
                    <div className="flex flex-wrap gap-2 mb-4">
                        {COMMANDS.map((cmd) => (
                            <button
                                key={cmd.id}
                                type="button"
                                onClick={() => setActiveId(cmd.id)}
                                className={`font-['JetBrains_Mono'] text-xs uppercase px-3 py-2 border transition-colors rounded-none ${
                                    activeId === cmd.id
                                        ? "border-[#00FFC2] text-[#00FFC2] bg-[#121414]"
                                        : "border-[#3A4D4D] text-[#8c9291] hover:border-[#dac3a9] hover:text-[#dac3a9]"
                                }`}
                            >
                                {cmd.label}
                            </button>
                        ))}
                    </div>
                    <p className="text-lg text-[#c1c8c7] leading-relaxed font-['JetBrains_Mono'] min-h-[4.5rem]">
                        <span className="text-[#00FFC2]">{'> '}{active.label}</span>
                        <span className="text-[#c1c8c7]"> — {active.hint}</span>
                        <span className="terminal-cursor"></span>
                    </p>
                    <p className="font-['JetBrains_Mono'] text-xs text-[#8c9291] mt-3">
                        Ready to run?{' '}
                        <Link to="/register" className="text-[#dac3a9] hover:text-[#00FFC2]">
                            SIGN_UP
                        </Link>
                        {' '}or{' '}
                        <Link to="/login" className="text-[#dac3a9] hover:text-[#00FFC2]">
                            LOG_IN
                        </Link>
                        {' '}to open your board.
                    </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <Link to="/register" className="obsidian-btn-primary px-8 py-4 text-lg">
                        Request Access
                    </Link>
                    <Link to="/login" className="obsidian-btn-secondary px-8 py-4 text-lg">
                        Access Matrix
                    </Link>
                </div>
            </main>
            
            {/* Data Grid Footer */}
            <footer className="border-t border-[#3A4D4D] bg-[#121414] py-8">
                <div className="max-w-[1440px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 font-['JetBrains_Mono'] text-sm text-[#8c9291]">
                    <div className="flex flex-col gap-2 border-t border-[#3A4D4D] pt-4">
                        <span className="text-[#dac3a9] font-medium">Add what you need to do</span>
                        <span>Create tasks with a title, short description, and priority so your list stays clear.</span>
                    </div>
                    <div className="flex flex-col gap-2 border-t border-[#3A4D4D] pt-4">
                        <span className="text-[#dac3a9] font-medium">See where things stand</span>
                        <span>Use a simple board—Pending, In Progress, and Done—and drag cards as you make progress.</span>
                    </div>
                    <div className="flex flex-col gap-2 border-t border-[#3A4D4D] pt-4">
                        <span className="text-[#dac3a9] font-medium">Your list stays yours</span>
                        <span>Sign in to keep your tasks private. Only you see and manage your workspace.</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}