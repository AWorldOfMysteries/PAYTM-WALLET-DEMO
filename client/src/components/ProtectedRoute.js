import React, { useEffect } from 'react'
import { GetUserInfo } from '../apicalls/users'; 
import { message } from "antd";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { SetUser } from '../redux/usersSlice';
import DefaultLayout from './DefaultLayout';


function ProtectedRoute(props) {

    const {user} = useSelector(state => state.users)
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const getData = async () => {
      try {
        const response = await GetUserInfo();
        // console.log(response);
        if(response.success){
          dispatch(SetUser(response.data));
          // console.log(response.data);
        }
        else{
            message.error(response.message);
            navigate("/login")
        }
      } catch (error) {
        message.error(error.message);
      }
    };
  
    useEffect(() => {
      if(localStorage.getItem("token")){
        if(!user){
            // console.log("getData called")
            getData();
        }
      }
      else{
        navigate("/login")
      }
    }, []);  

    return user && (
        <div>
            <DefaultLayout>{props.children}</DefaultLayout>
        </div>
    )
}

export default ProtectedRoute