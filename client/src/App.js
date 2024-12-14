import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "projectId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "projectWallet",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "goalAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      }
    ],
    "name": "ProjectAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "projectId",
        "type": "uint256"
      }
    ],
    "name": "ProjectDeleted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "donorWallet",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "projectId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "depositedAmount",
        "type": "uint256"
      }
    ],
    "name": "TokensFunded_Crowdfunding",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "donorWallet",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "projectId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "depositedAmount",
        "type": "uint256"
      }
    ],
    "name": "TokensFunded_Fundraising",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "projectId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "projectWallet",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "withdrawnAmount",
        "type": "uint256"
      }
    ],
    "name": "TokensWithdrawn",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "projectId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "projectWallet",
        "type": "address"
      }
    ],
    "name": "WithdrawalApproved",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "projectId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "projectWallet",
        "type": "address"
      }
    ],
    "name": "WithdrawalRequested",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "projectWallet",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "goalAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      }
    ],
    "name": "addProject",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "admin",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "projectId",
        "type": "uint256"
      }
    ],
    "name": "deleteProject",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "projectId",
        "type": "uint256"
      }
    ],
    "name": "depositFunds_Crowdfunding",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "projectId",
        "type": "uint256"
      }
    ],
    "name": "depositFunds_Fundraising",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllProjects",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      },
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      },
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "projectId",
        "type": "uint256"
      }
    ],
    "name": "getProject",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "projectId",
        "type": "uint256"
      }
    ],
    "name": "permitWithdrawal",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "projectCounter",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "projects",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "projectId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "projectWallet",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "goalAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amountRaised",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "withdrawalPermitted",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "withdrawalRequested",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "projectId",
        "type": "uint256"
      }
    ],
    "name": "requestWithdrawal",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "projectId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "withdrawalAmount",
        "type": "uint256"
      }
    ],
    "name": "withdrawFunds",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]

const App = () => {

  const [contractBalance, setContractBalance] = useState('');

  const [projectId_getProject, setProjectId_getProject] = useState('');
  const [projectDetails, setProjectDetails] = useState(null);

  const [projectId_deleteProject, setProjectId_deleteProject] = useState('');

  const [projects, setProjects] = useState([]);
  const [projectWallet, setProjectWallet] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [deadline, setDeadline] = useState('');

  const [projectId_deposit_fundraising, setProjectId_deposit_fundraising] = useState('');
  const [depositAmount_fundraising, setDepositAmount_fundraising] = useState('');

  const [projectId_deposit_crowdfunding, setProjectId_deposit_crowdfunding] = useState('');
  const [depositAmount_crowdfunding, setDepositAmount_crowdfunding] = useState('');
  
  const [projectId_withdrawal, setProjectId_withdrawal] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const provider = new ethers.JsonRpcProvider('http://localhost:8545');
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, ABI, signer);
        setProvider(provider);
        setSigner(signer);
        setContract(contract);
        await fetchProjects(contract);
      }
    };
    init();
  }, []);

  const fetchContractBalance = async () => {
    if (!provider || !contractAddress) return;
    const balance = await provider.getBalance(contractAddress);
    setContractBalance(ethers.formatEther(balance));
  };

  const addProject = async () => {
    if (!contract) return;
    const tx = await contract.addProject(projectWallet, ethers.parseEther(goalAmount), deadline);
  };

  const deleteProject = async () => {
    if (!contract) return;
    const tx = await contract.deleteProject(projectId_deleteProject);
  };

  const depositFundsFundraising = async () => {
    if (!contract || !projectId_deposit_fundraising || !depositAmount_fundraising) return;
    await contract.depositFunds_Fundraising(projectId_deposit_fundraising, { value: ethers.parseEther(depositAmount_fundraising) });
  };

  const depositFundsCrowdfunding = async () => {
    if (!contract || !projectId_deposit_crowdfunding || !depositAmount_crowdfunding) return;
    await contract.depositFunds_Crowdfunding(projectId_deposit_crowdfunding, { value: ethers.parseEther(depositAmount_crowdfunding) });
  };

  const withdrawFunds = async () => {
    if (!contract || !projectId_withdrawal || !withdrawAmount) return;
    await contract.withdrawFunds(projectId_withdrawal, ethers.parseEther(withdrawAmount));
  };

  const fetchProject = async () => {
    if (!contract || !projectId_getProject) return;
    const projectData = await contract.getProject(projectId_getProject);
    const formattedProject = {
      projectId: Number(projectData[0]),
      projectWallet: projectData[1],
      goalAmount: ethers.formatEther(projectData[2]),
      amountRaised: ethers.formatEther(projectData[3]),
      deadline: Number(projectData[4])
    };
    setProjectDetails(formattedProject);
  };

  const fetchProjects = async (contract) => {
    if (!contract) return;
    const projectsData = await contract.getAllProjects();
    console.log(projectsData[3]);
    const formattedProjects = projectsData[0].map((_, i) => ({
      projectId: Number(projectsData[0][i]),
      projectWallet: projectsData[1][i],
      goalAmount: ethers.formatEther(projectsData[2][i]),
      deadline: Number(projectsData[3][i]),
      amountRaised: ethers.formatEther(projectsData[4][i])
    }));
    setProjects(formattedProjects);
  };

  return (
    <div>
      <h1>Symbion</h1>
      <br></br>

      <div>
        <h2>Contract Balance</h2>
        <button onClick={fetchContractBalance}>Fetch Balance</button>
        {contractBalance && <p>Contract Balance: {contractBalance} ETH</p>}
      </div><br></br>

      <div>
        <h2>Add Project</h2>
        <label>projectWallet: </label>
        <input
          type="text"
          placeholder="address"
          value={projectWallet}
          onChange={(e) => setProjectWallet(e.target.value)}
        /><br></br>
        <label>goalAmount: </label>
        <input
          type="text"
          placeholder="uint 256"
          value={goalAmount}
          onChange={(e) => setGoalAmount(e.target.value)}
        /><br></br>
        <label>deadline: </label>
        <input
          type="text"
          placeholder="uint 256"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
        <button onClick={addProject}>transact</button>
      </div><br></br>

      <div>
        <h2>Delete Project</h2>
        <label>projectId: </label>
        <input
          type="text"
          placeholder="uint 256"
          value={projectId_deleteProject}
          onChange={(e) => setProjectId_deleteProject(e.target.value)}
        /><br></br>
        <button onClick={deleteProject}>transact</button>
      </div><br></br>

      <div>
        <h2>Deposit Funds - Fundraising</h2>
        <label>Project ID: </label>
        <input
          type="text"
          placeholder="uint 256"
          value={projectId_deposit_fundraising}
          onChange={(e) => setProjectId_deposit_fundraising(e.target.value)}
        /><br></br>
        <label>Amount: </label>
        <input
          type="text"
          placeholder="ETH"
          value={depositAmount_fundraising}
          onChange={(e) => setDepositAmount_fundraising(e.target.value)}
        /><br></br>
        <button onClick={depositFundsFundraising}>Fundraising</button>
      </div><br></br>

      <div>
        <h2>Deposit Funds - Crowdfunding</h2>
        <label>Project ID: </label>
        <input
          type="text"
          placeholder="uint 256"
          value={projectId_deposit_crowdfunding}
          onChange={(e) => setProjectId_deposit_crowdfunding(e.target.value)}
        /><br></br>
        <label>Amount: </label>
        <input
          type="text"
          placeholder="ETH"
          value={depositAmount_crowdfunding}
          onChange={(e) => setDepositAmount_crowdfunding(e.target.value)}
        /><br></br>
        <button onClick={depositFundsCrowdfunding}>Crowdfunding</button>
      </div><br></br>

      <div>
        <h2>Withdraw Funds</h2>
        <label>Project ID: </label>
        <input
          type="text"
          placeholder="uint 256"
          value={projectId_withdrawal}
          onChange={(e) => setProjectId_withdrawal(e.target.value)}
        /><br></br>
        <label>Amount: </label>
        <input
          type="text"
          placeholder="ETH"
          value={withdrawAmount}
          onChange={(e) => setWithdrawAmount(e.target.value)}
        /><br></br>
        <button onClick={withdrawFunds}>Withdraw</button>
      </div><br></br>

      <div>
        <h2>Get Project by ID</h2>
        <label>Project ID: </label>
        <input
          type="text"
          placeholder="uint 256"
          value={projectId_getProject}
          onChange={(e) => setProjectId_getProject(e.target.value)}
        /><br></br>
        <button onClick={fetchProject}>Fetch Project</button>
        <br></br><br></br>

        {projectDetails && (
          <div>
            <h3>Project Details</h3>
            <p>Project ID: {projectDetails.projectId}</p>
            <p>Project Wallet: {projectDetails.projectWallet}</p>
            <p>Goal Amount: {projectDetails.goalAmount} ETH</p>
            <p>Deadline: {projectDetails.deadline}</p>
            <p>Amount Raised: {projectDetails.amountRaised} ETH</p>
          </div>
        )}
      </div><br></br>

      <div>
        <h2>All Projects</h2>
        <button onClick={fetchProjects}>transact</button>
        <ul>
          {projects.map((project) => (
            <li key={project.projectId}>
              <p>Project ID: {project.projectId}</p>
              <p>Project Wallet: {project.projectWallet}</p>
              <p>Goal Amount: {project.goalAmount} ETH</p>
              <p>Deadline: {project.deadline}</p>
              <p>Amount Raised: {project.amountRaised} ETH</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;