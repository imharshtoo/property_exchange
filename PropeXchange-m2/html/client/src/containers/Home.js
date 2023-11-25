import React, { useState, useEffect } from 'react';
import {
  HeaderBar,
  LinkButtons,
  loginButton,
  registerButton,
} from '../components';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const title = {
  pageTitle: 'Home Screen',
};
const loading = {
  margin: '1em',
  fontSize: '24px',
};
const Home = () => {
  const [userData, setUserData] = useState({
    username: '',
    error: false,
    isLoading: true,
  });
  useEffect(() => {
    const accessString = localStorage.getItem('JWT');
    const user_name = localStorage.getItem('UserName');
    if (accessString == null) {
      setUserData({
        isLoading: false,
        error: true,
      });
    } else {
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/findUser`, {
          params: {
            username:user_name,
          },
          headers: { Authorization: `JWT ${accessString}` },
        })
        .then((response) => {
          setUserData({
            username: response.data.username,
            isLoading: false,
            error: false,
          });
        })
        .catch((error) => {
          console.error(error.response.data);
          localStorage.removeItem('JWT');
          localStorage.removeItem('UserName');
          setUserData({
            error: true,
          });
        });
    }
  }, []);
  if (userData.isLoading) {
    return (
      <div>
        <HeaderBar title={title} />
        <div style={loading}>Loading Data...</div>
      </div>
    );
  }
  if(!userData.error && userData.username!=='' && userData.username!==null && userData.username!==undefined){
    return(
      <Navigate to={`/${userData.username}/home`}/>
    );
  }
  return (
  <div className="home-page">
    <HeaderBar title={title} />
    <LinkButtons
      buttonText="Register"
      buttonStyle={registerButton}
      link="/register"
    />
    <LinkButtons buttonText="Login" buttonStyle={loginButton} link="/login" />
  </div>
)};

export default Home;
