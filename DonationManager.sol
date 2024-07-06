// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DonationManager {

    event ProjectAdded(address indexed projectWallet, uint256 indexed projectId, uint256 goalAmount, uint256 deadline);
    event ProjectDeleted(uint256 indexed projectId);
    event WithdrawalRequested(uint256 indexed projectId, address indexed projectWallet);
    event WithdrawalApproved(uint256 indexed projectId, address indexed projectWallet);
    event TokensFunded(address indexed account, uint256 indexed projectId, address token, uint256 amount);

    struct raiseProjects {
        address projectWallet;
        uint256 goalAmount;
        uint256 deadline;
        uint256 amountRaised;
        bool withdrawalPermitted;
        bool withdrawalRequested;
    }

    // Mapping of an id to the struct.
    mapping(uint256 => raiseProjects) public projects;
    // Counter for projects, always increasing.
    uint256 public projectCounter;
    address public admin;
    //IERC20 public token; // Initialisation for non-native token support.

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier projectExists(uint256 projectId) {
        require(projectId < projectCounter, "Project does not exist");
        _;
    }

    constructor() {
        admin = address(0x5B38Da6a701c568545dCfcB03FcB875f56beddC4) ;
    }


    function addProject(address projectWallet, uint256 goalAmount, uint256 deadline) public {
        
        projects[projectCounter] = raiseProjects({
            projectWallet: projectWallet,
            goalAmount: goalAmount,
            deadline: deadline,
            amountRaised: 0,
            withdrawalPermitted: false,
            withdrawalRequested: false
        });

        emit ProjectAdded(projectWallet, projectCounter, goalAmount, deadline);
        projectCounter++;
    }

    function deleteProject(uint256 projectId) public projectExists(projectId) {
        
        require(projects[projectId].projectWallet == msg.sender, "Only the project creator can delete the project");
        delete projects[projectId];
        emit ProjectDeleted(projectId);
    }

    function getProject(uint256 projectId)
        external
        view
        projectExists(projectId)
        returns (address, uint256, uint256, uint256)
    {
        raiseProjects memory selectedProject = projects[projectId];
        return (
            selectedProject.projectWallet,
            selectedProject.goalAmount,
            selectedProject.amountRaised,
            selectedProject.deadline
        );
    }

    function getAllProjects()
        external
        view
        returns (address[] memory, uint256[] memory, uint256[] memory, uint256[] memory)
    {
        address[] memory projectWallets = new address[](projectCounter);
        uint256[] memory goalAmounts = new uint256[](projectCounter);
        uint256[] memory deadlines = new uint256[](projectCounter);
        uint256[] memory amountsRaised = new uint256[](projectCounter);

        for (uint256 i = 0; i < projectCounter; i++) {
            raiseProjects memory project = projects[i];
            projectWallets[i] = project.projectWallet;
            goalAmounts[i] = project.goalAmount;
            deadlines[i] = project.deadline;
            amountsRaised[i] = project.amountRaised;
        }
        return (projectWallets, goalAmounts, deadlines, amountsRaised);
    }

    //Make depositFunds function.

    // Once the project owner logs in, the admin permits withdrawals to occur during the session, setting firstApproval to true.
    function permitWithdrawal(uint256 projectId) public onlyAdmin projectExists(projectId) {
        raiseProjects storage project = projects[projectId];
        require(!project.withdrawalPermitted, "First approval already given");
        require(!project.withdrawalRequested, "Withdrawal already requested");

        project.withdrawalPermitted = true;
    }

    // The logged in project owner clicks the withdrawal button, setting withdrawalRequested to true.
    function requestWithdrawal(uint256 projectId) public projectExists(projectId) {
        raiseProjects storage project = projects[projectId];
        require(msg.sender == project.projectWallet, "Only the project owner wallet can request withdrawal");
        require(!project.withdrawalRequested, "Withdrawal already requested");

        project.withdrawalRequested = true;
        require(project.withdrawalRequested, "Withdrawal not requested");
        require(project.withdrawalPermitted, "Withdrawal not permitted");
        emit WithdrawalRequested(projectId, project.projectWallet);

        withdrawFunds(projectId);

        //project.amountRaised = 0; should be when withdrawed
        //project.firstApproval = false;
        //project.withdrawalRequested = false;
    }

    // Function to withdraw an amount from the amount raised fund for the project to the recipient wallet.
    // Supports both fundraising and crowdfunding, as well as native tokens and non-native tokens (USDT).
    function withdrawFunds(uint256 fundingType, uint256 currencyOption, address recipientWallet, uint256 projectId, uint256 amount) public payable projectExists(projectId) {

        // fundingType = 1 = fundraising; fundingType = 2 = crowdfunding.
        // currencyOption = 1 = native token; currencyOption = 2 = non native token.
        if(fundingType == 1){ //Fundraising option:

            uint256 totalAmount = msg.value;

            if(currencyOption == 1){
                (bool success,) = payable(recipientWallet).call{value: totalAmount}("");
                require(success,"Success");   
                require(success, "Token transfer failed");
                projects[projectId].amountRaised += totalAmount;
            }
            else{
                IERC20(0xdAC17F958D2ee523a2206206994597C13D831ec7).transferFrom(msg.sender, recipientWallet, amount);
                //projects[projectId].amountRaised += totalAmount;
            }
        }
        else{ //Crowdfunding option:

            //Crowdfunding platform fee: % deducted from funding amount
            uint256 totalAmount = msg.value;
            uint256 FEE = (totalAmount *10)/100;
            totalAmount= totalAmount-FEE;

            if(currencyOption == 1){
                (bool success,) = payable(recipientWallet).call{value: totalAmount}("");
                require(success,"Success");  
                require(success, "Token transfer failed"); 
                projects[projectId].amountRaised += totalAmount;
            }
            else{
                IERC20(0xdAC17F958D2ee523a2206206994597C13D831ec7).transferFrom(msg.sender, recipientWallet, amount);
                //projects[projectId].amountRaised += totalAmount;
            }
        }
    }

    function _withdrawFunds(uint256 projectId) internal {
        raiseProjects storage project = projects[projectId];
        uint256 amountRaised = projects[projectId];
        funds[projectId] = 0;

        (bool success,) = payable(project.projectWallet).call{value: amount}("");
        require(success, "Withdrawal failed");
    }

}
