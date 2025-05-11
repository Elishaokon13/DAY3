import React, { useState, useEffect } from 'react';
import { useWeb3 } from '@/hooks/useWeb3';

type CardType = 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown';
type ValidationState = {
  cardNumber: boolean;
  expiryDate: boolean;
  cvv: boolean;
  amount: boolean;
};

type Transaction = {
  id: string;
  amount: string;
  timestamp: string;
  status: 'success' | 'failed';
  cardType: CardType;
};

export const PaymentInterface: React.FC = () => {
  const { isConnected } = useWeb3();
  const [amount, setAmount] = useState<string>('');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [cvv, setCvv] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [cardType, setCardType] = useState<CardType>('unknown');
  const [validation, setValidation] = useState<ValidationState>({
    cardNumber: true,
    expiryDate: true,
    cvv: true,
    amount: true,
  });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load transactions from localStorage on mount
  useEffect(() => {
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
  }, []);

  // Save transactions to localStorage when updated
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Format expiry date
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  // Detect card type
  const detectCardType = (number: string): CardType => {
    const num = number.replace(/\s+/g, '');
    if (/^4[0-9]{12}(?:[0-9]{3})?$/.test(num)) return 'visa';
    if (/^5[1-5][0-9]{14}$/.test(num)) return 'mastercard';
    if (/^3[47][0-9]{13}$/.test(num)) return 'amex';
    if (/^6(?:011|5[0-9]{2})[0-9]{12}$/.test(num)) return 'discover';
    return 'unknown';
  };

  // Validate expiry date
  const isValidExpiryDate = (date: string): boolean => {
    if (!date || date.length !== 5) return false;
    const [month, year] = date.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    const expMonth = parseInt(month);
    const expYear = parseInt(year);
    
    if (expMonth < 1 || expMonth > 12) return false;
    if (expYear < currentYear) return false;
    if (expYear === currentYear && expMonth < currentMonth) return false;
    
    return true;
  };

  // Validate card number
  const isValidCardNumber = (number: string): boolean => {
    const num = number.replace(/\s+/g, '');
    if (num.length < 13 || num.length > 19) return false;
    
    // Luhn algorithm
    let sum = 0;
    let isEven = false;
    
    for (let i = num.length - 1; i >= 0; i--) {
      let digit = parseInt(num.charAt(i));
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0;
  };

  // Handle card number changes
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
    setCardType(detectCardType(formatted));
    setValidation(prev => ({
      ...prev,
      cardNumber: isValidCardNumber(formatted)
    }));
  };

  // Handle expiry date changes
  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    setExpiryDate(formatted);
    setValidation(prev => ({
      ...prev,
      expiryDate: isValidExpiryDate(formatted)
    }));
  };

  // Handle amount changes
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    setValidation(prev => ({
      ...prev,
      amount: parseFloat(value) > 0
    }));
  };

  // Process payment
  const processPayment = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // TODO: Replace with actual payment processing
      const response = await fetch('/api/process-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          cardNumber: cardNumber.replace(/\s+/g, ''),
          expiryDate,
          cvv,
          cardType,
        }),
      });

      if (!response.ok) {
        throw new Error('Payment failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  };

  const handlePayment = async () => {
    if (!amount || !cardNumber || !expiryDate || !cvv) return;
    if (!isValidExpiryDate(expiryDate)) {
      setError('Please enter a valid expiry date');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const result = await processPayment();
      
      // Add transaction to history
      const newTransaction: Transaction = {
        id: result.transactionId,
        amount,
        timestamp: result.timestamp,
        status: 'success',
        cardType,
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      setSuccess(`Successfully purchased ${amount} ETH!`);
      
      // Clear form
      setAmount('');
      setCardNumber('');
      setExpiryDate('');
      setCvv('');
      setCardType('unknown');
      
    } catch (error) {
      setError('Payment failed. Please try again.');
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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Buy ETH with Card</h2>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-blue-600 hover:text-blue-700"
          >
            {showHistory ? 'Hide History' : 'Show History'}
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-600">{success}</p>
          </div>
        )}
        
        {showHistory && transactions.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Transaction History</h3>
            <div className="space-y-2">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="p-3 bg-gray-50 rounded-lg flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={`/card-icons/${tx.cardType}.svg`}
                      alt={tx.cardType}
                      className="h-6 w-auto"
                    />
                    <div>
                      <p className="font-medium">{tx.amount} ETH</p>
                      <p className="text-sm text-gray-500">
                        {new Date(tx.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      tx.status === 'success'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {tx.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (ETH)
            </label>
            <input
              type="number"
              value={amount}
              onChange={handleAmountChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                !validation.amount ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter amount"
              min="0"
              step="0.01"
            />
            {!validation.amount && (
              <p className="mt-1 text-sm text-red-600">Please enter a valid amount</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Card Number
            </label>
            <div className="relative">
              <input
                type="text"
                value={cardNumber}
                onChange={handleCardNumberChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  !validation.cardNumber ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
              {cardType !== 'unknown' && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <img
                    src={`/card-icons/${cardType}.svg`}
                    alt={cardType}
                    className="h-6 w-auto"
                  />
                </div>
              )}
            </div>
            {!validation.cardNumber && (
              <p className="mt-1 text-sm text-red-600">Please enter a valid card number</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date
              </label>
              <input
                type="text"
                value={expiryDate}
                onChange={handleExpiryDateChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  !validation.expiryDate ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="MM/YY"
                maxLength={5}
              />
              {!validation.expiryDate && (
                <p className="mt-1 text-sm text-red-600">Please enter a valid expiry date</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CVV
              </label>
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, '').slice(0, 3))}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  !validation.cvv ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="123"
                maxLength={3}
              />
              {!validation.cvv && (
                <p className="mt-1 text-sm text-red-600">Please enter a valid CVV</p>
              )}
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={loading || !amount || !cardNumber || !expiryDate || !cvv}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed relative"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </div>
            ) : (
              'Buy ETH'
            )}
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