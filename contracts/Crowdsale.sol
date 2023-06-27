// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

import "./Token.sol";
contract Crowdsale {
    
    address public owner;
    Token public token;
    uint256 public price;
    uint256 public maxTokens;
    uint256 public tokenSold;

    mapping(address => bool) public whitelist;

    event Buy(uint256 amount, address buyer);
    event Finalize(uint256 tokenSold, uint256 ethRaised);

    constructor(Token _token, uint256 _price, uint256 _maxTokens) {
        owner = msg.sender;
        token = _token;
        price = _price;
        maxTokens = _maxTokens;
     //   whitelist[msg.sender] = true;
    }

    modifier onlyOnwer(){
        require(msg.sender == owner, 'Caller is not the owner');
        _;
    }

    receive() external payable {
         uint256 amount = msg.value / price;
         buyTokens(amount * 1e18);
    }

    function whitelistAdd(address _address) public onlyOnwer {
        whitelist[_address] = true;
    }

    function buyTokens(uint256 _amount) public payable{
        require(whitelist[msg.sender], 'Account is not whitelisted');
        require(msg.value == (_amount/1e18) * price);
        require(token.balanceOf(address(this)) >= _amount);
        require(token.transfer(msg.sender, _amount));

        tokenSold += _amount ;
        emit Buy(_amount, msg.sender);
    }

    function setPrice(uint256 _price) public onlyOnwer {
        price = _price;
    }

    function finalize() public onlyOnwer {
        require(token.transfer(owner, token.balanceOf(address(this))));        
        uint256 value = address(this).balance;
        (bool sent, ) = owner.call{value: value }("");
        require(sent);
        
        emit Finalize(tokenSold, value);
    }

}

