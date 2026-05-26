import { useState, useEffect, useMemo } from "react";
import { taskService } from "../api/taskService";
import { useNavigate } from "react-router-dom";

// --- AUTH & SESSION HELPERS ---
function readSessionUser() {
    try {
        const raw = localStorage.getItem("user");
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function getUserInitials(user) {
    const label = user?.fullName?.trim() || user?.username?.trim() || "";
    if (!label) return "??";
    const parts = label.split(/\s+/);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return label.slice(0, 2).toUpperCase();
}

function getUserDisplayName(user) {
    return user?.fullName?.trim() || user?.username?.trim() || "Guest Operator";
}

function normalizeTasksResponse(res) {
    const fetchedData = res?.data ?? res?.tasks ?? (Array.isArray(res) ? res : []);
    return Array.isArray(fetchedData) ? fetchedData : [];
}

export default function Dashboard() {
    const [tasks, setTasks] = useState([]);
    
    // Modal & Form States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("Medium");
    const [status, setStatus] = useState("Pending");
    const [draggedTaskId, setDraggedTaskId] = useState(null);
    
    const navigate = useNavigate();
    const sessionUser = useMemo(() => readSessionUser(), []);

    // --- DATA FETCHING ---
    const refreshTasks = async () => {
        try {
            const res = await taskService.myTasks();
            setTasks(normalizeTasksResponse(res));
        } catch (err) {
            console.error("Failed to fetch tasks:", err);
        }
    };

    useEffect(() => {
        let cancelled = false;
        taskService.myTasks()
            .then((res) => {
                if (!cancelled) setTasks(normalizeTasksResponse(res));
            })
            .catch((err) => {
                if (!cancelled) console.error("Failed to fetch tasks:", err);
            });
        return () => { cancelled = true; };
    }, []);

    // --- CRUD ACTIONS ---
    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await taskService.create({ title, description, status: "Pending", priority });
            closeModal();
            refreshTasks();
        } catch (error) {
            console.error("Failed to create task", error);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await taskService.update(editingTask._id, { title, description, status, priority });
            closeModal();
            refreshTasks();
        } catch (error) {
            console.error("Failed to update task", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await taskService.delete(id);
            refreshTasks();
        } catch (error) {
            console.error("Failed to delete task", error);
        }
    };

    // --- DRAG AND DROP LOGIC ---
    const handleDragStart = (e, taskId) => {
        setDraggedTaskId(taskId);
        setTimeout(() => e.target.classList.add('opacity-40', 'border-[#4ddada]'), 0);
    };

    const handleDragEnd = (e) => {
        e.target.classList.remove('opacity-40', 'border-[#4ddada]');
        setDraggedTaskId(null);
    };

    const handleDragOver = (e) => e.preventDefault();

    const handleDrop = async (e, newStatus) => {
        e.preventDefault();
        if (!draggedTaskId) return;

        const taskToUpdate = tasks.find(t => t._id === draggedTaskId);
        if (!taskToUpdate || taskToUpdate.status === newStatus) return;

        // Optimistic Update
        setTasks(prev => prev.map(task => 
            task._id === draggedTaskId ? { ...task, status: newStatus } : task
        ));

        // Background Sync
        try {
            await taskService.update(draggedTaskId, { ...taskToUpdate, status: newStatus });
        } catch {
            refreshTasks(); // Revert on failure
        }
        setDraggedTaskId(null);
    };

    // --- MODAL CONTROLS ---
    const openModal = (task = null) => {
        if (task) {
            setEditingTask(task);
            setTitle(task.title); setDescription(task.description);
            setPriority(task.priority); setStatus(task.status);
        } else {
            setEditingTask(null);
            setTitle(""); setDescription("");
            setPriority("Medium"); setStatus("Pending");
        }
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);
    
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const columns = ["Pending", "In Progress", "Completed"];

    return (
        <div className="bg-[#0c0f0f] text-[#e2e2e2] font-['Courier_Prime'] h-screen overflow-hidden flex selection:bg-[#004f4f] selection:text-[#6ff7f7] relative">
            <div className="hud-scanline"></div>
            
            {/* Minimal Left Sidebar */}
            <nav className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-[#121414] border-r border-[#3f4949] z-40">
                <div className="p-6 border-b border-[#3f4949]">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-[#1a1c1c] border border-[#4ddada] flex items-center justify-center">
                            <span className="material-symbols-outlined text-[24px] text-[#4ddada]">terminal</span>
                        </div>
                        <h1 className="font-['Anybody'] text-2xl text-[#e2e2e2] font-bold tracking-widest">TASK<span className="text-[#4ddada]">_CMD</span></h1>
                    </div>
                    <div className="flex items-center gap-3 min-w-0">
                        <div
                            className="w-8 h-8 shrink-0 bg-[#1a1c1c] border border-[#3f4949] flex items-center justify-center font-['JetBrains_Mono'] text-[#e2e2e2] text-[10px] font-bold uppercase leading-none"
                            title={sessionUser?.username ?? "guest"}
                        >
                            {getUserInitials(sessionUser)}
                        </div>
                        <div className="min-w-0">
                            <div className="font-['JetBrains_Mono'] text-sm text-[#e2e2e2] truncate">{getUserDisplayName(sessionUser)}</div>
                            <div className="font-['JetBrains_Mono'] text-[10px] text-[#8c9291] truncate">
                                {sessionUser?.username ? `@${sessionUser.username}` : "no_session"} · Active
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-4">
                    <button onClick={() => openModal()} className="w-full bg-[#4ddada] text-[#003737] font-['Anybody'] font-bold tracking-widest text-sm py-3 px-4 flex items-center justify-center gap-2 hover:bg-transparent hover:text-[#4ddada] transition-colors border border-[#4ddada] uppercase rounded-none">
                        <span className="material-symbols-outlined text-[18px]">add</span> Deploy Task
                    </button>
                </div>
                <div className="mt-auto border-t border-[#3f4949] p-4">
                    <button onClick={logout} className="w-full flex items-center justify-center gap-2 text-[#8c9291] px-4 py-2 font-['JetBrains_Mono'] text-sm hover:bg-[#1a1c1c] hover:text-[#ffb4ab] border border-transparent hover:border-[#ffb4ab] transition-colors rounded-none">
                        <span className="material-symbols-outlined text-[18px]">power_settings_new</span> Terminate
                    </button>
                </div>
            </nav>

            {/* Main Drag & Drop Workspace */}
            <main className="ml-0 md:ml-64 flex-1 flex flex-col h-screen overflow-hidden relative z-10 bg-[#0c0f0f]">
                
                {/* Clean Header */}
                <header className="flex justify-between items-center px-8 h-20 w-full bg-[#121414] border-b border-[#3f4949] shrink-0">
                    <div>
                        <h2 className="font-['Anybody'] text-2xl text-[#e2e2e2] uppercase tracking-widest">Execution Board</h2>
                        <p className="font-['JetBrains_Mono'] text-xs text-[#8c9291]">Drag and drop nodes to update system status.</p>
                    </div>
                </header>

                {/* Kanban Columns */}
                <div className="flex-1 flex gap-6 p-8 overflow-x-auto kanban-scroll">
                    {columns.map(col => (
                        <div 
                            key={col}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, col)}
                            className="w-[350px] flex-shrink-0 flex flex-col bg-[#121414] border border-[#3f4949] rounded-none h-full"
                        >
                            <div className="p-4 border-b border-[#3f4949] flex justify-between items-center bg-[#1a1c1c]">
                                <h3 className="font-['JetBrains_Mono'] text-sm text-[#e2e2e2] font-bold uppercase tracking-wider">{col}</h3>
                                <span className="bg-[#3f4949] text-[#e2e2e2] font-['JetBrains_Mono'] text-[10px] px-2 py-1">
                                    {tasks.filter(t => t.status === col).length} NODES
                                </span>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                                {tasks.filter(t => t.status === col).map(task => {
                                    const isHigh = task.priority === "High";
                                    const isDone = task.status === "Completed";
                                    
                                    return (
                                        <div 
                                            key={task._id} 
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, task._id)}
                                            onDragEnd={handleDragEnd}
                                            className={`bg-[#1a1c1c] border ${isHigh && !isDone ? 'border-[#ffb4ab]' : 'border-[#3f4949] hover:border-[#4ddada]'} p-4 cursor-grab active:cursor-grabbing transition-colors group relative rounded-none ${isDone ? 'opacity-50' : ''}`}
                                        >
                                            {/* Priority Tab */}
                                            <div className="flex justify-between items-start mb-3">
                                                <span className={`font-['Space_Mono'] font-bold text-[10px] px-2 py-0.5 border uppercase ${isHigh ? 'border-[#ffb4ab] text-[#ffb4ab]' : task.priority === 'Medium' ? 'border-[#4ddada] text-[#4ddada]' : 'border-[#dac3a9] text-[#dac3a9]'}`}>
                                                    PRTY: {task.priority}
                                                </span>
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                                    <button onClick={() => openModal(task)} className="text-[#8c9291] hover:text-[#4ddada]"><span className="material-symbols-outlined text-[18px]">edit_square</span></button>
                                                    <button onClick={() => handleDelete(task._id)} className="text-[#8c9291] hover:text-[#ffb4ab]"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                                                </div>
                                            </div>

                                            <h4 className={`font-['JetBrains_Mono'] font-bold text-[15px] text-[#e2e2e2] mb-2 ${isDone ? 'line-through text-[#8c9291]' : ''}`}>
                                                {task.title}
                                            </h4>
                                            <p className="text-[13px] text-[#8c9291] font-sans leading-relaxed">
                                                {task.description}
                                            </p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* Brutalist Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-[#0c0f0f]/90 flex justify-center items-center p-4 z-[100]">
                    <div className="bg-[#121414] border border-[#4ddada] p-8 w-full max-w-md flex flex-col gap-6 rounded-none relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-[#4ddada]"></div>
                        <div className="border-b border-[#3f4949] pb-4">
                            <h2 className="text-xl font-['Anybody'] font-bold text-[#e2e2e2] tracking-widest uppercase">
                                {editingTask ? "RECONFIGURE_NODE" : "INITIALIZE_NODE"}
                            </h2>
                        </div>
                        
                        <form onSubmit={editingTask ? handleUpdate : handleCreate} className="flex flex-col gap-5">
                            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="DESIGNATION (Title)" required className="bg-transparent border-b border-[#3f4949] text-[#4ddada] font-['JetBrains_Mono'] p-2 outline-none focus:border-[#4ddada] focus:bg-[#1a1c1c] transition-colors rounded-none"/>
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="MISSION_BRIEF (Description)" required className="bg-transparent border-b border-[#3f4949] text-[#4ddada] font-['JetBrains_Mono'] p-2 outline-none focus:border-[#4ddada] focus:bg-[#1a1c1c] transition-colors h-24 resize-none rounded-none"/>
                            
                            {/* --- AI ACTION BAR (SLM INTEGRATION) --- */}
                            {!editingTask && description.length > 10 && (
                                <div className="flex items-center gap-4 bg-[#1a1c1c] border border-[#3f4949] p-3 rounded-none">
                                    <span className="material-symbols-outlined text-[#dac3a9]">auto_awesome</span>
                                    <div className="flex-1">
                                        <p className="font-['JetBrains_Mono'] text-xs text-[#e2e2e2]">MASSIVE EPIC DETECTED</p>
                                        <p className="font-['JetBrains_Mono'] text-[10px] text-[#8c9291]">Deploy local SLM to auto-fragment this objective?</p>
                                    </div>
                                    <button 
                                        type="button" 
                                        onClick={async () => {
                                            try {
                                                await taskService.breakdown({ mission_brief: description });
                                                closeModal();
                                                refreshTasks(); 
                                            } catch (err) {
                                                console.error(err);
                                                alert("AI Node Offline. Ensure FastAPI is running on Port 8000.");
                                            }
                                        }}
                                        className="border border-[#dac3a9] text-[#dac3a9] hover:bg-[#dac3a9] hover:text-[#121414] font-['JetBrains_Mono'] font-bold text-xs px-3 py-2 transition-colors uppercase rounded-none shrink-0"
                                    >
                                        [AI_DECOMPILE]
                                    </button>
                                </div>
                            )}

                            <div className="flex gap-4">
                                {editingTask && (
                                    <select value={status} onChange={(e) => setStatus(e.target.value)} className="flex-1 bg-transparent border-b border-[#3f4949] text-[#e2e2e2] font-['JetBrains_Mono'] p-2 outline-none focus:border-[#4ddada] focus:bg-[#1a1c1c] [&>option]:bg-[#121414] rounded-none">
                                        <option value="Pending">PENDING</option>
                                        <option value="In Progress">IN PROGRESS</option>
                                        <option value="Completed">COMPLETED</option>
                                    </select>
                                )}
                                <select value={priority} onChange={(e) => setPriority(e.target.value)} className="flex-1 bg-transparent border-b border-[#3f4949] text-[#e2e2e2] font-['JetBrains_Mono'] p-2 outline-none focus:border-[#4ddada] focus:bg-[#1a1c1c] [&>option]:bg-[#121414] rounded-none">
                                    <option value="Low">PRTY: LOW</option>
                                    <option value="Medium">PRTY: MED</option>
                                    <option value="High">PRTY: HIGH</option>
                                </select>
                            </div>

                            <div className="flex gap-4 mt-4">
                                <button type="button" onClick={closeModal} className="flex-1 border border-[#3f4949] text-[#8c9291] font-['JetBrains_Mono'] font-bold p-3 hover:border-[#e2e2e2] hover:text-[#e2e2e2] transition-colors uppercase rounded-none">Abort</button>
                                <button type="submit" className="flex-1 bg-[#4ddada] text-[#003737] font-['JetBrains_Mono'] font-bold p-3 hover:bg-transparent hover:text-[#4ddada] border border-[#4ddada] transition-colors uppercase rounded-none">
                                    {editingTask ? "Execute Update" : "Deploy Task"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}