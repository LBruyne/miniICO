import React,{Component} from 'react'
import { PageHeader, Tabs, Button, Statistic, Descriptions } from 'antd';

const { TabPane } = Tabs;

const renderContent = (column = 2) => (
    <Descriptions size="small" column={column}>
        <Descriptions.Item label="发起人">Lili Qu</Descriptions.Item>
        <Descriptions.Item label="众筹金额">
            <a>421421</a>
        </Descriptions.Item>
        <Descriptions.Item label="创建时间">2017-01-10</Descriptions.Item>
        <Descriptions.Item label="结束时间">2017-01-11</Descriptions.Item>
        <Descriptions.Item label="项目描述">
            Gonghu Road, Xihu District, Hangzhou, Zhejiang, China
        </Descriptions.Item>
    </Descriptions>
);

const extraContent = (
    <div
        style={{
            display: 'flex',
            width: 'max-content',
            justifyContent: 'flex-end',
        }}
    >
        <Statistic
            title="Status"
            value="Pending"
            style={{
                marginRight: 32,
            }}
        />
        <Statistic title="Price" prefix="$" value={568.08} />
    </div>
);

// @ts-ignore
const Content = ({ children, extra }) => (
    <div className="content">
        <div className="main">{children}</div>
        <div className="extra">{extra}</div>
    </div>
);

/**
 * footer
 */
interface IProps {
    campaign: any
}

class Card extends Component<IProps> {

    constructor(props: IProps) {
        super(props)
    }

    render() {
        let curTime = new Date().getTime() / 1000;  // 当前的时间，距1970年的秒数
        let campaign = this.props.campaign;
        let isRunning = "Ended";
        if(campaign.endTime > curTime && campaign.isSuccessful == false && campaign.isSuccessful == false)


        return (
            <div style={{boxShadow: "2px 2px 1px 2px #888", margin: "5px"}}>
                <PageHeader
                    className="site-page-header-responsive"
                    title={campaign.projectName}
                    subTitle={isRunning}
                    extra={[
                        <Button key="1" type="primary">
                            发起使用请求
                        </Button>,
                    ]}
                    footer={
                        <Tabs defaultActiveKey="1">
                            <TabPane tab="Details" key="1" />
                            <TabPane tab="Rule" key="2" />
                        </Tabs>
                    }
                >
                    <Content extra={extraContent}>{renderContent()}</Content>
                </PageHeader>
            </div>
        )
    }
}

export default Card