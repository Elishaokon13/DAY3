import React, { useState } from 'react';
import { useWeb3 } from '@/hooks/useWeb3';

export const PaymentInterface: React.FC = () => {
  const { isConnected } = useWeb3();
  const [amount, setAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'opay' | 'card' | 'bank'>('opay');
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!amount) return;
    
    setLoading(true);
    try {
      // TODO: Implement payment processing
      console.log(`Processing ${amount} ETH payment via ${paymentMethod}`);
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center p-6 bg-gray-50 rounded-lg">
        <p className="text-gray-600">Please connect your wallet to continue</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Buy ETH</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (ETH)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter amount"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="opay">Opay</option>
              <option value="card">Credit/Debit Card</option>
              <option value="bank">Bank Transfer</option>
            </select>
          </div>

          <button
            onClick={handlePayment}
            disabled={loading || !amount}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Buy ETH'}
          </button>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-blue-800 mb-2">Why Buy ETH?</h3>
        <ul className="list-disc list-inside space-y-1 text-blue-700">
          <li>Store value in a digital asset</li>
          <li>Access decentralized applications</li>
          <li>Participate in the future of finance</li>
        </ul>
      </div>
    </div>
  );
}; 