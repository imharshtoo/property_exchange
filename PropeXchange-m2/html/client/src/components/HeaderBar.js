import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';
import { Link } from 'react-router-dom';
import { linkStyle } from './ButtonStyles';
const headerStyle = {
  background:
    'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 25%, rgba(8,177,5,1) 62%, rgba(0,212,255,1) 100%)',
  color: 'white',
};

const HeaderBar = ({ title }) => (
  <div className="header">
    <AppBar position="static" color="default" style={headerStyle}>
      <Toolbar>
        <Link style={linkStyle} to="/">
          <HomeIcon fontSize="medium" />
        </Link>
        <Typography variant="title" color="inherit">
          {title.pageTitle || 'Page Title Placeholder'}
        </Typography>
      </Toolbar>
    </AppBar>
  </div>
);

HeaderBar.propTypes = {
  title: PropTypes.shape({
    pageTitle: PropTypes.string.isRequired,
  }),
};

HeaderBar.defaultProps = {
  title: {
    pageTitle: 'Page Title Placeholder',
  },
};

export default HeaderBar;
