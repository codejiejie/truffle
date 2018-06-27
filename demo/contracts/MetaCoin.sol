pragma solidity ^0.4.17;

import "./ConvertLib.sol";

// This is just a simple example of a coin-like contract.  这是一个简单的仿币合约的例子
// It is not standards compatible and cannot be expected to talk to other 它并不是标准的可兼容其他币或者token的合约
// coin/token contracts. If you want to create a standards-compliant
// token, see: https://github.com/ConsenSys/Tokens. Cheers!
// MetaCoin的仿币的价格是以太币的一倍，所以是以以太币为标杆，通过智能合约发布的一个token,仿币

contract MetaCoin {
	// 创建了一个public状态变量，但是其类型更加复杂。该类型将一些address映射到无符号整数。
	// 由public关键字生成的访问函数，代码如下：
	// function balances(address _account) returns (uint balance) {
	//	return balances[_account];
	//}
	mapping (address => uint) balances;
	// 定义了一个映射类型变量balances，key为address类型，值为无符整型，应该用来存储每个账户的余额，可以存多个

	// 事件让轻客户端能高效的对变化做出反应

	event Transfer(address indexed _from, address indexed _to, uint256 _value);

	// 这个构造函数的代码只有在合约创建时被运行,之后就无法调用  它会永远的存储一些信息  （例如：它会永久得存储合约创建者的地址）
	// 找到【tx.origin (address): 交易发送方地址】会返回的交易发送方的地址，也就是说合约实例创建时会默认为当前交易发送方的余额是10000，单位是仿币
	function MetaCoin() public {
		// tx.origin (address): 交易发送方地址
		balances[tx.origin] = 10000;
	}

	function sendCoin(address receiver, uint amount) public returns(bool sufficient) {
		// 函数声明部分没有盲点，方法名，参数列表，函数可见性，返回值类型定义
		// msg（以及tx和block）是神奇的全局变量  它包含了一些可以被合约代码访问的属于区块链的属性  msg.sender总是存放着当前函数的外部调用者的地址
		// 信息的发送方 (当前调用)的余额没有要支付的总量多的时候  返回false(如果余额不足，则返回发送币失败)
		if (balances[msg.sender] < amount) return false;
		// 否则从发送者的余额中减去发送值，注意Solidity也有 '-=''+='运算符
		balances[msg.sender] -= amount;
		// 在接收者的余额中加入发送值数量
		balances[receiver] += amount; 
		Transfer(msg.sender, receiver, amount);
		return true;
	}

	// 关键字'public'可以使变量能从合约外部访问
	// 获取以太币余额  只读 
	function getBalanceInEth(address addr) public view returns(uint){
		// 调用了库中的方法
		return ConvertLib.convert(getBalance(addr),2);
	}

	// 夺取当前账户中的仿币余额
	function getBalance(address addr) public view returns(uint) {
		return balances[addr];
	}
}
