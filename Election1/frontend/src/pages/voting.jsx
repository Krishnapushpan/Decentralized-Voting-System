import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";
import ABI from "../assets/Voting.json";
import address from "../assets/deployed_addresses.json";
import Hero from "../components/hero";

const Voting = () => {
  const [signerAddress, setSignerAddress] = useState("");
  const { electionID } = useParams();
  const [candidates, setCandidates] = useState([]);
  const [timer, setTimer] = useState("00:00:00");

  async function connectToMetamask() {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const signerAddress = await signer.getAddress();
      setSignerAddress(signerAddress);
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      alert("Failed to connect to MetaMask. Please try again.");
    }
  }

  function _toTwoDigits(value) {
    return value.toString().padStart(2, "0");
  }

  async function fetchCandidates() {
    try {
      if (!window.ethereum) {
        console.error("MetaMask is not installed!");
        return;
      }

      await window.ethereum.request({ method: "eth_requestAccounts" });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contractABI = ABI.abi;
      const contractAddress = address["ElectModule#Voting"];
      const contract = new ethers.Contract(contractAddress, contractABI, provider);

      const [names, voteCounts] = await contract.getCandidateDetailsByElectionID(electionID);

      const processedCandidates = names.map((name, index) => ({
        index: index + 1,
        name,
        votes: Number(voteCounts[index]),
      }));

      setCandidates(processedCandidates);
    } catch (error) {
      console.error("Error fetching candidate details:", error);
    }
  }

  async function calculateTimer() {
    try {
      if (!window.ethereum) {
        console.error("MetaMask is not installed!");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contractABI = ABI.abi;
      const contractAddress = address["ElectModule#Voting"];
      const contract = new ethers.Contract(contractAddress, contractABI, provider);

      const electionDetails = await contract.electionDetails(electionID);
      const votingEnd = Number(electionDetails[3]);
      const currentTime = Math.floor(Date.now() / 1000);

      if (currentTime >= votingEnd) {
        setTimer("00:00:00");
      } else {
        const timeLeft = votingEnd - currentTime;
        const hours = Math.floor(timeLeft / 3600);
        const minutes = Math.floor((timeLeft % 3600) / 60);
        const seconds = timeLeft % 60;

        setTimer(`${_toTwoDigits(hours)}:${_toTwoDigits(minutes)}:${_toTwoDigits(seconds)}`);
      }
    } catch (error) {
      console.error("Error calculating timer:", error);
    }
  }

  useEffect(() => {
    fetchCandidates();
    const interval = setInterval(() => calculateTimer(), 1000);
    return () => clearInterval(interval);
  }, [electionID]);

  return (
    <div className="flex flex-col items-center p-4 space-y-6">
      <Hero />
      {/* Connect Button */}
      <div className="w-full max-w-md">
        <button
          onClick={connectToMetamask}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white text-lg font-bold py-3 rounded-md hover:from-blue-600 hover:to-blue-800"
        >
          CONNECT TO METAMASK
        </button>
        <p className="mt-2 text-center text-blue-600 font-semibold">
          {signerAddress ? `Connected: ${signerAddress}` : "Not Connected"}
        </p>
      </div>

      {/* Timer Section */}
      <div className="w-full max-w-md bg-gradient-to-r from-blue-500 to-blue-700 text-white text-lg font-bold py-3 rounded-md text-center">
        Time Left: {timer}
      </div>

      {/* Candidate List */}
      <div className="w-full max-w-2xl overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300 shadow-md rounded-lg">
          <thead className="bg-gradient-to-r from-blue-500 to-blue-700 text-white">
            <tr>
              <th className="px-6 py-3 text-center">Index No</th>
              <th className="px-6 py-3 text-center">Candidate Name</th>
              <th className="px-6 py-3 text-center">Votes</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {candidates.map((candidate) => (
              <tr key={candidate.index} className="hover:bg-gray-100">
                <td className="px-6 py-4 text-center">{candidate.index}</td>
                <td className="px-6 py-4 text-center">{candidate.name}</td>
                <td className="px-6 py-4 text-center">{candidate.votes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Voting Form */}
      <div className="w-full max-w-md bg-white shadow-lg p-6 rounded-md border">
        <p className="text-lg font-medium text-gray-800 mb-4 text-center">
          Cast your vote by entering the candidate's index number below.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <input
            type="text"
            className="w-full sm:w-2/3 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-700"
            placeholder="Enter index no"
          />
          <button className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 text-lg font-semibold">
            Confirm Vote
          </button>
        </div>
      </div>
    </div>
  );
};

export default Voting;
