import Funding from '../../../contracts/build/contracts/Funding.json'
import Web3 from 'web3'

// 创建web3实例
// @ts-ignore
const web3 = new Web3(window.ethereum);

var contractAddr = "0x3637f5D183D481149a5445C508aEB51e3dea7FbA"
const FundingABI = Funding.abi

// @ts-ignore
const contract = new web3.eth.Contract(FundingABI, contractAddr);

export declare interface Funder {
    address: string,
    amount: number
}

export declare interface Campaign {
    index: number,
    projectName: string,
    projectDescription: string,
    targetMoney: number,
    endTime: number,
    manager: string,
    isUsed: boolean,
    isSuccessful: boolean,
    collectedMoney: number,
    numFunders: number,
}

export declare interface Use {
    index: number,
    useDescription: string,
    amount: number,
    agreeAmount: number,
    numVote: number,
    isSuccessful: boolean,
    agree: number // 0: 没决定，1同意，2不同意
}

async function authenticate() {
    //@ts-ignore
    await window.ethereum.enable();
}

async function getAccount() {
    return (await web3.eth.getAccounts())[0];
}

async function getAllCampaigns() : Promise<Campaign[]> {
    const length = await contract.methods.numCampaigns().call();
    const result = [];
    for(let i = 0; i < length; i++) {
        result.push(await getOneCampaign(i));
    }
    return result;
}

async function getOneCampaign(index:number) : Promise<Campaign> {
    const data = await contract.methods.campaigns(index).call();
    return {index, ...data};
}

export {
    authenticate,
    getAccount,
    getAllCampaigns,
    getOneCampaign
}