import React,{useState} from "react";
import {Link} from "react-router-dom";
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import LoginUser from "../controller/login";
import { useContext } from 'react';
import jwt from 'jsonwebtoken'
import AppContext from './AppContext';


const LoginForm = () => {
  const myContext = useContext(AppContext);
  console.log(myContext);
   let [error,displayError] = useState(null);

  const onFinish = async (values) => {

    console.log('Received values of form: ', values);
    let data = await LoginUser(values);
    if(data.code===false){
      error = data.response;
      displayError(error);
       console.log(data.response);
  }
  else{
    displayError(" ");
    localStorage.setItem("token",data.token);
    let email = jwt.decode(data.token).email;
    myContext.setUser(email);
  }
  };

  return (
    <div className="coverBody">
      <div className="container">
          <h3 className="heading">Login</h3>

      <span className="error">{error===null?" ":error}</span>
    <Form
      className="login-form"
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
    >
       
      <Form.Item
        name="email"
        rules={[
          {
            required: true,
            message: 'Please input your Email!',
          },
        ]}
      >
        <Input prefix={<UserOutlined className="site-form-item-icon" />} type="email" placeholder="Email" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your Password!',
          },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button" >
          Login
        </Button>
        <br />
      <label>Or</label><br/> <Link to="/signup">register now!</Link>
      </Form.Item>
    </Form>
    </div>
    </div>
  );
};




export default LoginForm;