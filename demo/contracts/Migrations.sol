pragma solidity ^0.4.17;
// 将之前运行移植的历史记录  记录到区块链上
contract Migrations {
  // 这行代码声明了一个可公开访问的状态变量，类型为address。address类型的值大小为160bits，不支持任何算术操作。适用于存储合约的地址或者他人的公私匙。public关键字会自动为其修饰成访问函数。
  // 没有public关键字的变量将无法被其他合约访问。另外只有本合约内的代码才能写入
  // 自动生成的函数如下：‘function owner() returns (address) {return minter}’
  address public owner;
  // 有一个任意访问的全局变量，存储于storage的地址类型变量owner
  // 有一个可以任意访问的全局变量，存储于storage的无符号整数类型的变量
  uint public last_completed_migration;

  // modifier的使用方法，可以自动改变函数的行为 假如给它预设一个条件，它会不断检查，一旦符合条件即可走预设分支。它可以影响当前合约以及派生合约
  // 这里的方法体为'_;',这意味着如果owner调用了这个函数，函数会被执行，其他人调用会抛出一个异常
  modifier restricted() {
    if (msg.sender == owner) _;
  }

  function Migrations() public {
    // 初始化将发送方赋值给owner保存
    owner = msg.sender;
  }

  // restricted 受限制的 保密的  是方法名  在其下想增加该modifier功能的函数中，都使用了public restricted的方式来声明
  function setCompleted(uint completed) public restricted {
    last_completed_migration = completed;
  }

  // public是函数可见性修饰符，restricted是自定义的限制访问的modifier方法，他们都是关于函数使用限制方面的，可以看作一个括号将他俩括起来，占一个位置（public）
  function upgrade(address new_address) public restricted {
    Migrations upgraded = Migrations(new_address);
    upgraded.setCompleted(last_completed_migration);
  }
}
