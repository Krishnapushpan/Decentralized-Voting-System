import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import Hero from "../components/hero";
import Lauchbutton from "../components/lauchbutton";
import imgvote from "../assets/images/vote2.jpg";
import ABI from "../assets/Voting.json";
import address from "../assets/deployed_addresses.json";
import { ethers } from "ethers";

const Home = () => {
  const [elections, setElections] = useState([]);

  useEffect(() => {
    async function fetchElections() {
      try {
        if (!window.ethereum) {
          console.error("MetaMask is not installed!");
          return;
        }

        // Request user to connect their wallet
        await window.ethereum.request({ method: "eth_requestAccounts" });

        // Initialize provider and contract
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contractABI = ABI.abi;
        const contractAddress = address["ElectModule#Voting"];
        const contract = new ethers.Contract(contractAddress, contractABI, provider);

        // Fetch election data from the contract
        const electionData = await contract.getAllElectionDetails();

        // Process data to extract only the required fields
        const processedElections = electionData.map(election => ({
          electionID: Number(election.electionID), // Convert BigInt to Number
          description: election.description,
        }));

        setElections(processedElections);
      } catch (error) {
        console.error("Error fetching election details:", error);
      }
    }

    fetchElections();
  }, []);

  return (
    <div>
      <Hero />
      <Lauchbutton />
      <div className="pt-12 pl-8 flex space-x-12">
        {/* Container for image and overlay */}
        <div className="relative h-[700px] w-[750px] overflow-hidden rounded-lg group">
          {/* Image */}
          <img 
            src={imgvote} 
            alt="Vote" 
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Overlay with text */}
          <div className="absolute inset-0 bg-white bg-opacity-40 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-black/80 text-7xl mb-[380px] font-bold tracking-wider">Make Your Choice</p>
          </div>
        </div>
        
        {/* Ongoing Elections */}
        <div className="mt-8 w-[900px]">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Ongoing Elections</h2>
          <ul className="space-y-4">
            {elections.length > 0 ? (
              elections.map((election, index) => (
                <li
                  key={index}
                  className="bg-gray-100 p-4 rounded-lg shadow-sm flex justify-between items-center"
                >
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      Election ID: {election.electionID}
                    </h3>
                    <p className="text-gray-600">Description: {election.description}</p>
                    <div className="ml-[170px] flex">
                      <div className="h-[50px] w-[400px] mt-6 bg-gradient-to-r from-blue-500 to-blue-700 p-2 rounded-md flex justify-center ml-[40px]">
                        <Link
                          to={`/votenow/${election.electionID}`} // Pass the electionID in the URL
                          className="text-white tracking-wider text-2xl font-extrabold"
                        >
                          Vote Now
                        </Link>
                      </div>
                    </div>
                  </div> 
                </li>
              ))
            ) : (
              <p>No elections found.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
