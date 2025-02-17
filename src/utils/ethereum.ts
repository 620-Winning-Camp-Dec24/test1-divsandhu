import { ethers } from 'ethers';
import { toast } from 'react-hot-toast';

const contractABI = [
  "function donate(string memory cause) external payable",
  "function requestFunds(uint256 amount, string memory purpose) external",
  "function getDonationHistory(address donor) external view returns (tuple(address donor, uint256 amount, string cause, uint256 timestamp)[] memory)",
  "function getFundRequests(address recipient) external view returns (tuple(address recipient, uint256 amount, string purpose, bool approved, uint256 timestamp)[] memory)",
  "function getBalance() external view returns (uint256)"
];

// Sepolia testnet contract address - Replace this with your deployed contract address
const CONTRACT_ADDRESS = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";

const SEPOLIA_CHAIN_ID = '0xaa36a7';
const SEPOLIA_CONFIG = {
  chainId: SEPOLIA_CHAIN_ID,
  chainName: 'Sepolia',
  nativeCurrency: {
    name: 'Sepolia ETH',
    symbol: 'SEP',
    decimals: 18
  },
  rpcUrls: ['https://sepolia.infura.io/v3/'],
  blockExplorerUrls: ['https://sepolia.etherscan.io']
};

export const connectWallet = async () => {
  try {
    if (!window.ethereum) {
      toast.error('Please install MetaMask to use this feature');
      return null;
    }

    // Request account access
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    // Create provider and signer
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    
    // Check if we're on Sepolia testnet
    const network = await provider.getNetwork();
    if (network.chainId !== 11155111) { // Sepolia chainId
      try {
        // Try to switch to Sepolia
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: SEPOLIA_CHAIN_ID }],
        });
      } catch (switchError: any) {
        // If Sepolia is not added to MetaMask, add it
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [SEPOLIA_CONFIG],
            });
          } catch (addError) {
            toast.error('Failed to add Sepolia network to MetaMask');
            return null;
          }
        } else {
          toast.error('Please switch to Sepolia network in MetaMask');
          return null;
        }
      }
      
      // Refresh provider after network switch
      provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    }

    const signer = provider.getSigner();
    const address = await signer.getAddress();

    toast.success('Connected to Sepolia testnet');
    return { provider, signer, address };
  } catch (error) {
    console.error('Error connecting to wallet:', error);
    toast.error('Failed to connect wallet');
    return null;
  }
};

export const getContract = (signerOrProvider: ethers.Signer | ethers.providers.Provider) => {
  return new ethers.Contract(CONTRACT_ADDRESS, contractABI, signerOrProvider);
};

export const donate = async (signer: ethers.Signer, amount: string, cause: string) => {
  try {
    const contract = getContract(signer);
    const tx = await contract.donate(cause, {
      value: ethers.utils.parseEther(amount),
      gasLimit: 300000 // Add explicit gas limit
    });
    
    toast.loading('Processing donation...');
    await tx.wait();
    toast.success('Donation successful!');
    return true;
  } catch (error: any) {
    console.error('Error making donation:', error);
    toast.error(error.reason || 'Failed to make donation. Make sure you have enough Sepolia ETH.');
    return false;
  }
};

export const requestFunds = async (signer: ethers.Signer, amount: string, purpose: string) => {
  try {
    const contract = getContract(signer);
    const tx = await contract.requestFunds(
      ethers.utils.parseEther(amount),
      purpose,
      { gasLimit: 300000 } // Add explicit gas limit
    );
    
    toast.loading('Processing request...');
    await tx.wait();
    toast.success('Fund request submitted successfully!');
    return true;
  } catch (error: any) {
    console.error('Error requesting funds:', error);
    toast.error(error.reason || 'Failed to submit fund request. Make sure you have enough Sepolia ETH for gas.');
    return false;
  }
};