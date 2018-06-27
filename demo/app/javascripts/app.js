// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
// 引用web3
import { default as Web3} from 'web3';
// 引用truffle-contract
import { default as contract } from 'truffle-contract'
// truffle-contract是用来与以太智能合约交互的JavaScript库，相对于web3.js来说更方便一点

// Import our contract artifacts and turn them into usable abstractions. 导入我们的合同文件并将它们转化成可用的抽象层
// 合约ABI 合约ABI在编译的json文件中
import metacoin_artifacts from '../../build/contracts/MetaCoin.json'

// MetaCoin is our usable abstraction, which we'll use through the code below.
// 通过ABI 初始化合约对象
var MetaCoin = contract(metacoin_artifacts);

// The following code is simple to show off interacting with your contracts. 下面代码简单的显示与合同的交互
// As your needs grow you will likely need to change its form and structure. 随着你的需求的增长，你可能需要改变它的形式和结构。
// For application bootstrapping, check out window.addEventListener below.  对于应用程序的引导，下面的window监听事件检验。
var accounts;
var account;

window.App = {
  start: function() {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    // provider 供应商 一个服务或者活动的提供者
    // 连接到以太坊节点
    MetaCoin.setProvider(web3.currentProvider);
    // console.log(web3.currentProvider);
    // console.log(web3.providers);
    // Get the initial account balance so it can be displayed. 获取初始账户余额，以便显示它
    web3.eth.getAccounts(function(err, accs) {
      console.log(accs);
      if (err != null) {
        // 在你的账户上抓取到一个错误
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        // 不能得到任何账号!确保您的Ethereum客户端配置正确。
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }
      // 账户列表
      accounts = accs;
      // 默认账户
      account = accounts[1];
      // console.log(account);
      self.refreshBalance();
    });
  },

  // 进行操作提示
  setStatus: function(message) {
    var status = document.getElementById("status");
    status.innerHTML = message;
  },

  // 更新余额
  refreshBalance: function() {
    var self = this;

    var meta;
    //通过默认地址的合约地址获取MetaCoin合约实例  instance 实例
    MetaCoin.deployed().then(function(instance) {
      // console.log(instance);
      // 在.then链式调用中，回调函数会在参数中获取到合约实例instance，在回调函数中使用合约实例调用getBalance函数，再通过.then链式调用，获得返回值
      meta = instance;
      return meta.getBalance.call(account, {from: account});
    }).then(function(value) {
      var balance_element = document.getElementById("balance");
      balance_element.innerHTML = value.valueOf();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error getting balance; see log.");
    });
  },

  // 发送仿币
  sendCoin: function() {
    var self = this;

    var amount = parseInt(document.getElementById("amount").value);
    var receiver = document.getElementById("receiver").value;

    // 交易启动
    this.setStatus("Initiating transaction... (please wait)");

    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      // 使用合约实例上的sendCoin方法 向区块链发送了一笔交易
      return meta.sendCoin(receiver, amount, {from: account});
    }).then(function(result){
      // console.log(result);
      // 这个回调函数在交易生效之后才会执行
      // result对象包含一下三个字段：
      // result.tx => 交易hash，是一个string
      // result.receipt => 交易执行结果，是一个对象
      // result.logs => 交易产生的事件集合，是一个对象数组
      // console.log(result);
      // result.logs是一个数组，数组的每个元素是一个事件对象
      // 通过查询result.logs可以获得感兴趣的事件
      for (var i = 0; i < result.logs.length; i++) {
        var log = result.logs[i];
        if (log.event == "Transfer") {
            console.log("from:", log.args._from);
            console.log("to:", log.args._to);
            console.log("amount:", log.args._value.toNumber());
            break;
        }
      }
    }).then(function() {
      self.setStatus("Transaction complete!");
      self.refreshBalance();
    }).then(function() {
      console.log(web3.eth.getBalance(account));
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error sending coin; see log.");
    });
  }
};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask) 检查Web3是否被浏览器注入
  // 如果浏览器中有web3 直接使用
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
  }

  App.start();
});
