/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import { useParams } from 'react-router-dom';
import './Style.css';
import {
  LinkButtons,
  updateButton,
  homeButton,
  loginButton,
  HeaderBar,
  forgotButton,
  inputStyle,
  SubmitButtons,
} from '../components';

const loading = {
  margin: '1em',
  fontSize: '24px',
};

const title = {
  pageTitle: 'Profile Verification Screen',
};



const VerifyProfile = () => {
  const [state, setState] = useState({
    username: '',
    password: '',
    email: '',
    updated: false,
    isLoading: true,
    error: false,
    documentUploaded: false,
    ekycVerified: false,
    pdffile: null,
    signature: null,
  });
  const params = useParams();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/verify`, {
          params: {
            verifyProfileToken: params.token,
          },
        });
        
        if (response.data.message === 'verification link a-ok') {
          setState({
            username: response.data.username,
            updated: false,
            isLoading: false,
            error: false,
          });
        }
      } catch (error) {
        console.log(error.response.data);
        setState({
          updated: false,
          isLoading: false,
          error: true,
        });
      }
    };

    fetchData();
  }, []);

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleChange = (name) => (event) => {
    setState({
      ...state,
      [name]: event.target.value,
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type === 'application/pdf') {
        console.log('File is a PDF');
        setState({...state, pdffile: file});
      } else {
        alert('Invalid file type. Please upload a PDF file.');
        setState({...state, pdffile: null});
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username,pdffile } = state;

    try {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('pdf', pdffile);
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/sign-pdf`, formData,{headers: {'Content-Type': 'multipart/form-data', }});
      
      
      if (response.status === 200) {
        setState({
          ...state,
          documentUploaded: true,
          error: false,
          signature: response.data.base64Signature,
        });
      } else {
        throw error;
      }
    } catch (error) {
      console.log(error.response.data);
      setState({
        ...state,
        documentUploaded: false,
        error: true,
      });
    }
  };
  const handleSubmitkyc = async (e) => {
    e.preventDefault();
    const { username,pdffile, signature, email, password } = state;

    try {
        const formData = new FormData();
        formData.append('verifyProfileToken', params.token);
        formData.append('username', username);
        formData.append('signature', signature);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('pdf', pdffile);
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/user-kyc`, formData,{headers: {'Content-Type': 'multipart/form-data', }});
      
      
      if (response.status === 200) {
        setState({
          ...state,
          ekycVerified: true,
          error: false,
          updated: true,
        });
      } else {
        throw error;
      }
    } catch (error) {
      console.log(error.response.data);
      setState({
        ...state,
        ekycVerified: false,
        error: true,
      });
    }
  };

  const { password, error, isLoading, updated, documentUploaded, ekycVerified, email } = state;

  if (error) {
    return (
      <div>
        <HeaderBar title={title} />
        <div style={loading}>
          <h4>Problem Verifying Profile. Please try again or send another reset link.</h4>
          <LinkButtons buttonText="Go Home" buttonStyle={homeButton} link="/" />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div>
        <HeaderBar title={title} />
        <div style={loading}>Loading User Data...</div>
      </div>
    );
  }

  return (
    <div>
      <HeaderBar title={title} />
      {!documentUploaded && !ekycVerified && (
        <form className="doc-form mt-5" onSubmit={handleSubmit}>
          <input type="file" accept=".pdf" onChange={handleFileChange} required/><br></br>
          <input type="checkbox" required/>By Clicking this button you are providing your consent and agree to all terms and conditions.<br/>
          <SubmitButtons buttonStyle={updateButton} buttonText="Upload Document" />
        </form>
      )}
      {documentUploaded && !ekycVerified && <div className='row justify-content-center my-auto'>
        <form className="doc-form mt-5 form-group col-md-8 col-10 my-2" onSubmit={handleSubmitkyc}>
          <h3 className="text-white">e-kyc credentials</h3>
          <input 
            type="email"
            id="email"
            name="email"
            placeholder="Email ID"
            className="form-control"
            value={email}
            onChange={handleChange('email')} required/>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            className="form-control"
            value={password}
            onChange={handleChange('password')} required/>
          <SubmitButtons buttonStyle={updateButton} buttonText="Complete e-kyc" />
        </form>
        </div>}

      {updated && (
        <div>
          <p>Your Profile has been successfully verified, please try logging in again.</p>
          <LinkButtons buttonStyle={loginButton} buttonText="Login" link="/login" />
        </div>
      )}
      <LinkButtons buttonText="Go Home" buttonStyle={homeButton} link="/" />
    </div>
  );
};

VerifyProfile.propTypes = {
  params: PropTypes.shape({
    token: PropTypes.string.isRequired,
  }),
};

export default VerifyProfile;
