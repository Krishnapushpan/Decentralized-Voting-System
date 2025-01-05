import React, { useState,useEffect} from 'react'
import { useParams } from "react-router-dom";
import { ethers } from "ethers";
import ABI from "../assets/Voting.json";
import address from "../assets/deployed_addresses.json";
import Hero from '../components/hero'
import sideimg from '../assets/images/vote7.png'
const votenow = () => {
    const [signerAddress, setSignerAddress] = useState("");
    const { electionID } = useParams();
    const [candidates, setCandidates] = useState([]);
    const [timer, setTimer] = useState("00:00:00");
    const [selectedIndex, setSelectedIndex] = useState(""); // State to store selected candidate index
    const [feedback, setFeedback] = useState(""); // State for user feedback
  

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
      
      // Debugging outputs
      console.log("Candidate Names:", names);
      console.log("Vote Counts:", voteCounts);
  
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
   // Function to cast a vote
   async function castVote() {
    if (selectedIndex === "") {
      setFeedback("Please enter a candidate's index number.");
      return;
    }
  
    try {
      if (!window.ethereum) {
        setFeedback("MetaMask is not installed!");
        return;
      }
  
      await window.ethereum.request({ method: "eth_requestAccounts" });
  
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner(); // Use signer for transaction
      const contractABI = ABI.abi;
      const contractAddress = address["ElectModule#Voting"];
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
  
      // Call the vote function
      const tx = await contract.vote(Number(electionID), Number(selectedIndex) - 1); // Index adjusted to 0-based
      await tx.wait(); // Wait for the transaction to be mined
  
      setFeedback("Vote successfully cast!");
      fetchCandidates(); // Refresh the candidate list
    } catch (error) {
      // Check if the error contains a revert reason
      if (error.reason) {
        setFeedback(error.reason); // Display the specific error reason
      } else if (error.data && error.data.message) {
        setFeedback(error.data.message); // Handle fallback for other errors
      } else {
        setFeedback("Error casting vote. Please try again."); // Generic fallback message
      }
  
      console.error("Error casting vote:", error);
    }
  }
  
  useEffect(() => {
    fetchCandidates();
    const interval = setInterval(() => calculateTimer(), 1000);
    return () => clearInterval(interval);
  }, [electionID]);

    
  return (
    <div>
        <Hero />
        {/* Connect Button */}
      <div className="w-full ml-[120px] mt-[40px] flex space-x-12" >
        <button onClick={connectToMetamask}
          className="w-[400px] bg-gradient-to-r from-blue-500 to-blue-700 text-white text-lg font-bold py-3 rounded-md hover:from-blue-600 hover:to-blue-800" >
          CONNECT TO METAMASK </button>
        <p className="mt-4  w-[800px]  text-blue-600 font-semibold">
          {signerAddress ? `Connected: ${signerAddress}` : "Not Connected"} </p>
      </div>
      <div className='flex space-x-14 '>
        <div className='ml-[100px]'>
         {/* Timer Section */}
         <div className="w-[400px] m-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white text-lg font-bold py-3 rounded-md text-center">
        Time Left: {timer}
      </div>
      {/* Candidate List */}
      <div className="w-[600px] m-4 overflow-x-auto">
        <table className="min-w-[500px] border-collapse border border-gray-300 shadow-md rounded-lg">
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
      <div className="m-4 p-6 w-[500px] bg-white shadow-lg rounded-lg border border-gray-200">
        <p className="text-gray-800 text-lg font-medium mb-4">
          Cast your vote by entering the candidate's index number below.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <input
            type="text"
            value={selectedIndex}
            onChange={(e) => setSelectedIndex(e.target.value)}
            className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700"
            placeholder="Enter index no"
          />
          <button
            onClick={castVote}
            type="button"
            className="px-6 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition duration-200 text-lg font-semibold"
          >
            Confirm Vote
          </button>
        </div>
        {feedback && (
          <p className="mt-4 text-sm text-center text-red-500">
            {feedback}
          </p>
        )}
      </div>
      </div>
      <div>
        <img src={sideimg} alt="" className='w-[800px] ml-[100px] h-[600px]'/>
      </div>
      </div>
    </div>
  )
}

export default votenow