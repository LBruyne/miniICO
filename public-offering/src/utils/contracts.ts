import Funding from './Funding.json'
import web3 from './web3'

// 修改地址为合约所在区块内的地址
var contractAddr = "0xb286Efc0B48B0179795B926065B0c2247E3E9e06"
const FundingABI = Funding.abi

// 获取合约实例
// @ts-ignore
const contract = new web3.eth.Contract(FundingABI, contractAddr);

export default contract
