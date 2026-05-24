import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { taskService } from "../api/taskService.js";
import TaskCard from "../components/TaskCard.jsx";

export default function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({ title: "", description: "", priority: "Low", status: "Pending" });
    const navigate = useNavigate();

    const fetchTasks = async () => {
        try {
            const res = await taskService.getMyTasks();
            setTasks(res.data || []);
        } catch (error) {
            console.error("Failed to fetch tasks:",error);
        }
    };

    useEffect(() => { fetchTasks(); }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await taskService.createTask(newTask);
            setNewTask({ title: "", description: "", priority: "Low", status: "Pending" }); 
            fetchTasks(); 
        } catch (err) {
            alert(err);
        }
    };

    const handleStatusUpdate = async (task, newStatus) => {
        try {
            await taskService.updateTask(task._id, { ...task, status: newStatus });
            fetchTasks();
        } catch (err) { alert(err); }
    };

    const handleDelete = async (id) => {
        try {
            await taskService.deleteTask(id);
            fetchTasks();
        } catch (err) { alert(err); }
    };

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">My Tasks</h1>
                    <button onClick={logout} className="bg-gray-200 text-gray-700 font-medium px-4 py-2 rounded hover:bg-gray-300 transition">
                        Logout
                    </button>
                </div>

                {/* Create Task Form */}
                <form onSubmit={handleCreate} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8 flex flex-col md:flex-row gap-4">
                    <input required type="text" placeholder="Task Title" className="border border-gray-300 p-2.5 rounded focus:outline-blue-500 flex-1"
                        value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} />
                    
                    <input required type="text" placeholder="Description" className="border border-gray-300 p-2.5 rounded focus:outline-blue-500 flex-2"
                        value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} />
                    
                    <select className="border border-gray-300 p-2.5 rounded focus:outline-blue-500 bg-white" value={newTask.priority} 
                        onChange={e => setNewTask({...newTask, priority: e.target.value})}>
                        <option value="Low">Low Priority</option>
                        <option value="Medium">Medium Priority</option>
                        <option value="High">High Priority</option>
                    </select>
                    
                    <button type="submit" className="bg-blue-600 text-white font-medium px-6 py-2.5 rounded hover:bg-blue-700 transition">
                        Add Task
                    </button>
                </form>

                {/* Modular Task Grid */}
                {tasks.length === 0 ? (
                    <div className="text-center p-12 bg-white rounded-lg border border-gray-200">
                        <p className="text-gray-500">No tasks found. Create one above!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tasks.map(task => (
                            <TaskCard 
                                key={task._id} 
                                task={task} 
                                onStatusChange={handleStatusUpdate} 
                                onDelete={handleDelete} 
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}