// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

pragma solidity ^0.7.1;

contract Escrow is Ownable, AccessControl {
    event Payment(address indexed addrFrom, address indexed addrTo, uint amount);
    
    mapping(address => uint) private _safe;

    function deposit() public payable {
        // Checks:
        require(msg.value > 0, "Escrow: cannot deposit zero");
        require(_safe[msg.sender] + msg.value > _safe[msg.sender], "Escrow: cannot deposit that amount");
        
        // Effects:
        _safe[msg.sender] += msg.value;
        
        // Interactions:
        // fn is payable so implicit address(this).call()
    }
    
    function withdraw(uint _amount) public {
        // Checks:
        require(_amount > 0, "Escrow: cannot withdraw zero");
        require(_safe[msg.sender] >= _amount, "Escrow: insufficient balance");
        require(_safe[msg.sender] - _amount < _safe[msg.sender], "Escrow: cannot withdraw that amount");
        
        // Effects:
        _safe[msg.sender] -= _amount;
        
        // Interactions:
        (bool _success, ) = msg.sender.call{ value: _amount, gas: gasleft() }("");
        require(_success, "Escrow: cannot withdraw: low-level call failed");
    }
    
    function pay(address _from, address _to, uint _amount) public onlyOwner {
        // Checks:
        require(_from != address(0) && _to != address(0), "Escrow: detected zero address");
        require(_safe[_from] >= _amount, "Escrow: insufficient _from balance");
        require(_safe[_from] - _amount < _safe[_from], "Escrow: overflow send _from");
        require(_safe[_to] + _amount > _safe[_to], "Escrow: overflow _to receive");
        
        // Effects:
        _safe[_from] -= _amount;
        _safe[_to] += _amount;
        
        // Interactions:
        emit Payment(_from, _to, _amount);
    }
}
