import { Link } from "react-router-dom";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
            <div className="max-w-2xl text-center">
                <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
                    Master Your Day with <span className="text-blue-600">Task Manager</span>
                </h1>
                <p className="text-xl text-gray-600 mb-10">
                    A beautiful, secure, RESTful application to track your tasks, prioritize your workflow, and get things done.
                </p>
                
                <div className="flex justify-center gap-4">
                    <Link 
                        to="/register" 
                        className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
                    >
                        Sign Up for Free
                    </Link>
                    <Link 
                        to="/login" 
                        className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 transition"
                    >
                        Log In
                    </Link>
                </div>
            </div>
        </div>
    );
}