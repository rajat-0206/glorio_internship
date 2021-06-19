import {React,useState} from "react";
import { Card, Col, Row,Badge } from 'antd';
import axios from "axios";



const buildBadge = (num,filled=[]) =>{
    let avail = [] 
    
    for(let i=1;i<=num;i++){
        if(filled.includes(i)){
        avail.push(<Badge count={i} size="large" className="slotbatch" key={i} />)
        }
        else{ 
        avail.push(<Badge count={i} size="large" className="available slotbatch" key={i} style={{ backgroundColor: '#52c41a' }} />)
        }
    }
    return <div className="buildingCard">{avail}</div>;
}
const HomePage = () =>{
   
return (
  <div className="site-card-wrapper">
    <Row gutter={16}>
      <Col span={8}>
        <Card title="Building A"     bordered={false}>
            Total SLot :10
            Available Slot:8
            {buildBadge(10,[1,2])}
        </Card>
      </Col>
      <Col span={8}>
        <Card title="Building B"  bordered={false}>
        Total SLot :20
        Available Slot:16
        {buildBadge(20,[3,4,8,12])}
        </Card>
      </Col>
      <Col span={8}>
        <Card title="Building C" bordered={false}>
        Total SLot :40
        Available Slot:40
        {buildBadge(40)}
        </Card>
      </Col>
    </Row>
  </div>
)

};

export default HomePage;