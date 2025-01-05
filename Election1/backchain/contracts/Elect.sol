// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Voting {
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    struct Election {
        uint256 electionID;
        string description;
        Candidate[] candidates;
        uint256 votingStart;
        uint256 votingEnd;
        uint256[] currentVoteCounts; // New variable for current vote counts
    }

    mapping(uint256 => Election) public electionDetails; // Mapping of electionID to Election
    uint256[] public electionIDs; // Array to keep track of all election IDs
    address owner;
    uint256 public nextElectionID = 1; // Starting from 1

    mapping(address => bool) public voters;

    constructor() {
        owner = msg.sender; // The contract deployer is the owner
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can perform this action.");
        _;
    }

    function launchElection(
        string memory _description,
        string[] memory _candidateNames,
        uint256 _durationInMinutes
    ) public onlyOwner {
        require(_candidateNames.length > 0, "At least one candidate is required.");

        Election storage newElection = electionDetails[nextElectionID];
        newElection.electionID = nextElectionID;
        newElection.description = _description;

        for (uint256 i = 0; i < _candidateNames.length; i++) {
            newElection.candidates.push(Candidate({name: _candidateNames[i], voteCount: 0}));
            newElection.currentVoteCounts.push(0); // Initialize vote counts to 0
        }

        newElection.votingStart = block.timestamp;
        newElection.votingEnd = block.timestamp + (_durationInMinutes * 1 minutes);

        electionIDs.push(nextElectionID); // Add the election ID to the array
        nextElectionID++;
    }

    function getTimeLeftFormatted(uint256 _electionID) public view returns (string memory) {
        require(_electionID > 0 && _electionID < nextElectionID, "Election ID does not exist.");

        Election storage election = electionDetails[_electionID];
        if (block.timestamp >= election.votingEnd) {
            return "00:00:00"; // Voting has ended
        }

        uint256 timeLeft = election.votingEnd - block.timestamp;
        uint256 hour = timeLeft / 3600;
        uint256 minute = (timeLeft % 3600) / 60;
        uint256 second = timeLeft % 60;

        return string(
            abi.encodePacked(
                _toTwoDigits(hour), ":", 
                _toTwoDigits(minute), ":", 
                _toTwoDigits(second)
            )
        );
    }

    function _toTwoDigits(uint256 value) internal pure returns (string memory) {
        // Ensure the value is two digits (e.g., 01, 09, 10)
        if (value < 10) {
            return string(abi.encodePacked("0", _uintToString(value)));
        }
        return _uintToString(value);
    }

    function _uintToString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }

    function getAllElectionDetails() public view returns (Election[] memory) {
        Election[] memory allElections = new Election[](electionIDs.length);

        for (uint256 i = 0; i < electionIDs.length; i++) {
            allElections[i] = electionDetails[electionIDs[i]];
        }

        return allElections;
    }
    function getCandidateDetailsByElectionID(uint256 _electionID) public view returns (string[] memory, uint256[] memory) {
    require(_electionID > 0 && _electionID < nextElectionID, "Election ID does not exist.");

    Election storage election = electionDetails[_electionID];
    uint256 candidateCount = election.candidates.length;

    string[] memory names = new string[](candidateCount);
    uint256[] memory voteCounts = new uint256[](candidateCount);

    for (uint256 i = 0; i < candidateCount; i++) {
        names[i] = election.candidates[i].name;
        voteCounts[i] = election.candidates[i].voteCount;
    }

    return (names, voteCounts);
}
event Voted(address indexed voter, uint256 electionID, uint256 candidateIndex);

function vote(uint256 _electionID, uint256 _candidateIndex) public {
    // Ensure the election exists
    require(_electionID > 0 && _electionID < nextElectionID, "Election ID does not exist.");

    Election storage election = electionDetails[_electionID];

    // Check if voting is within the allowed time
    require(block.timestamp >= election.votingStart, "Voting has not started yet.");
    require(block.timestamp <= election.votingEnd, "Voting period has ended.");

    // Ensure the voter has not voted in this election
    require(!voters[msg.sender], "You have already voted.");

    // Ensure the candidate index is valid
    require(_candidateIndex < election.candidates.length, "Invalid candidate index.");

    // Update the candidate's vote count
    election.candidates[_candidateIndex].voteCount += 1;

    // Mark the voter as having voted
    voters[msg.sender] = true;

    // Emit an event for voting activity (optional, but good for tracking votes off-chain)
    emit Voted(msg.sender, _electionID, _candidateIndex);
}

}
