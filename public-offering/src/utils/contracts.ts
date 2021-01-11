import Funding from './Funding.json'
import web3 from './web3'

// 修改地址为合约所在区块内的地址
var contractAddr = "0x73cF6a72d9F052b38dE6611240E151D8e2a11ebE"
const FundingABI = Funding.abi

// 获取合约实例
// @ts-ignore
const contract = new web3.eth.Contract(FundingABI, contractAddr);

export default contract
