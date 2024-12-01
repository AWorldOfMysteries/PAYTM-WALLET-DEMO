import React from 'react';
import { Form, Row, Col, message} from 'antd';
import { useNavigate } from 'react-router-dom';
import { LoginUser } from '../../apicalls/users';

function Login() {
    const navigate = useNavigate();
    const onFinish = async (values) =>{
        try {
            const response = await LoginUser(values);
            if(response.success){
                message.success(response.message);
                localStorage.setItem("token", response.data);
                window.location.href = "/";
            }
            else{
                message.error(response.message);
            }
        } catch (error) {
            
        }
    }
  return (
    <div className='flex justify-center items-center bg-primary h-screen'>
        <div className='card w-400 p-2'>
            <div className='flex items-center justify-between'>
                <h1 className='text-2xl'>WALLET - REGISTER</h1>
            </div>
            <hr />
            
            <Form layout='vertical' onFinish={onFinish} className='w-400'>
                <Row>
                    <Col span={24}>
                        <Form.Item label='Email' name='email'>
                            <input type='text'/>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label='Password' name='password'>
                            <input type="password"/>
                        </Form.Item>
                    </Col>
                </Row>     
                <button className='primary-contained-btn w-100' type='submit'>Login</button>
                <h1 
                className='underline text-sm mt-2'
                onClick={() => navigate("/register")}
                >Not a member? Register</h1>
            </Form>
        </div>
    </div>
  )
}

export default Login