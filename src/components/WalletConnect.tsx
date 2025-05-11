import React from 'react';
import { useWeb3 } from '@/hooks/useWeb3';
import { formatAddress } from '@/utils/web3';

export const WalletConnect: React.FC = () => {
  const { account, loading, error, connect, disconnect, isConnected } = useWeb3();

  return (
    <div className="flex flex-col space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <div className="flex items-center space-x-4">
        {!isConnected ? (
          <button
            onClick={connect}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Connecting...' : 'Connect Wallet'}
          </button>
        ) : (
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">
              {account ? formatAddress(account) : 'Connected'}
            </span>
            <button
              onClick={disconnect}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>
    </div>
  );
}; 