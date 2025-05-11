'use client';

import { WalletConnect } from '@/components/WalletConnect';
import { PaymentInterface } from '@/components/PaymentInterface';
import { Web3Provider } from '@/components/Web3Provider';

export default function Home() {
  return (
    <Web3Provider>
      <main className="min-h-screen p-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">ETH Buying AI Agent</h1>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <WalletConnect />
            </div>
            
            <PaymentInterface />
          </div>
        </div>
      </main>
    </Web3Provider>
  );
}
