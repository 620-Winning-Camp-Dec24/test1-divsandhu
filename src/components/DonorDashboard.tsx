import React, { useState, useEffect } from 'react';
import { DollarSign, History, Wallet, Loader2 } from 'lucide-react';
import { ethers } from 'ethers';
import { connectWallet, donate, getContract } from '../utils/ethereum';
import { toast } from 'react-hot-toast';

interface DonationHistory {
  donor: string;
  amount: ethers.BigNumber;
  cause: string;
  timestamp: ethers.BigNumber;
}

function DonorDashboard() {
  const [amount, setAmount] = useState('');
  const [cause, setCause] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [donations, setDonations] = useState<DonationHistory[]>([]);
  const [wallet, setWallet] = useState<{
    provider: ethers.providers.Web3Provider;
    signer: ethers.Signer;
    address: string;
  } | null>(null);

  const handleConnect = async () => {
    const walletData = await connectWallet();
    if (walletData) {
      setWallet(walletData);
      loadDonationHistory(walletData);
    }
  };

  const loadDonationHistory = async (walletData: { provider: ethers.providers.Web3Provider; signer: ethers.Signer; address: string }) => {
    try {
      const contract = getContract(walletData.provider);
      const history = await contract.getDonationHistory(walletData.address);
      setDonations(history);
    } catch (error) {
      console.error('Error loading donation history:', error);
      toast.error('Failed to load donation history');
    }
  };

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet) {
      toast.error('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    try {
      const success = await donate(wallet.signer, amount, cause);
      if (success) {
        setAmount('');
        setCause('');
        loadDonationHistory(wallet);
        toast.success('Donation successful! Thank you for your contribution.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Donor Dashboard</h2>
          <p className="text-gray-600 mt-1">Support disaster relief efforts with secure blockchain donations</p>
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
        {/* Donation Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-blue-600" />
            <h3 className="text-xl font-semibold">Make a Donation</h3>
          </div>
          <form onSubmit={handleDonate} className="space-y-4">
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
                Cause
              </label>
              <select
                value={cause}
                onChange={(e) => setCause(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select a cause</option>
                <option value="Flood Relief">Flood Relief</option>
                <option value="Earthquake Response">Earthquake Response</option>
                <option value="Hurricane Recovery">Hurricane Recovery</option>
                <option value="Wildfire Relief">Wildfire Relief</option>
                <option value="Emergency Medical Aid">Emergency Medical Aid</option>
              </select>
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
                  Donate Now
                </>
              )}
            </button>
          </form>
        </div>

        {/* Donation History */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <History className="w-5 h-5 text-blue-600" />
            <h3 className="text-xl font-semibold">Your Donations</h3>
          </div>
          {!wallet ? (
            <p className="text-gray-500 text-center py-8">Connect your wallet to view donation history</p>
          ) : donations.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No donations made yet</p>
          ) : (
            <div className="space-y-4">
              {donations.map((donation, index) => (
                <div key={index} className="border-b pb-4 last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-800">{donation.cause}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(donation.timestamp.toNumber() * 1000).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="font-semibold text-blue-600">
                      {ethers.utils.formatEther(donation.amount)} ETH
                    </p>
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

export default DonorDashboard;