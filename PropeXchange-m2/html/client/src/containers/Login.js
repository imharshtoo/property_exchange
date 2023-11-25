/* eslint-disable no-console */
import React, { Component } from 'react';
import { Navigate, Link } from 'react-router-dom'; 
import axios from 'axios';
import './Style.css';
import AuthCode from 'react-auth-code-input';

// eslint-disable-next-line
const title = {
  pageTitle: 'Login Screen',
};

class Login extends Component {
  constructor() {
    super();

    this.state = {
      username: '',
      password: '',
      loggedIn: false,
      showError: false,
      showNullError: false,
      requestOTP: true,
      otp: '',
      errorMesssage: '',
    };
  }
  
  handleChange = name => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleOnChange = (value) => {
    this.setState({ otp: value });
  };

  loginUser = async (e) => {
    e.preventDefault();
    const {
 username, password, requestOTP, otp 
} = this.state;
    if (username === '' || password === '') {
      this.setState({
        showError: false,
        showNullError: true,
        loggedIn: false,
      });
    } else if (!requestOTP && (otp === null || otp.length !== 6)) {
      this.setState({
        errorMesssage: 'OTP does not match or expired',
        showError: true,
        showNullError: true,
        loggedIn: false,
      });
    } else {
      try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/loginUser`, {
          username,
          password,
          otp,
        });
        localStorage.setItem('JWT', response.data.token);
        localStorage.setItem('UserName', response.data.username);
        this.setState({
          loggedIn: true,
          showError: false,
          showNullError: false,
        });
      } catch (error) {
        console.error(error.response.data);
        if (error.response.data === 'OTP generated') {
          this.setState({
            requestOTP: false,
            showError: false,
            showNullError: false,
          });
        }
        if (
          error.response.data === 'bad username'
          || error.response.data === 'passwords do not match' || error.response.data === 'OTP does not match or expired' || error.response.data === 'Invalid username or password'
        ) {
          this.setState({
            errorMesssage: error.response.data,
            showError: true,
            showNullError: false,
          });
        }
        if(error.response.data === 'user blocked'){
          window.alert('User blocked. Please contact admin.');
        }
        if(error.response.data === 'user unverified'){
          window.alert('User Not Verified. Please check your email to verify your profile.');
        }
      }
    }
  };

  render() {
    const {
      username,
      password,
      showError,
      loggedIn,
      showNullError,
      requestOTP,
      otp,
      errorMesssage,
    } = this.state;
    if (!loggedIn) {
      return (
        <div className="Sup">
          <div className="px-3 py-3 mx-auto">
            <div className="card card0">
              <div className="d-flex flex-lg-row flex-column-reverse">
                <div className="card card1">
                  <div className="row justify-content-center my-auto">
                    <div className="col-md-8 col-10 my-2">
                      <div className="row justify-content-center px-3 mb-0">
                        <img id="logo" src="ProexLogo.png" alt="PropeXchange Logo" />
                      </div>
                      <h6 className="msg-info">Please login to your account</h6>
                      <form onSubmit={this.loginUser}>
                        {requestOTP && (
                          <div className="form-group">
                            <label htmlFor="username" className="form-control-label text-muted">
                              Username
                              <input
                                type="text"
                                id="username"
                                name="username"
                                placeholder="Username"
                                className="form-control"
                                value={username}
                                onChange={this.handleChange('username')}
                              />
                            </label>
                          </div>
                        )}
                        {requestOTP && (
                        <div className="form-group">
                          <label htmlFor="password" className="form-control-label text-muted">
                            Password
                            <input
                              type="password"
                              id="password"
                              name="password"
                              placeholder="Password"
                              className="form-control"
                              value={password}
                              onChange={this.handleChange('password')}
                            />
                          </label>
                        </div>
                        )}
                        
                        {!requestOTP && (
                        <div className="form-group">
                          <div className="form-control-label text-muted mb-2 mx-auto">
                            OTP 
                          </div>                        
                          <AuthCode id="otp" value={otp} allowedCharacters="numeric" onChange={this.handleOnChange} containerClassName="otp" inputClassName="input" />
                        </div>
                        )}
                        <div className="row justify-content-center my-0 px-3">
                          <button type="submit" className="btn-block btn-color">{requestOTP ? 'Login to PropeXchange' : 'Verify OTP'}</button>
                        </div>
                      </form>
                      {requestOTP && (
                      <div className="row justify-content-center my-2">
                        <p href="#">
                          <Link className="" to="/forgotPassword">
                            <small className="text-muted">Forgot Password?</small>                            
                          </Link>
                        </p>
                      </div>
                      )}
                    </div>
                    {showNullError && (
                      <div>
                        <p>All fields are required.</p>
                      </div>
                    )}
                    {showError && (
                      <div>
                        <p>
                          {(errorMesssage !== 'OTP does not match or expired') ? 'That username or password isn\'t recognized. Please try again or register now.' : 'Invalid OTP.'}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="bottom text-center mb-5">
                    <p href="#" className="sm-text mx-auto mb-3">
                      Don&apos;t have an account?&nbsp;&nbsp;&nbsp;
                      <Link className="" to="/register">
                        <button type="submit" className="btn-white ml-2">Create New</button>
                      </Link>
                    </p>
                  </div>
                </div>
                <div className="card card2">
                  <div className="my-auto mx-md-5 px-md-5 right">
                    <h3 className="text-white">Redefining Real Estate Transactions</h3>
                    <small className="text-white">PropExchange isn&apos;t just a real estate platform; it&apos;s a commitment to revolutionize property dealings. Our focus is on enabling secure transactions and verifying property-related documents seamlessly. Whether you&apos;re buying, selling, or renting, we strive to provide a secure and efficient process.</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return <Navigate to={`/${username}/home`} />;
  }
}

export default Login;
