import React from 'react';

const AuthLayout = ({ children, title }) => {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    {title && (
                        <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">
                            {title}
                        </h1>
                    )}
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
