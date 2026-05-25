import { useState, useEffect, useCallback } from "react";
import { taskService } from "../api/taskService";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [draggedTaskId, setDraggedTaskId] = useState(null);
    
    const navigate = useNavigate();

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

    useEffect(() => { fetchTasks(); }, [fetchTasks]);

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

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await taskService.update(editingTask._id, {
                title: editingTask.title,
                description: editingTask.description,
                status: editingTask.status,
                priority: editingTask.priority
            });
            setEditingTask(null);
            fetchTasks();
        } catch (error) {
            console.error("Failed to update task", error);
        }
    };

    // --- NEW: DRAG AND DROP LOGIC ---
    const handleDragStart = (e, taskId) => {
        setDraggedTaskId(taskId);
        // Makes the drag image slightly transparent
        setTimeout(() => e.target.classList.add('opacity-50'), 0);
    };

    const handleDragEnd = (e) => {
        e.target.classList.remove('opacity-50');
        setDraggedTaskId(null);
    };

    const handleDragOver = (e) => {
        e.preventDefault(); // Crucial: allows the drop event to fire
    };

    const handleDrop = async (e, newStatus) => {
        e.preventDefault();
        if (!draggedTaskId) return;

        const taskToUpdate = tasks.find(t => t._id === draggedTaskId);
        if (taskToUpdate.status === newStatus) return;

        // 1. Optimistic UI Update (Instant feedback for the user)
        setTasks(prevTasks => prevTasks.map(task => 
            task._id === draggedTaskId ? { ...task, status: newStatus } : task
        ));

        // 2. Background Database Update
        try {
            await taskService.updateTask(draggedTaskId, {
                ...taskToUpdate,
                status: newStatus
            });
        } catch (error) {
            console.error("Failed to update status", error);
            fetchTasks(); // Revert UI if database fails
        }
        
        setDraggedTaskId(null);
    };

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const columns = ["Pending", "In Progress", "Completed"];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 font-sans p-6 pb-20">
            
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8 gap-4">
                <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">TaskFlow Workspace</h1>
                <div className="flex gap-4 items-center">
                    <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition font-medium">
                        {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
                    </button>
                    <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition font-medium">Logout</button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
                
                {/* Left Sidebar: Create Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 sticky top-6">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">New Task</h2>
                        <form onSubmit={handleCreate} className="flex flex-col gap-4">
                            <input placeholder="Task Title" value={title} onChange={(e) => setTitle(e.target.value)} className="border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition" required />
                            <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition h-24 resize-none" required />
                            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded-lg transition shadow-md">Add Task</button>
                        </form>
                    </div>
                </div>

                {/* Right Area: Kanban Board */}
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {columns.map(columnStatus => (
                        <div 
                            key={columnStatus}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, columnStatus)}
                            className="bg-gray-100 dark:bg-gray-800/50 rounded-xl p-4 min-h-[500px] border border-dashed border-gray-300 dark:border-gray-700 flex flex-col gap-4 transition-colors hover:bg-gray-200/50 dark:hover:bg-gray-800"
                        >
                            <h3 className="font-bold text-gray-700 dark:text-gray-300 flex justify-between items-center">
                                {columnStatus} 
                                <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 py-0.5 px-2 rounded-full text-sm">
                                    {tasks.filter(t => t.status === columnStatus).length}
                                </span>
                            </h3>

                            {tasks.filter(t => t.status === columnStatus).map(task => (
                                <div 
                                    key={task._id} 
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, task._id)}
                                    onDragEnd={handleDragEnd}
                                    className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow group"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className={`font-bold ${task.status === 'Completed' ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                                            {task.title}
                                        </h4>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => setEditingTask(task)} className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300" title="Edit">✏️</button>
                                            <button onClick={() => handleDelete(task._id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300" title="Delete">🗑️</button>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{task.description}</p>
                                    <span className={`text-xs font-semibold px-2 py-1 rounded ${
                                        task.priority === 'High' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' : 
                                        task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' : 
                                        'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                    }`}>
                                        {task.priority}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* EDIT TASK MODAL (Unchanged from previous update) */}
            {editingTask && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl w-full max-w-md shadow-2xl transform transition-all">
                        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Edit Task</h2>
                        <form onSubmit={handleUpdate} className="flex flex-col gap-4">
                            <input value={editingTask.title} onChange={(e) => setEditingTask({...editingTask, title: e.target.value})} className="border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" required />
                            <textarea value={editingTask.description} onChange={(e) => setEditingTask({...editingTask, description: e.target.value})} className="border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none" required />
                            <div className="flex gap-4">
                                <select value={editingTask.status} onChange={(e) => setEditingTask({...editingTask, status: e.target.value})} className="flex-1 border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500">
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                                <select value={editingTask.priority} onChange={(e) => setEditingTask({...editingTask, priority: e.target.value})} className="flex-1 border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500">
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