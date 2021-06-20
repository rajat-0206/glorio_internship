import { React, useState } from "react";
import { Card, Col, Row, Badge, Modal, Typography, Button, Spin } from 'antd';
import axios from "axios";
import { build } from "joi";
const { Text, Title } = Typography;




const HomePage = () => {
  let [modalVisible, setModalVisible] = useState(false)
  let [modalValue, setModalValue] = useState(null)
  let building = "";
  let slot = "";
  var buildingData = "";


  let [loading, changeLoading] = useState(true);
  var main = "";


  let build = () => {
    if (loading) {
      try {
        buildingData = JSON.parse(localStorage.getItem("buildings"));
        changeLoading(false);
      } catch (e) {
        console.log(e)
        console.log("no building data");
      }
    }
  }
  const showModal = (name, slot, value = true) => {


    building = name;
    slot = slot;
    setModalValue(value);
    setModalVisible(true);
  }

  const parkCar = (name, slotno) => {
    axios.post("http://localhost:5000/parkcar", {
      "building": name,
      "slot": slotno,
    });
  }

  const unparkCar = (objectid) => {
    axios.post("http://localhost:5000/unparkcar", {
      "bookingid": objectid,
    });
  }

  const handleOk = () => {
    setModalVisible(false);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const buildBadge = (name, num, filled = []) => {
    let avail = []

    for (let i = 1; i <= num; i++) {
      if (filled.includes(i)) {
        avail.push(<Badge count={i} size="large" onClick={() => showModal(name, i, false)} className="slotbatch" key={i} />)
      }
      else {
        avail.push(<Badge count={i} size="large" onClick={() => showModal(name, i, true)} className="available slotbatch" key={i} style={{ backgroundColor: '#52c41a' }} />)
      }
    }
    return <div className="buildingCard">{avail}</div>;
  }

  let cards = () => {
    console.log(buildingData);
    let buildings = [];
    buildingData.forEach((ele) => {
      <Col span={8}>
        <Card title={ele.name} bordered={false}>
          Total SLot :{ele.total_slots}
          Available Slot:{ele.available_slots}
          {buildBadge(ele.name, ele.total_slots, ele.filled)}
        </Card>
      </Col>
    })
    return (
      <div className="site-card-wrapper">
        < Row gutter={16} >
          {buildings}
        </Row >
        {cards}
        <Modal title="Slot Status" visible={modalVisible} onOk={handleOk} onCancel={handleCancel}>
          <Typography >
            <Text size="large" style={{ "font-size": "24px", "margin": "0px auto" }}>{building} {slot}</Text>
            <div className="navbar" style={{ "margin-top": "24px" }}>
              <Text>{modalValue ? "This slot is available to park" : "This slot has a car already parked"}</Text>
              {modalValue ? <Button type="primary" className="actionBtn" size="small" onClick={() => parkCar(building, slot)} >Park here</Button> : <Button type="danger" className="actionBtn" size="small" onClick={() => unparkCar("objectid")} >Unpark Car</Button>}
            </div>
          </Typography>
        </Modal>
      </div>
    )
  }



  build()
  return (<div>{loading ? <Spin size="large" className="displayMiddle" /> :<cards />}</div>)
};

export default HomePage;