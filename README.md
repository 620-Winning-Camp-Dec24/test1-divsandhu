# Blockchain-Based Disaster Management System

## Introduction
The **Blockchain-Based Disaster Management System** is designed to enhance transparency, efficiency, and accountability in disaster relief efforts. By leveraging blockchain technology, this system ensures secure fund allocation, real-time tracking of donations, and streamlined distribution to affected individuals.

## Features
- **Decentralized Fund Management:** Ensures transparency in donation collection and distribution.
- **Immutable Records:** Every transaction is stored on a blockchain, preventing fraud.
- **Real-Time Tracking:** Donors can track their contributions and how they are utilized.
- **Smart Contracts:** Automates fund disbursement based on predefined conditions.
- **Secure Identity Verification:** Ensures only verified individuals receive aid.
- **Disaster Relief Coordination:** Connects NGOs, donors, and beneficiaries effectively.

## Tech Stack
- **Frontend:** React.js / Next.js, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Blockchain:** Solidity, Ethereum / Polygon
- **Database:** IPFS (for decentralized storage)
- **Authentication:** Web3 Wallet (e.g., MetaMask)
- **Development Tools:** Hardhat, Alchemy

## Installation
### Prerequisites
Ensure you have the following installed:
- Node.js & npm
- Metamask (for blockchain interactions)
- Hardhat (for smart contract development)

### Steps
1. **Clone the Repository:**
   ```sh
   git clone https://github.com/your-repo/blockchain-disaster-mgmt.git
   cd blockchain-disaster-mgmt
   ```

2. **Install Dependencies:**
   ```sh
   npm install
   ```

3. **Start the Development Server:**
   ```sh
   npm run dev
   ```

4. **Deploy Smart Contracts:**
   ```sh
   npx hardhat run scripts/deploy.js --network rinkeby
   ```

## Usage
1. **Donors:** Can send funds through smart contracts and track fund allocation.
2. **NGOs:** Can request funds and distribute them based on verified needs.
3. **Beneficiaries:** Receive allocated funds directly to their verified wallets.

## Smart Contract Overview
- **DisasterRelief.sol:** Manages donations and tracks fund allocation.

## Future Enhancements
- Multi-chain support (e.g., Binance Smart Chain, Solana)
- AI-powered disaster prediction
- Mobile app integration