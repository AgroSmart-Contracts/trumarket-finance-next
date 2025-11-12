'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { JsonRpcSigner, ethers } from 'ethers';

import { BlockchainClient } from '@/lib/BlockchainClient';
import { Wallet } from '@/types/wallet';

const DISCONNECT_FLAG_KEY = 'tm_wallet_disconnected';

const getProvider = () => {
    if (typeof window === 'undefined' || !window.ethereum) return undefined;
    return new ethers.BrowserProvider(window.ethereum);
};

const useWallet = () => {

    const [wallet, setWallet] = useState<Wallet | undefined>();
    const [connectedAddress, setConnectedAddress] = useState<string | undefined>();
    const [signer, setSigner] = useState<JsonRpcSigner | undefined>();
    const [network, setNetwork] = useState<string | undefined>();

    const [isDisconnected, setIsDisconnected] = useState<boolean>(() => {
        if (typeof window === 'undefined') return false;
        try {
            return localStorage.getItem(DISCONNECT_FLAG_KEY) === 'true';
        } catch {
            return false;
        }
    });

    const provider = useMemo(() => getProvider(), []);

    const setDisconnectedFlag = useCallback((value: boolean) => {
        setIsDisconnected(value);
        if (typeof window !== 'undefined') {
            try {
                if (value) {
                    localStorage.setItem(DISCONNECT_FLAG_KEY, 'true');
                } else {
                    localStorage.removeItem(DISCONNECT_FLAG_KEY);
                }
            } catch {
                // ignore storage errors
            }
        }
    }, []);

    const ensureNetwork = useCallback(async () => {
        if (typeof window === 'undefined' || !window.ethereum) return;

        const chainId = process.env.NEXT_PUBLIC_EVM_CHAIN_ID || '0x2105'; // Default to Base mainnet
        if (!chainId) return;

        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId }],
            });
        } catch (switchError: any) {
            if (switchError?.code === 4902) {
                console.error('Chain not added to MetaMask');
            } else {
                console.error('Failed to switch network:', switchError);
            }
        }
    }, []);

    const getNetwork = useCallback(async () => {
        if (!provider) return;
        try {
            const net = await provider.getNetwork();
            setNetwork(`0x${net.chainId.toString(16)}`);
        } catch (error) {
            console.error('Error getting network', error);
        }
    }, [provider]);

    const refreshBalances = useCallback(
        async () => {
            if (!provider || !connectedAddress) return;

            const investmentTokenAddress = process.env.NEXT_PUBLIC_INVESTMENT_TOKEN_CONTRACT_ADDRESS;
            if (!investmentTokenAddress) {
                console.warn('Investment token address not configured');
                return;
            }

            try {
                const balance = await provider.getBalance(connectedAddress);
                const etherBalance = ethers.formatEther(balance);

                setWallet(prev => ({
                    label: 'Connected Wallet',
                    address: connectedAddress,
                    balance: +etherBalance.toString(),
                    balanceUnderlying: prev?.balanceUnderlying ?? 0,
                }));

                try {
                    const tokenBalance = await new BlockchainClient(
                        investmentTokenAddress
                    ).getBalance(connectedAddress);

                    setWallet(prev =>
                        prev
                            ? {
                                ...prev,
                                balanceUnderlying: tokenBalance,
                            }
                            : prev
                    );
                } catch (error) {
                    console.error('Error fetching token balance', error);
                }
            } catch (error) {
                console.error('Error refreshing balances', error);
            }
        },
        [provider, connectedAddress]
    );

    const connectMetaMask = useCallback(async () => {
        if (typeof window === 'undefined' || !window.ethereum || !provider) {
            console.log('MetaMask not detected!');
            return;
        }

        try {
            // Explicit user intent to connect
            setDisconnectedFlag(false);

            await ensureNetwork();

            await window.ethereum.request({
                method: 'eth_requestAccounts',
            });

            const newSigner = await provider.getSigner();
            const addr = await newSigner.getAddress();

            setConnectedAddress(addr);
            setSigner(newSigner);
            setWallet({
                label: 'Connected Wallet',
                address: addr,
                balance: 0,
                balanceUnderlying: 0,
            });

            await getNetwork();
            await refreshBalances();
        } catch (err) {
            console.warn(`did not connect: ${err}`);
        }
    }, [provider, ensureNetwork, getNetwork, refreshBalances, setDisconnectedFlag]);

    const disconnect = useCallback(async () => {
        // Try to revoke permissions (MetaMask-specific; ignore if unsupported)
        if (typeof window !== 'undefined' && window.ethereum) {
            try {
                await window.ethereum.request({
                    method: 'wallet_revokePermissions',
                    params: [{ eth_accounts: {} }],
                });
            } catch (err) {
                console.warn('Failed to revoke MetaMask permissions', err);
            }
        }

        setConnectedAddress(undefined);
        setSigner(undefined);
        setWallet(undefined);
        setNetwork(undefined);

        setDisconnectedFlag(true);
    }, [setDisconnectedFlag]);

    // Refresh balances when address changes
    useEffect(() => {
        if (connectedAddress) {
            refreshBalances();
        }
    }, [connectedAddress, refreshBalances]);

    // Refresh when config becomes available (if already connected)
    useEffect(() => {
        if (connectedAddress) {
            refreshBalances();
        }
    }, [connectedAddress, refreshBalances]);

    // Auto-connect on load if:
    // - Not explicitly disconnected
    // - Wallet is available
    useEffect(() => {
        if (
            isDisconnected ||
            typeof window === 'undefined' ||
            !window.ethereum ||
            !provider
        ) {
            return;
        }

        (async () => {
            try {
                const accounts: string[] = await window.ethereum?.request({
                    method: 'eth_accounts',
                });

                if (accounts && accounts.length) {
                    const newSigner = await provider.getSigner();
                    const addr = await newSigner.getAddress();

                    setConnectedAddress(addr);
                    setSigner(newSigner);
                    setWallet({
                        label: 'Connected Wallet',
                        address: addr,
                        balance: 0,
                        balanceUnderlying: 0,
                    });

                    await getNetwork();
                    await ensureNetwork();
                    await refreshBalances();
                }
            } catch (error) {
                console.error('Error checking connected accounts', error);
            }
        })();
    }, [
        isDisconnected,
        provider,
        ensureNetwork,
        getNetwork,
        refreshBalances,
    ]);

    // Event listeners: chain & account changes
    useEffect(() => {
        if (
            typeof window === 'undefined' ||
            !window.ethereum ||
            !provider
        ) {
            return;
        }

        const { ethereum } = window;

        const handleChainChanged = (chainId: string) => {
            setNetwork(chainId);
        };

        const handleAccountsChanged = async (accounts: string[]) => {
            // If user disconnected from MetaMask UI
            if (!accounts || accounts.length === 0) {
                setConnectedAddress(undefined);
                setSigner(undefined);
                setWallet(undefined);
                setDisconnectedFlag(true);
                return;
            }

            try {
                const newSigner = await provider.getSigner();
                const addr = await newSigner.getAddress();

                setConnectedAddress(addr);
                setSigner(newSigner);
                setWallet({
                    label: 'Connected Wallet',
                    address: addr,
                    balance: 0,
                    balanceUnderlying: 0,
                });
                setDisconnectedFlag(false);

                await refreshBalances();
            } catch (error) {
                console.error('Error handling accountsChanged', error);
            }
        };

        ethereum.on('chainChanged', handleChainChanged);
        ethereum.on('accountsChanged', handleAccountsChanged);

        return () => {
            ethereum.removeListener('chainChanged', handleChainChanged);
            ethereum.removeListener('accountsChanged', handleAccountsChanged);
        };
    }, [provider, refreshBalances, setDisconnectedFlag]);

    // Always return a consistent shape
    if (!provider) {
        return {
            wallet,
            signer,
            connectMetaMask: async () => {
                console.log('MetaMask not detected!');
            },
            disconnect: async () => { },
            refreshBalances: async () => { },
            network,
            ensureNetwork: async () => { },
            error: 'MetaMask not detected!',
        };
    }

    return {
        wallet,
        signer,
        connectMetaMask,
        disconnect,
        refreshBalances,
        network,
        ensureNetwork,
    };
};

export default useWallet;

