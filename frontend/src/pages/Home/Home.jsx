import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import { getUser } from '../../services/api/index';
import { logout } from '../../services/api/authService';

const Home = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [showUserMenu, setShowUserMenu] = useState(false);

    useEffect(() => {
        const userData = getUser();
        setUser(userData);
    }, []);

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-black rounded"></div>
                            <span className="ml-3 text-lg font-semibold text-gray-900">Logo</span>
                        </div>

                        {/* User Menu */}
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                <User size={20} className="text-gray-700" />
                            </button>

                            {/* Dropdown Menu */}
                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                        <p className="text-xs text-gray-500">{user?.email}</p>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                                    >
                                        <LogOut size={16} className="mr-2" />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Welcome Section */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold text-gray-900 mb-4">
                        Welcome to the App
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        A brief, one-to-two-sentence summary of the application's purpose or value proposition to get you started.
                    </p>
                </div>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Dashboard Analytics Card */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Dashboard Analytics
                        </h3>
                        <p className="text-gray-600">
                            A short sentence explaining the benefit of the analytics feature.
                        </p>
                    </div>

                    {/* Project Management Card */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Project Management
                        </h3>
                        <p className="text-gray-600">
                            A short sentence explaining the benefit of the project management feature.
                        </p>
                    </div>

                    {/* Team Collaboration Card */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Team Collaboration
                        </h3>
                        <p className="text-gray-600">
                            A short sentence explaining the benefit of the team collaboration feature.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Home;
