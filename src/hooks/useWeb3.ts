import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { injected } from '@/utils/web3';
import { getAccount, getNetwork } from '@/utils/web3';

export const useWeb3 = () => {
  const { activate, deactivate, active, account: web3Account, chainId, library } = useWeb3React();
  const [account, setAccount] = useState<string | null>(null);
  const [network, setNetwork] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        if (typeof window !== 'undefined' && window.ethereum) {
          const currentAccount = await getAccount();
          const currentNetwork = await getNetwork();
          
          setAccount(currentAccount);
          setNetwork(currentNetwork?.chainId || null);
        }
      } catch (error) {
        console.error('Failed to initialize Web3:', error);
        setError('Failed to initialize Web3');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const connect = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!window.ethereum) {
        throw new Error('Please install MetaMask to use this feature');
      }

      await activate(injected, undefined, true);
      const currentAccount = await getAccount();
      const currentNetwork = await getNetwork();
      
      setAccount(currentAccount);
      setNetwork(currentNetwork?.chainId || null);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setError(error instanceof Error ? error.message : 'Failed to connect wallet');
    } finally {
      setLoading(false);
    }
  };

  const disconnect = () => {
    try {
      deactivate();
      setAccount(null);
      setNetwork(null);
      setError(null);
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      setError('Failed to disconnect wallet');
    }
  };

  return {
    account,
    network,
    loading,
    error,
    connect,
    disconnect,
    isConnected: active,
    library,
  };
}; 