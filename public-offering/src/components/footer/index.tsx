import React,{Component} from 'react'
import { Layout } from 'antd'
const { Footer } = Layout;

/**
 * footer
 */
class WebFooter extends Component {

    render() {
        return (
            <Footer style={{ textAlign: 'center' }}> ©2021 Created HinsLiu - Course Material in ZJU Blockchain course</Footer>
        )
    }
}

export default WebFooter