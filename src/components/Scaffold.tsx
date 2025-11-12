'use client';

import { useState } from 'react';
import useWallet from '@/hooks/useWallet';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { ChevronDown, Wallet, LogOut } from 'lucide-react';

const truncateAddress = (address: string) => {
    if (!address) return '';
    // Show first 4 and last 4 characters with dots in the middle
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

const WalletInfoDisplay: React.FC<{ wallet: any }> = ({ wallet }) => (
    <div className="flex flex-col space-y-3">
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
            <Wallet className="w-4 h-4 text-[#3CA638] flex-shrink-0" />
            <p className="text-xs text-gray-700 font-mono break-all">{wallet.address}</p>
        </div>
        {wallet.balanceUnderlying !== undefined && (
            <div className="flex items-center justify-between p-3 bg-[#3CA63810] rounded-md border border-[#3CA63820]">
                <span className="text-xs font-medium text-gray-600">Balance</span>
                <span className="text-sm font-bold text-[#3CA638]">
                    {wallet.balanceUnderlying.toFixed(2)} USDC
                </span>
            </div>
        )}
    </div>
);

const Header: React.FC = () => {
    const { wallet, connectMetaMask, disconnect } = useWallet();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleDisconnect = () => {
        // Clear wallet state
        if (disconnect) {
            disconnect();
        }
        // Close dialog if open
        setIsDialogOpen(false);
    };

    return (
        <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b-2 border-[#3CA638]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 sm:gap-4">
                        <a href="/" className="flex-shrink-0">
                            <img
                                src="/logo.svg"
                                alt="Trumarket Logo"
                                className="h-8 sm:h-10 lg:h-12 w-auto cursor-pointer"
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            />
                        </a>
                        <div className="hidden sm:block border-l-2 border-gray-300 pl-3 sm:pl-4">
                            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#2D3E57] tracking-tight">
                                AgroTrade Finance
                            </h1>
                            <div className="flex gap-2 sm:gap-4 mt-0.5 sm:mt-1">
                                <a href="/" className="text-xs sm:text-sm font-medium text-[#3CA638] hover:text-[#2D8828] transition-colors">
                                    Deals
                                </a>
                            </div>
                        </div>
                        {/* Mobile: Show title without border */}
                        <div className="sm:hidden">
                            <h1 className="text-base font-bold text-[#2D3E57] tracking-tight">
                                AgroTrade Finance
                            </h1>
                            <a href="/" className="text-xs font-medium text-[#3CA638] hover:text-[#2D8828] transition-colors">
                                Deals
                            </a>
                        </div>
                    </div>
                    <div className="flex items-center">
                        {wallet ? (
                            <>
                                {/* Desktop: Dropdown Menu */}
                                <div className="hidden md:block">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="flex items-center gap-2 border-[#3CA638] text-[#3CA638] hover:bg-[#3CA638] hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
                                            >
                                                <Wallet className="w-4 h-4" />
                                                <span className="font-medium">{truncateAddress(wallet.address)}</span>
                                                <ChevronDown className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-72 rounded-lg shadow-lg border border-gray-200">
                                            <DropdownMenuLabel className="px-4 py-3">
                                                <p className="text-sm font-semibold text-gray-900 mb-3">Connected Wallet</p>
                                                <WalletInfoDisplay wallet={wallet} />
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={handleDisconnect}
                                                className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer px-4 py-2.5 mx-1 my-1 rounded-md"
                                            >
                                                <LogOut className="w-4 h-4 mr-2" />
                                                <span className="font-medium">Disconnect</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                {/* Mobile: Dialog */}
                                <div className="md:hidden">
                                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                        <Button
                                            variant="outline"
                                            onClick={() => setIsDialogOpen(true)}
                                            className="flex items-center gap-2 border-[#3CA638] text-[#3CA638] hover:bg-[#3CA638] hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
                                        >
                                            <Wallet className="w-4 h-4" />
                                            <span className="font-medium">{truncateAddress(wallet.address)}</span>
                                            <ChevronDown className="w-4 h-4" />
                                        </Button>
                                        <DialogContent className="sm:max-w-[400px] bg-white rounded-xl">
                                            <DialogHeader>
                                                <DialogTitle className="text-xl font-bold text-gray-900">Connected Wallet</DialogTitle>
                                            </DialogHeader>
                                            <div>
                                                <WalletInfoDisplay wallet={wallet} />
                                                <div className="border-t border-gray-200 pt-4 mt-4">
                                                    <Button
                                                        onClick={handleDisconnect}
                                                        variant="outline"
                                                        className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 flex items-center justify-center gap-2"
                                                    >
                                                        <LogOut className="w-4 h-4" />
                                                        <span className="font-medium">Disconnect</span>
                                                    </Button>
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </>
                        ) : (
                            <Button
                                onClick={connectMetaMask}
                                className="bg-[#3CA638] hover:bg-[#2D8828] text-white flex items-center gap-2 shadow-sm hover:shadow-md transition-all duration-200"
                            >
                                <Wallet className="w-4 h-4" />
                                <span className="hidden sm:inline font-medium">Connect Wallet</span>
                                <span className="sm:hidden font-medium">Connect</span>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

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
            <main className="flex-grow pt-16 sm:pt-20">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Scaffold;
