const {loadFixture,} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

describe("DonationManager", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployContractAndSetVariables() {

    // Contracts are deployed using the first signer/account by default
    const [admin, projectOwner, donor, otherAccount] = await ethers.getSigners();


    const DonationManagerFactory = await ethers.getContractFactory("DonationManager");
    const donationManager = await DonationManagerFactory.deploy();

    return { admin, projectOwner, donor, otherAccount, donationManager };
  }

  describe("Project Management", function () {
    it("Should allow adding a project", async function () {
        //const goalAmount = ethers.utils.parseEther("10"); // 10 ETH
        //const deadline = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30); // 30 days from now
        const { admin, projectOwner, donor, otherAccount, donationManager} = await loadFixture(deployContractAndSetVariables);

        await expect(donationManager.connect(admin).addProject(projectOwner.address, 10, 10))
            .to.emit(donationManager, "ProjectAdded")
            .withArgs(projectOwner.address, 0, 10, 10);

        const project = await donationManager.projects(0);
        expect(project.projectWallet).to.equal(projectOwner.address);
        expect(project.goalAmount).to.equal(10);
        expect(project.deadline).to.equal(10);
    });

    it("Should allow deleting a project by the owner", async function () {
        //await donationManager.connect(admin).addProject(projectOwner.address, goalAmount, deadline);
        const { admin, projectOwner, donor, otherAccount, donationManager} = await loadFixture(deployContractAndSetVariables);

        await donationManager.connect(admin).addProject(projectOwner.address, 10, 10);

        await expect(donationManager.connect(projectOwner).deleteProject(0))
            .to.emit(donationManager, "ProjectDeleted")
            .withArgs(0);

        //await expect(donationManager.projects(0)).to.be.reverted;
    });
  });

  describe("Fundraising", function () {
    it("Should allow depositing funds for fundraising", async function () {
        
      const { admin, projectOwner, donor, otherAccount, donationManager} = await loadFixture(deployContractAndSetVariables);
      await donationManager.connect(admin).addProject(projectOwner.address, 10, 10);

        const depositAmount = 1; // 1 ETH

        await expect(donationManager.connect(donor).depositFunds_Fundraising(0, { value: depositAmount }))
            .to.emit(donationManager, "TokensFunded_Fundraising")
            .withArgs(donor.address, 0, depositAmount);

        const project = await donationManager.projects(0);
        expect(project.amountRaised).to.equal(depositAmount);
    });

    it("Should allow depositing funds for crowdfunding", async function () {
        
        const { admin, projectOwner, donor, otherAccount, donationManager} = await loadFixture(deployContractAndSetVariables);
        await donationManager.connect(admin).addProject(projectOwner.address, 10, 10);
        
        const depositAmount = 1; // 1 ETH

        await expect(donationManager.connect(donor).depositFunds_Crowdfunding(0, { value: depositAmount }))
            .to.emit(donationManager, "TokensFunded_Crowdfunding")
            .withArgs(donor.address, 0, depositAmount);

        const project = await donationManager.projects(0);
        expect(project.amountRaised).to.equal(depositAmount);
    });
  });

  describe("Fundraising", function () {
    it("Should allow withdrawing funds", async function () {
      const { admin, projectOwner, donor, otherAccount, donationManager} = await loadFixture(deployContractAndSetVariables);
      await donationManager.connect(projectOwner).addProject(projectOwner.address, 10, 10);
      const depositAmount = 7;
      await donationManager.connect(donor).depositFunds_Fundraising(0, { value: depositAmount });
      const withdrawalAmount = 3;
      await donationManager.connect(projectOwner).withdrawFunds(0, withdrawalAmount);
      const project = await donationManager.getProject(0);
      expect(project[2]).to.equal(4);
    });
  });

  describe("Project Retrieval", function () {
    it("Should return all projects correctly", async function () {
      const { admin, projectOwner, donor, otherAccount, donationManager} = await loadFixture(deployContractAndSetVariables);
      await donationManager.addProject(projectOwner.address, 10, 1657892400);
      await donationManager.addProject(otherAccount.address, 20, 1657892401);
      
      const projects = await donationManager.getAllProjects();
      const [projectWallets, goalAmounts, deadlines, amountsRaised] = projects;
      
      expect(projectWallets.length).to.equal(2);
      expect(goalAmounts.length).to.equal(2);
      expect(deadlines.length).to.equal(2);
      expect(amountsRaised.length).to.equal(2);

      expect(projectWallets[0]).to.equal(projectOwner.address);
      //expect(goalAmounts[0]).to.equal(10));
      expect(deadlines[0]).to.equal(1657892400);
      expect(amountsRaised[0]).to.equal(0);

      expect(projectWallets[1]).to.equal(otherAccount.address);
      expect(goalAmounts[1]).to.equal(20);
      expect(deadlines[1]).to.equal(1657892401);
      expect(amountsRaised[1]).to.equal(0);
    });
  });
});