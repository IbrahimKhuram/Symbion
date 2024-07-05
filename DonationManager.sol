// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DonationManager {

    event ProjectAdded(address indexed projectWallet, uint256 indexed projectId, uint256 goalAmount, uint256 deadline);
    event TokensFunded(address indexed account, uint256 indexed projectId, address token, uint256 amount);

    struct raiseProjects {
        address projectWallet;
        uint256 goalAmount;
        uint256 deadline;
        uint256 amountRaised;
    }

    // mapping of an id to the struct
    mapping(uint256 => raiseProjects) public projects;
    // Counter for projects, Always increasing
    uint256 public projectCounter;

    //IERC20 public token;

    constructor() {
        //token = IERC20(tokenAddress);
    }

    function addProject(address _projectWallet, uint256 _goalAmount, uint256 _deadline) public {
        
    projects[projectCounter].projectWallet = _projectWallet;
    projects[projectCounter].goalAmount = _goalAmount;
    projects[projectCounter].deadline = _deadline;

    emit ProjectAdded(_projectWallet, projectCounter, _goalAmount, _deadline);
    projectCounter++;
    }


    function currentProjectDetails()
        external
        view
        returns (address, uint256, uint256, uint256)
    {
        return (
            projects[projectCounter - 1].projectWallet,
            projects[projectCounter - 1].goalAmount,
            projects[projectCounter - 1].amountRaised,
            projects[projectCounter - 1].deadline
        );
    }

    // Function to transfer tokens from the sender to this contract
    function depositTokens(uint256 fundingType, uint256 currencyOption, address recipientWallet, uint256 amount) public payable {
        
        // fundingType = 1 = fundraising; fundingType = 2 = crowdfunding.
        // currencyOption = 1 = native token; currencyOption = 2 = non native token.
        if(fundingType == 1){

            uint256 totalAmount = msg.value;

            if(currencyOption == 1){
                (bool success,) = payable(recipientWallet).call{value: totalAmount}("");
                require(success,"Success");   
                require(success, "Token transfer failed");
            }
            else{
                IERC20(0xdAC17F958D2ee523a2206206994597C13D831ec7).transferFrom(msg.sender, recipientWallet, amount);
            }
        }
        else{

            uint256 totalAmount = msg.value;
            uint256 FEE = (totalAmount *10)/100;
            totalAmount= totalAmount-FEE;

            if(currencyOption == 1){
                (bool success,) = payable(recipientWallet).call{value: totalAmount}("");
                require(success,"Success");  
                require(success, "Token transfer failed"); 
            }
            else{
                IERC20(0xdAC17F958D2ee523a2206206994597C13D831ec7).transferFrom(msg.sender, recipientWallet, amount);
            }
        }
    }
}


