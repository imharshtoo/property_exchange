/* eslint-disable camelcase */
/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Link, Navigate, useParams } from 'react-router-dom';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import {
  LinkButtons,
  deleteButton,
  updateButton,
  loginButton,
  logoutButton,
  HeaderBar,
  linkStyle,
  forgotButton,
} from '../components';

const loading = {
  margin: '1em',
  fontSize: '24px',
};

const title = {
  pageTitle: 'User Profile Screen',
};

// function withParams(WrappedComponent) {
//   return function ComponentWithRouter(props) {
//     const params = useParams();
//     return <WrappedComponent {...props} params={params} />;
//   };
// }

function Profile() {
  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    password: '',
    error: false,
    isLoading: true,
    deleted: false,
    proof_doc: null,
  });

  const params = useParams();
  useEffect(() => {
    const accessString = localStorage.getItem('JWT');
    if (accessString == null) {
      setUserData({
        isLoading: false,
        error: true,
      });
    } else {
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/findUser`, {
          params: {
            username:params.username,
          },
          headers: { Authorization: `JWT ${accessString}` },
        })
        .then((response) => {
          setUserData({
            first_name: response.data.first_name,
            last_name: response.data.last_name,
            email: response.data.email,
            username: response.data.username,
            password: response.data.password,
            isLoading: false,
            error: false,
          });
        })
        .catch((error) => {
          console.error(error.response.data);
          setUserData({
            error: true,
          });
        });
    }
  }, [params.username]);

  const viewDoc = async () => {
    console.log("fetching file");
    const accessString = localStorage.getItem('JWT');
    if (accessString == null) {
      setUserData({
        isLoading: false,
        error: true,
      });
    } else {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/get-poi`, {
          params: {
            username: params.username,
          },
          headers: { Authorization: `JWT ${accessString}` },
          responseType: 'arraybuffer',
        });
  
        setUserData((prevUserData) => ({
          ...prevUserData,
          proof_doc: response.data,
        }));
  
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${userData.username}_poi.pdf`; // Set the desired file name
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
  
        alert("Downloaded File Successfully!");
      } catch (error) {
        alert("Error in downloading file!");
        console.error(error.response.data);
        setUserData({
          error: true,
        });
      }
    }
  };
  

  const logout = () => {
    localStorage.removeItem('JWT');
  };

  const {
    first_name,
    last_name,
    email,
    username,
    password,
    error,
    isLoading,
    deleted,
    proof_doc
  } = userData;

  if (error) {
    return (
      <div>
        <HeaderBar title={title} />
        <div style={loading}>Problem fetching user data. Please login again.</div>
        <LinkButtons buttonText="Login" buttonStyle={loginButton} link="/login" />
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

  if (deleted) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <HeaderBar title={title} />
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>First Name</TableCell>
            <TableCell>{first_name}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Last Name</TableCell>
            <TableCell>{last_name}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Email</TableCell>
            <TableCell>{email}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>User Name</TableCell>
            <TableCell>{username}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Password</TableCell>
            <TableCell style={{ WebkitTextSecurity: 'disc' }}>
              {password}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Proof Of Identity</TableCell>
            <TableCell >
              <button onClick={viewDoc}>View</button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      
      <LinkButtons
        buttonStyle={updateButton}
        buttonText="Update User"
        link={`/${username}/updateUser`}
      />
      <LinkButtons
        buttonStyle={forgotButton}
        buttonText="Update Password"
        link={`/${username}/updatePassword`}
      />
      <Button
        style={logoutButton}
        variant="contained"
        color="primary"
        onClick={logout}
      >
        <Link style={linkStyle} to="/">
          Logout
        </Link>
      </Button>
    </div>
  );
}

Profile.propTypes = {
  // eslint-disable-next-line react/require-default-props
  params: PropTypes.shape({
    username: PropTypes.string.isRequired,
  }),
};

export default Profile;
