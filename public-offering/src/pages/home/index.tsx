import React, {Component} from 'react';

import { Layout, Tabs } from 'antd';

import MyCampaignTab from "./my-campaign";

const { Content } = Layout;
const { TabPane } = Tabs;

class HomePage extends Component {
    render() {
        return (
            <Content style={{ padding: '50px', height: window.outerHeight }}>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="所有项目" key="1">
                        Content of Tab Pane 1
                    </TabPane>
                    <TabPane tab="我发起的项目" key="2">
                        Content of Tab Pane 2
                    </TabPane>
                    <TabPane tab="我参与的项目" key="3">
                        <MyCampaignTab />
                    </TabPane>
                </Tabs>
            </Content>
        )
    }
}

export default HomePage;