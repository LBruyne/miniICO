// @ts-nocheck
import React,{Component} from 'react'
import {PageHeader, Tabs, Button, Statistic, Descriptions, Tag, Modal, Input, Form, message} from 'antd';
import contract from "../../utils/contracts";
import web3 from "../../utils/web3";

const { TabPane } = Tabs;

/**
 * footer
 */
interface IProps {
    campaign: any
    use: any
}

class CardMyInvolved extends Component<IProps> {

    constructor(props: IProps) {
        super(props)
    }

    state = {
        isConnected: false,
        address: "",
        tabInUse: 1
    }

    async componentDidMount() {
        let accounts = await web3.eth.getAccounts()
        if (accounts.length == 0) {
            this.setState({
                isConnected: false
            })
        }
        else {
            await this.setState({
                isConnected: true,
                address: accounts[0]
            })
        }
    }

    renderCampaignContent = (column = 2) => (
        <Descriptions size="small" column={column}>
            <Descriptions.Item label="发起人">{this.props.campaign.manager}</Descriptions.Item>
            <Descriptions.Item label="众筹金额">
                <a>{this.props.campaign.targetMoney} ETH</a>
            </Descriptions.Item>
            <Descriptions.Item label="参与人数">{this.props.campaign.numFunders}</Descriptions.Item>
            <Descriptions.Item label="已筹金额">
                <a>{this.props.campaign.collectedMoney} ETH</a>
            </Descriptions.Item>
            <Descriptions.Item label="创建时间">{this.props.campaign.startTime}</Descriptions.Item>
            <Descriptions.Item label="结束时间">{this.props.campaign.endTime}</Descriptions.Item>
            <Descriptions.Item label="项目描述">
                {this.props.campaign.projectDescription}
            </Descriptions.Item>
        </Descriptions>
    );

    renderUseContent = (column = 2) => (
        <Descriptions size="small" column={column}>
            <Descriptions.Item label="发起人">{this.props.campaign.manager}</Descriptions.Item>
            <Descriptions.Item label="众筹金额">
                <a>{this.props.campaign.targetMoney} ETH</a>
            </Descriptions.Item>
            <Descriptions.Item label="参与人数">{this.props.campaign.numFunders}</Descriptions.Item>
            <Descriptions.Item label="使用金额">
                <a>{this.props.use.amount} ETH</a>
            </Descriptions.Item>
            <Descriptions.Item label="同意者所持股份">{(this.props.use.agreeAmount / this.props.campaign.targetMoney).toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="同意人数">{this.props.use.numVote}</Descriptions.Item>
            <Descriptions.Item label="使用描述">
                {this.props.use.useDescription}
            </Descriptions.Item>
        </Descriptions>
    );

    // @ts-ignore
    Content = ({ children }) => (
        <div className="content">
            <div className="main" >{children}</div>
        </div>
    );

    async vote(b: boolean){
        let id = this.props.campaign.index;
        try {
            let ret = await contract.methods.agreeUse(id, b).send({
                from: this.state.address,
                gas: 1000000
            })
            message.success('成功完成投票!');
            window.location.href = '/home';
        }
        catch(e){
            message.error('投票失败，请检查！');
        }
    }

    render() {
        let campaign = this.props.campaign;
        let campaignState;
        let tagColor;

        if(campaign.state == 1 || campaign.overTime == true) {
            campaignState = "Failed";
            tagColor = "red";
        }
        else if(campaign.state == 2) {
            campaignState = "Completed";
            tagColor = "green";
        }
        else {
            campaignState = "进行中";
            tagColor = "blue";
        }

        let isVotable = () => {
            // 如果项目已经结束或者还不能开始投票
            if(campaignState != 4)
                return false;

            // 该用户是否投过票
            let hasVoted = await contract.methods.checkIsVoted(i).call();
            return !hasVoted;
        }

        return (
            <div style={{boxShadow: "2px 2px 1px 2px #888", margin: "5px"}}>
                <PageHeader
                    className="site-page-header-responsive"
                    title={campaign.projectName}
                    tags={<Tag color={tagColor}>{campaignState}</Tag>}
                    extra={[
                        <div>
                            <Button key="1" style={{marginRight:"10px"}} type="primary" disabled={!isVotable()} onClick={() => {
                                this.vote(true)
                            }}>
                                同意使用请求
                            </Button>
                            <Button key="2" type="primary" danger disabled={!isVotable()} onClick={() => {
                                this.vote(false)
                            }}>
                                拒绝使用请求
                            </Button>
                        </div>
                    ]}
                    footer={
                        <Tabs defaultActiveKey="1" onChange={this.onTabChange}>
                            <TabPane tab="募集" key="1" />
                            <TabPane tab="使用" disabled={!(campaign.state == 2 || campaign.state == 4)} key="2" />
                        </Tabs>
                    }
                >
                    {this.state.tabInUse==1&&<this.Content >{this.renderCampaignContent()}</this.Content>}
                    {this.state.tabInUse==2&&<this.Content >{this.renderUseContent()}</this.Content>}
                </PageHeader>
            </div>
        )
    }

    onTabChange = (activeKey: any) => {
        this.setState({
            tabInUse: activeKey
        })
    };
}

export default CardMyInvolved