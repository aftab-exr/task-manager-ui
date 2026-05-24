import { Link } from "react-router-dom";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            {/* Navigation Bar */}
            <nav className="flex justify-between items-center p-6 max-w-7xl w-full mx-auto">
                <div className="text-2xl font-extrabold text-blue-600 tracking-tight">TaskFlow</div>
                <div className="flex gap-4">
                    <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium transition flex items-center">Log In</Link>
                    <Link to="/register" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition shadow-sm">Get Started</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="flex-grow flex flex-col items-center justify-center text-center px-4 py-20">
                <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight max-w-4xl leading-tight">
                    Master Your Workflow. <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Conquer Your Goals.</span>
                </h1>
                <p className="text-xl text-gray-600 mb-10 max-w-2xl leading-relaxed">
                    A secure, high-performance workspace designed to help you organize technical sprints, track academic milestones, and collaborate flawlessly.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto">
                    <Link to="/register" className="bg-blue-600 text-white font-semibold text-lg px-8 py-4 rounded-xl shadow-lg hover:bg-blue-700 hover:shadow-xl transition transform hover:-translate-y-1">
                        Start for Free
                    </Link>
                    <Link to="/login" className="bg-white text-gray-800 font-semibold text-lg px-8 py-4 rounded-xl shadow border border-gray-200 hover:bg-gray-50 transition">
                        Access Workspace
                    </Link>
                </div>
            </main>

            {/* Elaborated Use Cases Section */}
            <section className="bg-white py-24 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Built for Every Challenge</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">Whether you are pushing code, studying for finals, or managing a team, our platform adapts to your specific workflow.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {/* Use Case 1: Engineering & Hackathons */}
                        <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-md transition duration-300">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Hackathon & Team Sync</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Coordinate backend APIs and frontend features seamlessly. Keep your entire engineering squad aligned during high-stakes development sprints.
                            </p>
                        </div>

                        {/* Use Case 2: Academic Projects */}
                        <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-md transition duration-300">
                            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477-4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Academic Milestones</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Break down massive final-year architecture projects into manageable daily tasks. Track research, viva prep, and core deployments.
                            </p>
                        </div>

                        {/* Use Case 3: Daily Habits */}
                        <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-md transition duration-300">
                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Daily Productivity</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Clear your mind by offloading your to-do list. Prioritize effectively with low, medium, and high-impact tags to master your routine.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}