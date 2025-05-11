'use client';

import { Web3ReactProvider } from '@web3-react/core';
import { ethers } from 'ethers';
import { WalletConnect } from '@/components/WalletConnect';

function getLibrary(provider: any) {
  return new ethers.providers.Web3Provider(provider);
}

export default function Home() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <main className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">ETH Buying AI Agent</h1>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <WalletConnect />
          </div>
        </div>
      </main>
    </Web3ReactProvider>
  );
}
