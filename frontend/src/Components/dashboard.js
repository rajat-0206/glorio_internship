import { React, useState, useContext } from "react";
import { Layout, Menu, Breadcrumb, Button, Tooltip, Typography, Statistic, Col, Divider, Modal, Form, Input } from 'antd';
import { BrowserRouter as Router, Redirect, Route, Switch, Link } from "react-router-dom";
import HistoryPage from "./HistoryPage";
import HomePage from "./HomePage";
import { HomeOutlined, HistoryOutlined, LogoutOutlined, PlusCircleOutlined, UserOutlined } from '@ant-design/icons';
import axios from "axios";
import AppContext from './AppContext';
const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;


const Dashboard = () => {
    const myContext = useContext(AppContext);



    const getData = async () => {
        let token = localStorage.getItem("token");
        let data = await axios.get("http://localhost:5000/dashboard", {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log(data.data);
    }

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [homeVisible, setIsHomeVisible] = useState(true);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const showHome = ()=>{
        console.log("rajat");
        setIsHomeVisible(true);
    }

    const showHistory = ()=>{
        setIsHomeVisible(false);
    }

    const handleOk = () => {
        setIsModalVisible(false);
        console.log(showHome);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const onFinish = async (values) => {

        console.log('Received values of form: ', values);

    }

    const logout = () => {
        localStorage.clear("token");
        myContext.setUser(null);
        Redirect("/");

    }

    return (
        <Layout>
            <Header className="navbar" style={{ position: 'fixed', zIndex: 1, width: '100%', height: "65px" }}>
                <span className="companyName">Car Paking System</span>
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
                    <Menu.Item key="1" onClick={showHome}><HomeOutlined /> Home</Menu.Item>
                    <Menu.Item key="2"  onClick={showHistory}><HistoryOutlined /> History</Menu.Item>
                </Menu>
                <div>
                    <Tooltip placement="leftBottom" title="Add Balance">
                        <Button type="primary" className="actionBtn" onClick={showModal} icon={<PlusCircleOutlined />} size="large" />
                    </Tooltip>
                    <Tooltip placement="leftBottom" title="Logout">
                        <Button type="danger" className="actionBtn" onClick={logout} icon={<LogoutOutlined />} size="large" />
                    </Tooltip>
                </div>
            </Header>
            <Content className="site-layout mainsec" style={{ padding: '0 50px', marginTop: 64 }}>
                <div className="site-layout-background navbar" style={{ padding: 24 }}>
                    <Typography style={{ "float": "left" }}>
                        <Title> <UserOutlined /> Rajat Shrivastava</Title>

                    </Typography>
                    <Col>
                        <Statistic title="Account Balance" value={"₹ 1100"} precision={2} />
                    </Col>
                </div>
                <Divider />
                {homeVisible? <HomePage  />:<HistoryPage/>}
               
                
                <Modal title="Basic Modal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                    <Form
                        className="modal-form"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                    >

                        <Form.Item
                            name="Amount"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter the amount to be added!',
                                },
                            ]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} type="Number" min="0" placeholder="Amouunt" />
                        </Form.Item>
                    </Form>
                </Modal>
            </Content>
            <Footer style={{ textAlign: 'center', height: "40px" }}>©2021 Created by Rajat Shrivastava</Footer>
        </Layout>
    )
}

export default Dashboard;