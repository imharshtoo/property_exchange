/* eslint-disable no-console */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import { useParams } from 'react-router-dom';
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
  pageTitle: 'Password Reset Screen',
};

function withParams(WrappedComponent) {
  function ComponentWithRouter(props) {
    const params = useParams();
    return <WrappedComponent {...props} params={params} />;
  }
  return ComponentWithRouter;
}

class ResetPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      updated: false,
      isLoading: true,
      error: false,
    };
  }

  async componentDidMount() {
    const {
      params: { token },
    } = this.props;
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/reset`, {
        params: {
          resetPasswordToken: token,
        },
      });
      // console.log(response);
      if (response.data.message === 'password reset link a-ok') {
        this.setState({
          username: response.data.username,
          updated: false,
          isLoading: false,
          error: false,
        });
      }
    } catch (error) {
      console.log(error.response.data);
      this.setState({
        updated: false,
        isLoading: false,
        error: true,
      });
    }
  }
  validatePassword = (password) =>{
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };
  handleChange = name => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };

  updatePassword = async (e) => {
    if(!this.validatePassword(this.state.password)) {
      this.setState({password:''});
      window.alert(`Invalid Password! Must contain atleast 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character.`);
      return;
    }
    e.preventDefault();
    const { username, password } = this.state;
    const {
      params: { token },
    } = this.props;
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/updatePasswordViaEmail`,
        {
          username,
          password,
          resetPasswordToken: token,
        },
      );
      console.log(response.data);
      if (response.data.message === 'password updated') {
        this.setState({
          updated: true,
          error: false,
        });
      } else {
        this.setState({
          updated: false,
          error: true,
        });
      }
    } catch (error) {
      console.log(error.response.data);
    }
  };

  render() {
    const {
 password, error, isLoading, updated 
} = this.state;

    if (error) {
      return (
        <div>
          <HeaderBar title={title} />
          <div style={loading}>
            <h4>Problem resetting password. Please send another reset link.</h4>
            <LinkButtons
              buttonText="Go Home"
              buttonStyle={homeButton}
              link="/"
            />
            <LinkButtons
              buttonStyle={forgotButton}
              buttonText="Forgot Password?"
              link="/forgotPassword"
            />
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
        <form className="password-form" onSubmit={this.updatePassword}>
          <TextField
            style={inputStyle}
            id="password"
            label="password"
            onChange={this.handleChange('password')}
            value={password}
            type="password"
          />
          <SubmitButtons
            buttonStyle={updateButton}
            buttonText="Update Password"
          />
        </form>

        {updated && (
          <div>
            <p>
              Your password has been successfully reset, please try logging in
              again.
            </p>
            <LinkButtons
              buttonStyle={loginButton}
              buttonText="Login"
              link="/login"
            />
          </div>
        )}
        <LinkButtons buttonText="Go Home" buttonStyle={homeButton} link="/" />
      </div>
    );
  }
}

ResetPassword.propTypes = {
  // eslint-disable-next-line react/require-default-props
  params: PropTypes.shape({
    token: PropTypes.string.isRequired,
  }),
};

export default withParams(ResetPassword);
