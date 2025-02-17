import React, { useState, useEffect } from 'react';
import { DollarSign, Clock, CheckCircle, Wallet, Loader2 } from 'lucide-react';
import { ethers } from 'ethers';
import { connectWallet, requestFunds, getContract } from '../utils/ethereum';
import { toast } from 'react-hot-toast';

interface FundRequest {
  recipient: string;
  amount: ethers.BigNumber;
  purpose: string;
  approved: boolean;
  timestamp: ethers.BigNumber;
}

function RecipientDashboard() {
  const [wallet, setWallet] = useState<{
    provider: ethers.providers.Web3Provider;
    signer: ethers.Signer;
    address: string;
  } | null>(null);
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [requests, setRequests] = useState<FundRequest[]>([]);

  const handleConnect = async () => {
    const walletData = await connectWallet();
    if (walletData) {
      setWallet(walletData);
      loadFundRequests(walletData);
    }
  };

  const loadFundRequests = async (walletData: { provider: ethers.providers.Web3Provider; signer: ethers.Signer; address: string }) => {
    try {
      const contract = getContract(walletData.provider);
      const history = await contract.getFundRequests(walletData.address);
      setRequests(history);
    } catch (error) {
      console.error('Error loading fund requests:', error);
      toast.error('Failed to load fund requests');
    }
  };

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet) {
      toast.error('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    try {
      const success = await requestFunds(wallet.signer, amount, purpose);
      if (success) {
        setAmount('');
        setPurpose('');
        loadFundRequests(wallet);
        toast.success('Fund request submitted successfully!');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Recipient Dashboard</h2>
          <p className="text-gray-600 mt-1">Request and manage disaster relief funds</p>
        </div>
        {!wallet ? (
          <button
            onClick={handleConnect}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            <Wallet className="w-4 h-4" />
            Connect Wallet
          </button>
        ) : (
          <div className="text-sm bg-gray-100 px-4 py-2 rounded-md">
            <span className="text-gray-500">Connected:</span>{' '}
            <span className="font-medium">{wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}</span>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Fund Request Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-blue-600" />
            <h3 className="text-xl font-semibold">Request Funds</h3>
          </div>
          <form onSubmit={handleRequest} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount (ETH)
              </label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                min="0.01"
                placeholder="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Purpose
              </label>
              <input
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                placeholder="e.g., Emergency Shelter"
              />
            </div>
            <button
              type="submit"
              disabled={!wallet || isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <DollarSign className="w-4 h-4" />
                  Submit Request
                </>
              )}
            </button>
          </form>
        </div>

        {/* Fund Requests History */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-blue-600" />
            <h3 className="text-xl font-semibold">Your Requests</h3>
          </div>
          {!wallet ? (
            <p className="text-gray-500 text-center py-8">Connect your wallet to view fund requests</p>
          ) : requests.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No fund requests made yet</p>
          ) : (
            <div className="space-y-4">
              {requests.map((request, index) => (
                <div key={index} className="border-b pb-4 last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-800">{request.purpose}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(request.timestamp.toNumber() * 1000).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-blue-600">
                        {ethers.utils.formatEther(request.amount)} ETH
                      </p>
                      <p className={`text-sm ${request.approved ? 'text-green-600' : 'text-orange-600'}`}>
                        {request.approved ? 'Approved' : 'Pending'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecipientDashboard;