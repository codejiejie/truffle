pragma solidity ^0.4.17;
// 这是一个库文件  也是合约   conversionRate 汇率    convertedAmount 转化后总额    amount  数量/总额
// 是由library声明的一个库，它只有一个方法，就是返回给定的两个无符整数值相乘的结果   有符（区分正负） 无符（只有整数）
library ConvertLib{
    function convert(uint amount,uint conversionRate) public pure returns (uint convertedAmount)
    {
        return amount * conversionRate;
    }
}
