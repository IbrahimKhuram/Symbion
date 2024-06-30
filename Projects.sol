// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Project {
    event ProjectAdded(address indexed projectWallet, uint256 indexed projectId, uint256 goalAmount, uint256 deadline);
    event TokensFunded(address indexed account, uint256 indexed projectId, address token, uint256 amount);
    event FundsReleased(address indexed receiver, uint256 projectId, uint256 amount);
    event Paused(bool indexed value);
    event Unpaused(bool indexed value); 


    struct raiseProjects {
        address projectWallet;
        uint256 goalAmount;
        uint256 deadline;
        uint256 amountRaised;
    }

    // mapping of an id to the struct
    mapping(uint256 => raiseProjects) projects;
    // Counter for projects, Always increasing
    uint256 public projectCounter;
    
    // address of admin
    address public admin;
    // address of funding contract
    address public funding;

    // Tokens
    address public mUSDT;

    // Pause variable
        bool pause;

    constructor(
            address _admin,
            address _funding
    ) {
            admin = _admin;
            funding = _funding;

            pause = true;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only Admin is allowed to call");
        _;
    }

    modifier onlyFunding() {
        require(
            msg.sender == funding,
            "Only Funding Contract is allowed to call"
        );
        _;
    }

    modifier onlyUnpaused() {
        require(pause == false, "Funding is paused");
        _;
    }

    function addProject(
            address _projectWallet,
            uint256 _goalAmount,
            uint256 _deadline
        ) external onlyAdmin {
            require(_projectWallet != address(0), "0 Address");
            require(
                _deadline >= block.timestamp + 14 days,
                "Deadline less than 14 days not allowed"
            );

            projects[projectCounter].projectWallet = _projectWallet;
            projects[projectCounter].goalAmount = _goalAmount;
            projects[projectCounter].deadline = _deadline;

            emit ProjectAdded(_projectWallet, projectCounter, _goalAmount, _deadline);
            projectCounter++;
        }

    /// @notice Transfers funds from user through the funding contract.
    /// @param  _account   The address of the funder.
    /// @param  _token     The token which is being funded.
    /// @param  _amount    The amount which is being funded.
    function fundsAccumulation(
        address _account,
        address _token,
        uint256 _amount
        ) external onlyFunding onlyUnpaused {
            IERC20(_token).transferFrom(_account, address(this), _amount);
            projects[projectCounter - 1].amountRaised += _amount;

            emit TokensFunded(_account, projectCounter - 1, _token, _amount);

            // If goal amount is reached upon funding from a user, transfer the amount collected
            if (projects[projectCounter - 1].amountRaised >= projects[projectCounter - 1].goalAmount)
            {
                address receiver = projects[projectCounter - 1].projectWallet;

                uint256 mUSDTbalance = IERC20(mUSDT).balanceOf(address(this));

                uint256 totalAmount = mUSDTbalance;

                IERC20(mUSDT).transfer(receiver,IERC20(mUSDT).balanceOf(address(this)));

                emit FundsReleased(receiver, projectCounter - 1, totalAmount);

                Pause();
                emit Paused(pause);
            }
        }

    /// @notice Returns information stored in struct of the project.
    /// @return address        The Address of the fundseeker/s.
    /// @return goalAmount     The Goal Amount of the project.
    /// @return amountRaised   The current amount raised.
    /// @return deadline       The Deadline of the project.
    function currentProjectDetails()
        external
        view
        returns (address, uint256, uint256, uint256)
    {
        require(pause == false, "No Ongoing Projects");
        return (
            projects[projectCounter - 1].projectWallet,
            projects[projectCounter - 1].goalAmount,
            projects[projectCounter - 1].amountRaised,
            projects[projectCounter - 1].deadline
        );
    }

    function Pause() private {
        pause = true;
    }

    function Unpause() private {
        pause = false;
    }



}
