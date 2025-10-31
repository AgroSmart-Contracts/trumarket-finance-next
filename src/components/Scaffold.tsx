'use client';

import React from 'react';

const Header: React.FC = () => (
    <header className="bg-gradient-to-r from-white to-gray-50 shadow-md border-b-2 border-[#3CA638] sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <a href="/">
                        <img
                            src="/logo.svg"
                            alt="Trumarket Logo"
                            className="h-12 w-auto cursor-pointer"
                        />
                    </a>
                    <div className="border-l-2 border-gray-300 pl-4">
                        <h1 className="text-2xl font-bold text-[#2D3E57] tracking-tight">
                            Investment Dashboard
                        </h1>
                        <p className="text-sm text-[#6B7280] mt-0.5">
                            Deal-by-Deal Insights & Analytics
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-[#3CA63815] px-4 py-2 rounded-lg border border-[#3CA638]">
                    <div className="w-2 h-2 bg-[#3CA638] rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-[#2D8828]">Live</span>
                </div>
            </div>
        </div>
    </header>
);

const Footer: React.FC = () => (
    <footer className="bg-gray-50 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="flex items-center space-x-4">
                    <img src="/logo.svg" alt="Trumarket Logo" className="h-6" />
                    <span className="text-sm text-gray-600">©️ 2024 Trumarket</span>
                </div>
                <nav>
                    <ul className="flex space-x-6">
                        <li>
                            <a
                                target="_blank"
                                href="https://trumarket.tech/privacy-policy"
                                className="text-sm text-gray-600 hover:text-primary transition-colors"
                            >
                                Privacy Policy
                            </a>
                        </li>
                        <li>
                            <a
                                target="_blank"
                                href="https://trumarket.tech/terms-and-conditions"
                                className="text-sm text-gray-600 hover:text-primary transition-colors"
                            >
                                Terms of Service
                            </a>
                        </li>
                        <li>
                            <a
                                target="_blank"
                                href="https://trumarket.tech/contactus"
                                className="text-sm text-gray-600 hover:text-primary transition-colors"
                            >
                                Contact Us
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    </footer>
);

// Preview component
const Scaffold: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Scaffold;
