import React from 'react';
import { Link } from 'react-router-dom';

export const AccessDenied = () => {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
                <p className="text-gray-600 mb-6">
                    You don't have permission to access this page.
                </p>
                <Link
                    to="/"
                    className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark"
                >
                    Return to Home
                </Link>
            </div>
        </div>
    );
};
