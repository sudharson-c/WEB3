// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract STC {
    
    string public tokenName = "STC";
    string public symbol = "SON";
    uint8 public decimals = 18;
    uint256 public totalSupply = 1000000 * (10 ** uint256(decimals));

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping (address=>uint256)) public allowances;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor(){
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(address _to,uint256 _value) public  returns (bool success){
        require(_value <= balanceOf[msg.sender], "Not sufficient funds");
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }
    function allowance(address _spender,uint256 _value) public  returns (bool success){
        allowances[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }
    function transferFrom(address _from ,address _to,uint256  _value)public returns (bool success){
        require(_value <= balanceOf[_from],"Insufficient balance");
        require(_value <= allowances[_from][_to],"Limit exceeded");

        balanceOf[_to] += _value;
        balanceOf[_from] -= _value;
        allowances[_from][_to] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    }


}
