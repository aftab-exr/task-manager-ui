import { useState, useEffect, useCallback } from "react";
import { taskService } from "../api/taskService";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    
    // New States for Features
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [editingTask, setEditingTask] = useState(null); // Holds the task being edited
    
    const navigate = useNavigate();

    // Dark Mode Toggle Logic
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [isDarkMode]);

    const fetchTasks = useCallback(async () => {
        try {
            const res = await taskService.myTasks();
            setTasks(res.data.data || []);
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
        }
    }, []);

    useEffect(() => { 
        fetchTasks(); 
    }, [fetchTasks]);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await taskService.create({ title, description, status: "Pending", priority: "Medium" });
            setTitle("");
            setDescription("");
            fetchTasks();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await taskService.delete(id);
            fetchTasks();
        } catch (error) {
            console.error(error);
        }
    };

    // --- NEW: Handle Edit Submission ---
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await taskService.update(editingTask._id, {
                title: editingTask.title,
                description: editingTask.description,
                status: editingTask.status,
                priority: editingTask.priority
            });
            setEditingTask(null); // Close Modal
            fetchTasks(); // Refresh List
        } catch (error) {
            console.error("Failed to update task", error);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 font-sans p-6">
            
            {/* Top Navigation Bar */}
            <div className="max-w-5xl mx-auto flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
                <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">TaskFlow Workspace</h1>
                <div className="flex gap-4 items-center">
                    {/* Dark Mode Toggle Button */}
                    <button 
                        onClick={() => setIsDarkMode(!isDarkMode)} 
                        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                    >
                        {isDarkMode ? '☀️ Light' : '🌙 Dark'}
                    </button>
                    <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition font-medium">Logout</button>
                </div>
            </div>

            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* Create Task Form */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 h-fit">
                    <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">New Task</h2>
                    <form onSubmit={handleCreate} className="flex flex-col gap-4">
                        <input 
                            placeholder="Task Title" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            className="border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition"
                            required 
                        />
                        <textarea 
                            placeholder="Description" 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)} 
                            className="border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition h-24 resize-none"
                            required 
                        />
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded-lg transition shadow-md">Add Task</button>
                    </form>
                </div>

                {/* Task List */}
                <div className="md:col-span-2 flex flex-col gap-4">
                    {tasks.map(task => (
                        <div key={task._id} className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex justify-between items-start transition-all hover:shadow-md">
                            <div>
                                <h3 className={`text-lg font-bold ${task.status === 'Completed' ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                                    {task.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mt-1">{task.description}</p>
                                <div className="flex gap-2 mt-3">
                                    <span className="text-xs font-semibold bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                                        {task.priority}
                                    </span>
                                    <span className="text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-2 py-1 rounded">
                                        {task.status}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <button onClick={() => setEditingTask(task)} className="text-sm bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded hover:bg-indigo-200 dark:hover:bg-indigo-800 transition font-medium">Edit</button>
                                <button onClick={() => handleDelete(task._id)} className="text-sm bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-3 py-1.5 rounded hover:bg-red-200 dark:hover:bg-red-800 transition font-medium">Delete</button>
                            </div>
                        </div>
                    ))}
                    {tasks.length === 0 && (
                        <div className="text-center text-gray-500 dark:text-gray-400 py-10">No tasks yet. Create one to get started!</div>
                    )}
                </div>
            </div>

            {/* --- EDIT TASK MODAL OVERLAY --- */}
            {editingTask && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl w-full max-w-md shadow-2xl transform transition-all">
                        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Edit Task</h2>
                        <form onSubmit={handleUpdate} className="flex flex-col gap-4">
                            <input 
                                value={editingTask.title} 
                                onChange={(e) => setEditingTask({...editingTask, title: e.target.value})} 
                                className="border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                                required 
                            />
                            <textarea 
                                value={editingTask.description} 
                                onChange={(e) => setEditingTask({...editingTask, description: e.target.value})} 
                                className="border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
                                required 
                            />
                            <div className="flex gap-4">
                                <select 
                                    value={editingTask.status}
                                    onChange={(e) => setEditingTask({...editingTask, status: e.target.value})}
                                    className="flex-1 border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                                <select 
                                    value={editingTask.priority}
                                    onChange={(e) => setEditingTask({...editingTask, priority: e.target.value})}
                                    className="flex-1 border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>
                            <div className="flex gap-3 mt-4">
                                <button type="button" onClick={() => setEditingTask(null)} className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 p-3 rounded-lg font-bold transition">Cancel</button>
                                <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-lg font-bold transition shadow-md">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
        </div>
    );
}