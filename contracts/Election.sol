pragma solidity ^0.4.17;

contract Election {
    // Model a Candidate
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }
    // Store Candidates
    mapping(uint => Candidate) public candidates;
    // Fetch Candidate
    // Store Candidates Count
    uint public candidatesCount;
    
    //Store accounts that has voted
    mapping(address => bool) public voters;
    
    // voted event
    event votedEvent (
        uint indexed _candidateId
    );
    
    function Election() public {
        candidatesCount = 0;
        addCandidate("Candidate 1");
        addCandidate("Candidate 2");
    }
    
    function addCandidate (string _name) private {
        candidatesCount ++;
        candidates[candidatesCount] = Candidate(candidatesCount,_name,0);
    }
    
    function vote (uint _candidateId) public {
        // address has not voted before
        require(!voters[msg.sender]);
        // voting for a valid candidate
        require(_candidateId > 0 && _candidateId <= candidatesCount);
        //record that voter has voted
        voters[msg.sender] = true;       
        // update candidate vote count
        candidates[_candidateId].voteCount++;
        // trigger voted events
        votedEvent(_candidateId);
    }
}   