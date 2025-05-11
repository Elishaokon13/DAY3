import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { injected } from '@/utils/web3';
import { getAccount, getNetwork } from '@/utils/web3';

export const useWeb3 = () => {
  const { activate, deactivate, active, account: web3Account, chainId } = useWeb3React();
  const [account, setAccount] = useState<string | null>(null);
  const [network, setNetwork] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const currentAccount = await getAccount();
        const currentNetwork = await getNetwork();
        
        setAccount(currentAccount);
        setNetwork(currentNetwork?.chainId || null);
      } catch (error) {
        console.error('Failed to initialize Web3:', error);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const connect = async () => {
    try {
      setLoading(true);
      await activate(injected);
      const currentAccount = await getAccount();
      const currentNetwork = await getNetwork();
      
      setAccount(currentAccount);
      setNetwork(currentNetwork?.chainId || null);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const disconnect = () => {
    try {
      deactivate();
      setAccount(null);
      setNetwork(null);
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  return {
    account,
    network,
    loading,
    connect,
    disconnect,
    isConnected: active,
  };
}; 