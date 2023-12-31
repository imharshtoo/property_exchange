/* eslint-disable no-console */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Navigate, useParams } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import axios from 'axios';

import {
  LinkButtons,
  SubmitButtons,
  HeaderBar,
  homeButton,
  cancelButton,
  saveButton,
  loginButton,
  inputStyle,
} from '../components';

const loading = {
  margin: '1em',
  fontSize: '24px',
};

const title = {
  pageTitle: 'Update Password Screen',
};

function withParams(WrappedComponent) {
  function ComponentWithRouter(props) {
    const params = useParams();
    return <WrappedComponent {...props} params={params} />;
  }
  return ComponentWithRouter;
}

class UpdatePassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      loadingUser: false,
      updated: false,
      error: false,
    };
  }

  async componentDidMount() {
    this.setState({ loadingUser: true });

    const accessString = localStorage.getItem('JWT');
    if (accessString === null) {
      this.setState({
        loadingUser: false,
        error: true,
      });
    } else {
      const {
        params: { username },
      } = this.props;
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/findUser`, {
          params: {
            username,
          },
          headers: { Authorization: `JWT ${accessString}` },
        });
        this.setState({
          loadingUser: false,
          username: response.data.username,
          password: response.data.password,
          error: false,
        });
      } catch (error) {
        console.log(error.response.data);
        this.setState({
          loadingUser: false,
          error: true,
        });
      }
    }
  }

  handleChange = name => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };
  validatePassword = (password) =>{
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };
  updatePassword = async (e) => {
    if(!this.validatePassword(this.state.password)) {
      this.setState({password:''});
      window.alert(`Invalid Password! Must contain atleast 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character.`);
      return;
    }
    const accessString = localStorage.getItem('JWT');
    if (accessString === null) {
      this.setState({
        loadingUser: false,
        error: true,
      });
    } else {
      e.preventDefault();
      const { username, password } = this.state;
      try {
        const response = await axios.put(
          `${process.env.REACT_APP_BASE_URL}/updatePassword`,
          {
            username,
            password,
          },
          {
            headers: { Authorization: `JWT ${accessString}` },
          },
        );
        if (response.data.message === 'password updated') {
          this.setState({
            updated: true,
            error: false,
            loadingUser: false,
          });
        }
      } catch (error) {
        console.log(error.response.data);
        this.setState({
          updated: false,
          error: true,
          loadingUser: false,
        });
      }
    }
  };

  // eslint-disable-next-line consistent-return
  render() {
    const {
 username, password, updated, error, loadingUser 
} = this.state;

    if (error) {
      return (
        <div>
          <HeaderBar title={title} />
          <p style={loading}>
            There was a problem accessing your data. Please go login again.
          </p>
          <LinkButtons
            style={loginButton}
            buttonText="Go Login"
            link="/login"
          />
        </div>
      );
    }
    if (loadingUser !== false) {
      return (
        <div>
          <HeaderBar title={title} />
          <p style={loading}>Loading user data...</p>
        </div>
      );
    }
    if (loadingUser === false && updated === true) {
      return <Navigate to={`/${username}/userProfile`} />;
    }
    if (loadingUser === false) {
      return (
        <div>
          <HeaderBar title={title} />
          <form className="profile-form" onSubmit={this.updatePassword}>
            <TextField
              style={inputStyle}
              id="password"
              label="password"
              value={password}
              onChange={this.handleChange('password')}
              type="password"
            />
            <SubmitButtons buttonStyle={saveButton} buttonText="Save Changes" />
          </form>
          <LinkButtons buttonStyle={homeButton} buttonText="Go Home" link="/" />
          <LinkButtons
            buttonStyle={cancelButton}
            buttonText="Cancel Changes"
            link={`/${username}/userProfile`}
          />
        </div>
      );
    }
  }
}

UpdatePassword.propTypes = {
  // eslint-disable-next-line react/require-default-props
  params: PropTypes.shape({
    username: PropTypes.string.isRequired,
  }),
};

export default withParams(UpdatePassword);
