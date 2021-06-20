import {React,useState} from "react";
import { Card, Col, Row,Badge,Modal, Typography,Button} from 'antd';
import axios from "axios";
const {Text,Title} = Typography;




const HomePage = () =>{
  let [modalVisible,setModalVisible] = useState(false)
  let[modalValue,setModalValue] = useState(null)
  let[slotno,setSlot] = useState("Building A slot 1")

  const showTrueModal = () =>{

    setModalValue(true);
    setModalVisible(true);
  }

  const showFalseModal = () =>{

    setModalValue(false);
    setModalVisible(true);
  }

  const handleOk = () => {
    setModalVisible(false);
};

const handleCancel = () => {
  setModalVisible(false);
};

  const buildBadge = (num,filled=[]) =>{
    let avail = [] 
    
    for(let i=1;i<=num;i++){
        if(filled.includes(i)){
        avail.push(<Badge count={i} size="large" onClick={showFalseModal} className="slotbatch" key={i} />)
        }
        else{ 
        avail.push(<Badge count={i} size="large" onClick={showTrueModal} className="available slotbatch" key={i} style={{ backgroundColor: '#52c41a' }} />)
        }
    }
    return <div className="buildingCard">{avail}</div>;
}
   
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
    <Modal title="Slot Status" visible={modalVisible} onOk={handleOk} onCancel={handleCancel}>
                  <Typography >
                    <Text size="large" style={{"font-size":"24px","margin":"0px auto"}}>{slotno}</Text>
                    <div className="navbar" style={{"margin-top":"24px"}}>
                    <Text>{modalValue?"This slot is available to park":"This slot has a car already parked"}</Text>
                   {modalValue?<Button type="primary" className="actionBtn" size="small" >Park here</Button> : <Button type="danger" className="actionBtn" size="small" >Unpark Car</Button> }
                  </div>
                  </Typography>

                </Modal>
  </div>
)

};

export default HomePage;