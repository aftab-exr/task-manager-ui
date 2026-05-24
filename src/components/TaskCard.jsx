export default function TaskCard({ task, onStatusChange, onDelete }) {
    // Dynamic styling based on priority and status
    const priorityColors = {
        Low: "bg-gray-100 text-gray-700",
        Medium: "bg-orange-100 text-orange-700",
        High: "bg-red-100 text-red-700"
    };

    const statusColors = {
        Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
        "In Progress": "bg-blue-100 text-blue-800 border-blue-200",
        Completed: "bg-green-100 text-green-800 border-green-200"
    };

    return (
        <div className={`bg-white p-5 rounded-lg shadow-sm border border-l-4 flex flex-col justify-between transition-shadow hover:shadow-md ${
            task.status === "Completed" ? "border-l-green-500 opacity-75" : "border-l-blue-500"
        }`}>
            <div>
                <div className="flex justify-between items-start mb-3">
                    <h3 className={`font-bold text-lg ${task.status === "Completed" ? "line-through text-gray-500" : "text-gray-900"}`}>
                        {task.title}
                    </h3>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[task.status]}`}>
                        {task.status}
                    </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {task.description}
                </p>
                
                <div className="mb-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded ${priorityColors[task.priority]}`}>
                        Priority: {task.priority}
                    </span>
                </div>
            </div>
            
            <div className="flex gap-2 border-t border-gray-100 pt-4 mt-auto">
                {task.status !== "Completed" && (
                    <button 
                        onClick={() => onStatusChange(task, "Completed")} 
                        className="flex-1 bg-green-50 text-green-700 font-medium px-3 py-1.5 rounded text-sm hover:bg-green-100 transition"
                    >
                        Complete
                    </button>
                )}
                <button 
                    onClick={() => onDelete(task._id)} 
                    className="flex-1 bg-red-50 text-red-700 font-medium px-3 py-1.5 rounded text-sm hover:bg-red-100 transition"
                >
                    Delete
                </button>
            </div>
        </div>
    );
}