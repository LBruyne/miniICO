import React, {Component} from "react";
import { List } from "antd";
import Card from "../../../components/card";

import web3 from "../../../utils/web3";
import contract from "../../../utils/contracts";

class MyCampaignTab extends Component {

    state ={
        myCampaigns: [],
        myCampaignsNum: 0,
        isConnected: false,
        address: ""
    }

    async componentDidMount() {
        let accounts = await web3.eth.getAccounts()
        if(accounts.length == 0) {
            this.setState({
                isConnected: false
            })
        }
        else {
            await this.setState({
                isConnected: true,
                address: accounts[0]
            })
            let numCampaigns = await contract.methods.numCampaigns().call();
            let campaigns = [];
            let num = 0;
            for(let i = 0; i < numCampaigns; i++) {
                const data = await contract.methods.campaigns(i).call();
                data["index"] = i;
                if(data.manager == this.state.address) {
                    campaigns.push(data);
                    num++;
                }
            }
            this.setState({
                myCampaigns: campaigns,
                myCampaignsNum: num
            })
            console.log(numCampaigns);
            console.log(this.state.myCampaigns);
        }
    }

    render() {
        // @ts-ignore
        return (
            <List
                itemLayout="horizontal"
                dataSource={this.state.myCampaigns}
                renderItem={(item) => (
                    <List.Item>
                        <Card campaign={item}/>
                    </List.Item>
                )}
            />
        )
    }
}

export default MyCampaignTab;