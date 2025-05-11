import { ethers } from 'ethers';
import { InjectedConnector } from '@web3-react/injected-connector';

// Supported chains
export const supportedChains = [1]; // Ethereum Mainnet

// Initialize the injected connector
export const injected = new InjectedConnector({
  supportedChainIds: supportedChains,
});

// Get provider
export const getProvider = () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    return new ethers.providers.Web3Provider(window.ethereum);
  }
  return null;
};

// Get signer
export const getSigner = () => {
  const provider = getProvider();
  if (provider) {
    return provider.getSigner();
  }
  return null;
};

// Get account
export const getAccount = async () => {
  const provider = getProvider();
  if (provider) {
    const accounts = await provider.listAccounts();
    return accounts[0];
  }
  return null;
};

// Get network
export const getNetwork = async () => {
  const provider = getProvider();
  if (provider) {
    return await provider.getNetwork();
  }
  return null;
};

// Format address
export const formatAddress = (address: string) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}; 