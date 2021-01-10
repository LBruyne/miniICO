import Funding from './Funding.json'
import web3 from './web3'

// 修改地址为合约所在区块内的地址
var contractAddr = "0x3637f5D183D481149a5445C508aEB51e3dea7FbA"
const FundingABI = Funding.abi

// 获取合约实例
// @ts-ignore
const contract = new web3.eth.Contract(FundingABI, contractAddr);

export default contract
