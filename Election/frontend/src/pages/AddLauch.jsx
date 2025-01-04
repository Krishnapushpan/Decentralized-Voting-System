import React, { useState } from "react";
import Hero from "../components/hero";
import votel from "../assets/images/vote6.png";
import ABI from "../assets/Voting.json";
import address from "../assets/deployed_addresses.json";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook

const AddLaunch = () => {
  const [signerAddress, setSignerAddress] = useState("");
  const [description, setDescription] = useState("");
  const [candidate1, setCandidate1] = useState("");
  const [candidate2, setCandidate2] = useState("");
  const [candidate3, setCandidate3] = useState("");
  const [timer, setTimer] = useState("");
  const navigate = useNavigate(); // Use useNavigate

  async function connectToMetamask() {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const signerAddress = await signer.getAddress();
      setSignerAddress(signerAddress);
      // alert(`${signerAddress} is logged in`);
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      alert("Failed to connect to MetaMask. Please try again.");
    }
  }

  async function launchElection() {
    try {
        if (!window.ethereum) {
            alert("MetaMask is not installed!");
            return;
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contractABI = ABI.abi;
        const contractAddress = address["ElectModule#Voting"];
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        const candidates = [candidate1, candidate2, candidate3].filter((name) => name.trim());
        const [hours, minutes] = timer.split(":").map(Number); // Split into hours and minutes
        const durationInMinutes = hours * 60 + minutes;

        if (!description.trim()) {
          alert("Please provide a description for the election.");
          return;
      }
      
      if (candidates.length < 2) {
          alert("Please provide at least two valid candidates.");
          return;
      }
      
      if (isNaN(durationInMinutes) || durationInMinutes <= 0) {
        alert("Please set a valid timer.");
        return;
    }
      
        const tx = await contract.launchElection(description, candidates, durationInMinutes);
        await tx.wait();

        alert("Election launched successfully!");

        // Navigate to home page after successful launch
        navigate("/"); // Assuming "/" is the home route
    } 
      catch (error) {
        console.error("Error launching election:", error);
        alert(`Error launching election: ${error.message || error.reason || "Unknown error"}`);
    }
  }

  return (
    <>
      <Hero />
      <div className="ml-[70px] flex">
        <div className="h-[50px] w-[400px] mt-6 bg-gradient-to-r from-blue-500 to-blue-700 p-2 rounded-md flex justify-center ml-[40px]">
          <button
            onClick={connectToMetamask}
            className="text-white tracking-wider text-2xl font-extrabold"
          >
            CONNECT TO METAMASK
          </button>
        </div>
        <div className="ml-4 mt-6">
          <p className="text-lg font-bold text-blue-600">
            {signerAddress ? `Connected: ${signerAddress}` : "Not Connected"}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-start px-10 mt-8 gap-x-8">
        <form className="w-[600px] ml-[70px] bg-gray-200 p-6 shadow-md rounded-md">
          <div className="mb-6">
            <label htmlFor="about" className="block text-[#1a5276] font-extrabold mb-2">
              ABOUT
            </label>
            <textarea
              id="description"
              rows="5"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe the purpose of the voting..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            {[setCandidate1, setCandidate2, setCandidate3].map((setter, index) => (
              <div key={index}>
                <label
                  htmlFor={`candidate${index + 1}`}
                  className="block text-[#1a5276] font-extrabold mb-2"
                >
                  Candidate {index + 1}
                </label>
                <input
                  type="text"
                  id={`candidate${index + 1}`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Enter candidate ${index + 1} name`}
                  onChange={(e) => setter(e.target.value)}
                />
              </div>
            ))}
          </div>

          <div className="mt-6">
            <label htmlFor="timer" className="block text-[#1a5276] font-extrabold mb-2">
              Set Timer
            </label>
            <input
              type="time"
              id="timer"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={timer}
              onChange={(e) => setTimer(e.target.value)}
            />

            <button
              type="button"
              className="mt-4 bg-gradient-to-r from-blue-500 to-blue-700 hover:bg-[#1a5276] text-2xl text-white font-bold py-2 px-4 rounded-md w-full"
              onClick={launchElection}
            >
              Launch Election
            </button>
          </div>
        </form>

        <div className="flex-1 flex justify-center items-center">
          <img className="h-[500px] w-[650px] mt-[100px] rounded-lg" src={votel} alt="Voting" />
        </div>
      </div>
    </>
  );
};

export default AddLaunch;
