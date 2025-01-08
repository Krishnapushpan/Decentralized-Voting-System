import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";
import ABI from "../assets/Voting.json";
import address from "../assets/deployed_addresses.json";
import Hero from "../components/hero";
import sideimg from "../assets/images/vote7.png";

const Votenow = () => {
  const { electionID } = useParams();
  const [candidates, setCandidates] = useState([]);
  const [timer, setTimer] = useState("00:00:00");
  const [selectedIndex, setSelectedIndex] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isVoting, setIsVoting] = useState(false);
  const [signerAddress, setSignerAddress] = useState("");
  const [hasVoted, setHasVoted] = useState(false);
  const [electionEnded, setElectionEnded] = useState(false);

  // Connect to MetaMask
  async function connectToMetamask() {
    try {
      if (!window.ethereum) {
        setFeedback("MetaMask is not installed! Please install MetaMask to continue.");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const signerAddress = await signer.getAddress();
      setSignerAddress(signerAddress);
      setFeedback("");
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      setFeedback("Failed to connect to MetaMask. Please try again.");
    }
  }

  // Helper to format numbers as two digits
  function _toTwoDigits(value) {
    return value.toString().padStart(2, "0");
  }

  // Fetch candidates and their vote counts
  async function fetchCandidates() {
    try {
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
      console.error("Error fetching candidates:", error);
    }
  }

  // Check if the user has already voted
  async function checkIfVoted() {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const signerAddress = await signer.getAddress();

      const contractABI = ABI.abi;
      const contractAddress = address["ElectModule#Voting"];
      const contract = new ethers.Contract(contractAddress, contractABI, provider);

      // Use electionVoterMap to check if the user has voted
      const hasVoted = await contract.electionVoterMap(signerAddress, electionID);
      setHasVoted(hasVoted);
    } catch (error) {
      console.error("Error checking if user has voted:", error);
    }
  }

  // Calculate and display the timer
  async function calculateTimer() {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contractABI = ABI.abi;
      const contractAddress = address["ElectModule#Voting"];
      const contract = new ethers.Contract(contractAddress, contractABI, provider);

      const electionDetails = await contract.electionDetails(electionID);
      const votingEnd = Number(electionDetails[3]);
      const currentTime = Math.floor(Date.now() / 1000);

      if (currentTime >= votingEnd) {
        setTimer("00:00:00");
        setElectionEnded(true);
      } else {
        setElectionEnded(false);
        const timeLeft = votingEnd - currentTime;
        const hours = Math.floor(timeLeft / 3600);
        const minutes = Math.floor((timeLeft % 3600) / 60);
        const seconds = timeLeft % 60;

        setTimer(`${_toTwoDigits(hours)}:${_toTwoDigits(minutes)}:${_toTwoDigits(seconds)}`);
      }
    } catch (error) {
      console.error("Error calculating timer:", error);
      setTimer("Error fetching timer");
    }
  }

  async function castVote() {
    try {
      setIsVoting(true);

      if (!window.ethereum) {
        setFeedback("MetaMask is not installed!");
        setIsVoting(false);
        return;
      }

      await window.ethereum.request({ method: "eth_requestAccounts" });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contractABI = ABI.abi;
      const contractAddress = address["ElectModule#Voting"];
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const tx = await contract.vote(Number(electionID), Number(selectedIndex) - 1, {
        gasLimit: 7920027,
      });

      await tx.wait();

      setFeedback("Vote successfully cast!");
      fetchCandidates();
      setHasVoted(true); // Update state to reflect user has voted
    } catch (error) {
      console.error("Error casting vote:", error);
      handleCastVoteError(error);
    } finally {
      setIsVoting(false);
    }
  }

  function handleCastVoteError(error) {
    if (error.code === -32603) {
      setFeedback("Internal JSON-RPC error. Please try again.");
    } else if (error.code === 4001) {
      setFeedback("Transaction rejected by the user.");
    } else if (error.code === -32000) {
      setFeedback("Insufficient funds for gas price and value.");
    } else if (error.data && error.data.message) {
      setFeedback(`Error: ${error.data.message}`);
    } else {
      setFeedback("Error casting vote. Please check the details and try again.");
    }
  }

  useEffect(() => {
    fetchCandidates();
    checkIfVoted();
    const interval = setInterval(calculateTimer, 1000);
    return () => clearInterval(interval);
  }, [electionID]);

  return (
    <div>
      <Hero />
      <div className="ml-[60px] flex">
        <div className="h-[50px] w-[400px] mt-6 bg-gradient-to-r from-blue-500 to-blue-700 p-2 rounded-md flex justify-center ml-[40px]">
          <button
            onClick={connectToMetamask}
            className="text-white tracking-wider text-2xl font-extrabold"
          >
            CONNECT TO METAMASK
          </button>
        </div>
        <div className="ml-4 mt-8">
          <p className="text-lg font-bold text-blue-600">
            {signerAddress ? `Connected: ${signerAddress}` : "Not Connected"}
          </p>
        </div>
      </div>
      <div className="flex space-x-14">
        <div className="ml-[100px]">
          <div className="w-[400px] mt-4 mb-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white text-lg py-3 rounded-md text-center">
            Time Left: {timer}
          </div>
          <p className="text-xl font-bold text-center">
            {electionEnded ? "Election Ended" : "Election Ongoing"}
          </p>
          <table className="min-w-[600px] min-h-[250px] border-collapse border border-gray-300 shadow-md rounded-lg">
            <thead className="bg-gradient-to-r from-blue-500 to-blue-700 text-white h-12">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-center">Index No</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Candidate Name</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Votes</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate) => (
                <tr key={candidate.index}>
                  <td className="border border-gray-300 px-4 py-2 text-center">{candidate.index}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{candidate.name}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{candidate.votes}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 flex flex-col shadow-md rounded-lg">
            <p className="text-gray-800 font-semibold mt-4 p-4">
              Cast your vote for the candidate with index no:
            </p>
            <input
              className="border border-gray-300 rounded px-8 py-4 m-2"
              value={selectedIndex}
              onChange={(e) => setSelectedIndex(e.target.value)}
              placeholder="Enter Candidate Index"
              aria-label="Enter candidate index"
              disabled={hasVoted || electionEnded}
            />
            <button
              onClick={castVote}
              disabled={isVoting || hasVoted || electionEnded}
              className={`m-4 ml-24 w-[400px] bg-gradient-to-r from-blue-500 to-blue-700 text-white text-lg font-bold py-3 rounded-md hover:from-blue-600 hover:to-blue-800 ${
                isVoting || hasVoted || electionEnded ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {hasVoted
                ? "You Have Already Voted"
                : electionEnded
                ? "Election Ended"
                : isVoting
                ? "Voting..."
                : "Vote Now"}
            </button>
            {feedback && <p className="text-red-500 font-semibold mt-2">{feedback}</p>}
          </div>
        </div>
        <div>
          <img src={sideimg} alt="vote image" className="ml-[80px] w-[600px]" />
        </div>
      </div>
    </div>
  );
};

export default Votenow;
