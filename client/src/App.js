import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';

// Your smart contract ABI and address
const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const contractABI = [
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
          "internalType": "address",
          "name": "projectWallet",
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

function App() {
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    const [projects, setProjects] = useState([]);
    const [formInput, setFormInput] = useState({
        projectWallet: '',
        goalAmount: '',
        deadline: ''
    });

    useEffect(() => {
        // Initialize ethers provider and contract
        // await window.ethereum.request({ method: 'eth_requestAccounts' }); // if(widow.ethereum) {} else {console.error("Error")}
        // if (!provider) return; //etc for other async funcs
        
        const setupProvider = async () => {
          const prov = new ethers.BrowserProvider(window.ethereum);
          setProvider(prov);
        };

        const setupSigner = async () => {
          const sign = provider.getSigner();
          setSigner(sign);
        };
        
        const setupContract = async () => {
          const cont = new ethers.Contract(contractAddress, contractABI, signer);
          setContract(cont);
        };

        setupProvider()
          .catch(console.error);
        setupSigner()
          .catch(console.error);
        setupContract()
          .catch(console.error);

    }, []);

    const createProject = async (e) => {
      e.preventDefault();
      if (!contract || !signer) return;
      const { projectWallet, goalAmount, deadline } = formInput;
      try {
          const tx = await contract.addProject(
              projectWallet,
              ethers.parseEther(goalAmount),
              Math.floor(new Date(deadline).getTime() / 1000)
          );
          await tx.wait();
          fetchProjects();
      } catch (error) {
          console.error('Error creating project:', error);
      }
    };

    const fetchProjects = async () => {
        if (!contract) return;
        try {
            const projectData = await contract.getAllProjects();
            const [wallets, goals, deadlines, raised] = projectData;
            const projectList = wallets.map((wallet, index) => ({
                wallet,
                goal: ethers.toBigInt(goals[index]),
                deadline: new Date(deadlines[index].toNumber() * 1000).toLocaleString(),
                raised: ethers.toBigInt(raised[index])
            }));
            setProjects(projectList);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };


    return (
        <div className="App">
            <header className="App-header">
                <h1>Donation Manager</h1>
                <form onSubmit={createProject}>
                    <div>
                        <label>Project Wallet:</label>
                        <input
                            type="text"
                            value={formInput.projectWallet}
                            onChange={(e) => setFormInput({ ...formInput, projectWallet: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label>Goal Amount (ETH):</label>
                        <input
                            type="number"
                            step="0.01"
                            value={formInput.goalAmount}
                            onChange={(e) => setFormInput({ ...formInput, goalAmount: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label>Deadline (MM-DD-YYYY):</label>
                        <input
                            type="date"
                            value={formInput.deadline}
                            onChange={(e) => setFormInput({ ...formInput, deadline: e.target.value })}
                            required
                        />
                    </div>
                    <button type="submit">Create Project</button>
                </form>
                <button onClick={fetchProjects}>Fetch All Projects</button>
                <div>
                    <h2>Projects</h2>
                    {projects.map((project, index) => (
                        <div key={index}>
                            <p>Wallet: {project.wallet}</p>
                            <p>Goal: {project.goal} ETH</p>
                            <p>Deadline: {project.deadline}</p>
                            <p>Raised: {project.raised} ETH</p>
                        </div>
                    ))}
                </div>
            </header>
        </div>
    );
}

export default App;
