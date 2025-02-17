// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DisasterRelief {
    struct Donation {
        address donor;
        uint256 amount;
        string cause;
        uint256 timestamp;
    }

    struct FundRequest {
        address recipient;
        uint256 amount;
        string purpose;
        bool approved;
        uint256 timestamp;
    }

    mapping(address => Donation[]) public donorHistory;
    mapping(address => FundRequest[]) public recipientRequests;
    
    event DonationMade(address indexed donor, uint256 amount, string cause);
    event FundRequested(address indexed recipient, uint256 amount, string purpose);
    event FundApproved(address indexed recipient, uint256 amount);

    // Make a donation
    function donate(string memory cause) external payable {
        require(msg.value > 0, "Donation amount must be greater than 0");
        
        Donation memory newDonation = Donation({
            donor: msg.sender,
            amount: msg.value,
            cause: cause,
            timestamp: block.timestamp
        });
        
        donorHistory[msg.sender].push(newDonation);
        emit DonationMade(msg.sender, msg.value, cause);
    }

    // Request funds
    function requestFunds(uint256 amount, string memory purpose) external {
        require(amount > 0, "Request amount must be greater than 0");
        
        FundRequest memory newRequest = FundRequest({
            recipient: msg.sender,
            amount: amount,
            purpose: purpose,
            approved: false,
            timestamp: block.timestamp
        });
        
        recipientRequests[msg.sender].push(newRequest);
        emit FundRequested(msg.sender, amount, purpose);
    }

    // Get donor's donation history
    function getDonationHistory(address donor) external view returns (Donation[] memory) {
        return donorHistory[donor];
    }

    // Get recipient's fund requests
    function getFundRequests(address recipient) external view returns (FundRequest[] memory) {
        return recipientRequests[recipient];
    }

    // Get contract balance
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}