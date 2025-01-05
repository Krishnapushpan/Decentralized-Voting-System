import React, { useState, useEffect } from 'react';
import Hero from '../components/hero';
import ABI from '../assets/Voting.json';
import address from '../assets/deployed_addresses.json';
import { ethers } from 'ethers';

const ViewVoted = () => {
    const [signerAddress, setSignerAddress] = useState("");
    const [elections, setElections] = useState([]);
    const [feedback, setFeedback] = useState("Please connect to MetaMask to view your voted elections.");
    const [candidates, setCandidates] = useState([]);
    const [electionID, setElectionID] = useState(null);

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
            setFeedback(""); // Clear feedback upon successful connection
        } catch (error) {
            console.error("Error connecting to MetaMask:", error);
            setFeedback("Failed to connect to MetaMask. Please try again.");
        }
    }

    // Fetch elections
    async function fetchElections() {
        try {
            if (!window.ethereum) {
                setFeedback("MetaMask is not installed!");
                return;
            }

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contractABI = ABI.abi;
            const contractAddress = address["ElectModule#Voting"];
            const contract = new ethers.Contract(contractAddress, contractABI, signer);

            const votedElectionsRaw = await contract.getElectionsVotedByUser();
            const votedElections = votedElectionsRaw.toArray ? votedElectionsRaw.toArray() : Array.isArray(votedElectionsRaw) ? votedElectionsRaw : Array.from(votedElectionsRaw || []);

            if (votedElections.length === 0) {
                setFeedback("You haven't voted in any elections yet.");
                setElections([]);
                return;
            }

            const electionDetails = await Promise.all(
                votedElections.map(async (electionID) => {
                    const details = await contract.electionDetails(electionID);

                    if (!details) {
                        console.error(`No details found for election ID: ${electionID}`);
                        return null;
                    }

                    return {
                        electionID: electionID.toString(),
                        description: details.description || "No description available",
                        votingStart: Number(details.votingStart),
                        votingEnd: Number(details.votingEnd),
                        candidates: (details.candidates || []).map((candidate) => ({
                            name: candidate?.name || "Unknown",
                            voteCount: candidate?.voteCount?.toString() || "0",
                        })),
                    };
                })
            );

            const filteredElections = electionDetails.filter((election) => election !== null);
            setElections(filteredElections);
            setFeedback(""); // Clear feedback on success

        } catch (error) {
            console.error("Error fetching voted elections:", error);
            setFeedback("Error loading voted elections. Please try again.");
        }
    }

    // Fetch candidates
    async function fetchCandidates(electionID) {
        try {
            setCandidates([]); // Reset candidates state for each new election
            setElectionID(electionID);

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

    // Automatically fetch elections when MetaMask is connected
    useEffect(() => {
        if (signerAddress) {
            fetchElections();
        }
    }, [signerAddress]);

    return (
        <div>
            <Hero /><p class="text-green-600 ml-[180px] mt-12">Make sure you are connected to MetaMask.</p>
            <div className="ml-[50px] flex">
                <div className="h-[50px] w-[400px] mt-6 bg-gradient-to-r from-blue-500 to-blue-700 p-2 rounded-md flex justify-center ml-[130px]">
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
            <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold mb-4">Your Voted Elections</h2>
    {feedback && <p class="text-green-600 mb-4">{feedback}</p>}
    <ul class="grid grid-cols-3 gap-4">
        {elections.map((election, index) => (
            <li key={index} class="p-4 bg-gray-100 rounded-lg shadow-md">
                <p class="text-lg font-medium"><strong>Election ID:</strong> {election.electionID}</p>
                <p><strong>Description:</strong> {election.description}</p>
                <p><strong>Voting Start:</strong> {new Date(election.votingStart * 1000).toLocaleString()}</p>
                <p><strong>Voting End:</strong> {new Date(election.votingEnd * 1000).toLocaleString()}</p>
                <button 
                    onClick={() => fetchCandidates(election.electionID)} 
                    class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                    View Candidates
                </button>
                {electionID === election.electionID && candidates.length > 0 && (
                    <div class="col-span-3 mt-4">
                        <table class="min-w-full border-collapse border border-gray-300 shadow-md rounded-lg">
                            <thead class="bg-gradient-to-r from-blue-500 to-blue-700 text-white">
                                <tr>
                                    <th class="border border-gray-300 p-2">Index No</th>
                                    <th class="border border-gray-300 p-2">Candidate Name</th>
                                    <th class="border border-gray-300 p-2">Votes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {candidates.map(candidate => (
                                    <tr key={candidate.index}>
                                        <td class="border border-gray-300 p-2">{candidate.index}</td>
                                        <td class="border border-gray-300 p-2">{candidate.name}</td>
                                        <td class="border border-gray-300 p-2">{candidate.votes}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </li>
        ))}
    </ul>
</div>
        </div>
    );
};

export default ViewVoted;
