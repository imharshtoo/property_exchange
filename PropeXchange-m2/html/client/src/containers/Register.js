/* eslint-disable no-console */
/* eslint-disable camelcase */
import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Style.css';
import {
  LinkButtons,
  loginButton,
  HeaderBar,
} from '../components';

const title = {
  pageTitle: 'Register Screen',
};

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      username: '',
      password: '',
      messageFromServer: '',
      showError: false,
      registerError: false,
      loginError: false,
    };
  }
  validateUsername = (username) => {
    const regex = /^[a-z0-9]+$/;
    return regex.test(username);
  };
  validatePassword = (password) =>{
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };
  handleChange = name => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };

  registerUser = async (e) => {
    e.preventDefault();
    const {
 first_name, last_name, username, password, email 
} = this.state;
    if (username === '' || password === '' || email === '' || first_name === '') {
      this.setState({
        showError: true,
        loginError: false,
        registerError: true,
      });
    } else if(!this.validateUsername(username)) {
      this.setState({username:''});
      window.alert("Invalid UserName! Must contain only lowercase letters and numbers.");
    } else if(!this.validatePassword(password)) {
      this.setState({password:''});
      window.alert(`Invalid Password! Must contain atleast 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character.`);
    } else {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/registerUser`,
          {
            first_name,
            last_name,
            email,
            username,
            password,
          },
        );
        this.setState({
          messageFromServer: response.data.message,
          showError: false,
          loginError: false,
          registerError: false,
        });
      } catch (error) {
        console.error(error.response.data);
        if (error.response.data === 'username or email already taken') {
          this.setState({
            showError: true,
            loginError: true,
            registerError: false,
          });
        }
        if(error.response.data === 'Invalid username or password'){
          window.alert("Invalid username or password!");
        }
      }
    }
  };

  // eslint-disable-next-line consistent-return
  render() {
    const {
      first_name,
      last_name,
      email,
      username,
      password,
      messageFromServer,
      showError,
      loginError,
      registerError,
    } = this.state;
    
    if (messageFromServer === '') {
      return (
        <div className="Sup">
          <div className="px-3 py-3 mx-auto">
            <div className="card card0">
              <div className="d-flex flex-lg-row flex-column-reverse">
                <div className="card card2">
                  <div className="my-auto mx-md-5 px-md-5 right">
                    <h3 className="text-white">Redefining Real Estate Transactions</h3>
                    <small className="text-white">PropExchange isn&apos;t just a real estate platform; it&apos;s a commitment to revolutionize property dealings. Our focus is on enabling secure transactions and verifying property-related documents seamlessly. Whether you&apos;re buying, selling, or renting, we strive to provide a secure and efficient process.</small>
                  </div>
                </div>
                <div className="card card1">
                  <div className="row justify-content-center my-auto">
                    <div className="col-md-8 col-10 my-2">
                      <div className="row justify-content-center px-3 mb-0">
                        <img id="logo" src="ProexLogo.png" alt="PropExchange logo" />
                      </div>
                      <h6 className="msg-info">Please fill in your details</h6>
                      <form onSubmit={this.registerUser}>
                        <div className="form-group">
                          <label htmlFor="first_name" className="form-control-label text-muted">
                            First Name
                            <input
                              type="text"
                              id="first_name"
                              name="first_name"
                              placeholder="First Name"
                              className="form-control"
                              value={first_name}
                              onChange={this.handleChange('first_name')}
                            />
                          </label>
                        </div>
                        <div className="form-group">
                          <label htmlFor="last_name" className="form-control-label text-muted">
                            Last Name
                            <input
                              type="text"
                              id="last_name"
                              name="last_name"
                              placeholder="Last Name"
                              className="form-control"
                              value={last_name}
                              onChange={this.handleChange('last_name')}
                            />
                          </label>
                        </div>
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
                        <div className="form-group">
                          <label htmlFor="email" className="form-control-label text-muted">
                            Email
                            <input
                              type="email"
                              id="email"
                              name="email"
                              placeholder="Email ID"
                              className="form-control"
                              value={email}
                              onChange={this.handleChange('email')}
                            />
                          </label>
                        </div>
                    

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

                        <div className="row justify-content-center my-0 px-3">
                          <button type="submit" className="btn-block btn-color">SignUp to PropeXchange</button>
                        </div>
                      </form>
                      {showError === true && registerError === true && (
                        <div>
                          <p>Please fill the required details.</p>
                        </div>
                      )}
                      {showError === true && loginError === true && (
                        <div>
                          <p>
                            That username or email is already taken. Please choose another
                            or login.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="bottom text-center mb-5">
                    <p href="#" className="sm-text mx-auto mb-3">
                      Already an Existing User?&nbsp;&nbsp;&nbsp;
                      
                      <Link className="" to="/login">
                        <button type="submit" className="btn-white ml-2">Login</button>
                      </Link>
                    </p>
                  </div>
                </div>
                        
              </div>
            </div>
          </div>
        </div>
      );
    }
    if (messageFromServer === 'user created') {
      return (
        <div>
          <HeaderBar title={title} />
          <h3>User successfully registered! Please Check Your email To verify your Profile.</h3>
          <LinkButtons
            buttonText="Go Login"
            buttonStyle={loginButton}
            link="/login"
          />
        </div>
      );
    }
  }
}

export default Register;
