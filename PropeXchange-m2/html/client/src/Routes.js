import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import Home from './containers/Home';
import Register from './containers/Register';
import Login from './containers/Login';
import Profile from './containers/Profile';
import UpdateProfile from './containers/UpdateProfile';
import ForgotPassword from './containers/ForgotPassword';
import ResetPassword from './containers/ResetPassword';
import UpdatePassword from './containers/UpdatePassword';
import Main from './components/main_property/Main';
import Mybooking from './components/navbar/Postyourproperty';
// import Navbar from './components/navbar/Navbar';
import Searches from './components/search_content/Searches';
import Bookings from './components/navbar/Bookings';
import Profile1 from './components/navbar/Profile';
import MyProperties from './components/navbar/MyProperties';
import VerifyProfile from './containers/VerifyProfile';
import Bookpage from './components/search_content/Bookpage';
import Paymentdone from './components/search_content/Paymentdone';


const MyRoutes = () => (
  <div>
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/reset/:token" element={<ResetPassword />} />
        <Route exact path="/forgotPassword" element={<ForgotPassword />} />
        <Route exact path="/:username/userProfile" element={<Profile />} />
        <Route exact path="/:username/updateUser" element={<UpdateProfile />} />
        <Route
          exact
          path="/:username/updatePassword"
          element={<UpdatePassword />}
        />
        {// <Route exact path="/:username/*" component={Profile} />
        }
        <Route exact path="/:username/search" element={<Searches />} />
        <Route exact path="/:username/bookings" element={<MyProperties/>} />
        <Route exact path="/:username/home" element={<Main />} />
        <Route exact path="/:username/booknow" element={<Bookpage/>} />
        <Route exact path="/:username/postproperty" element={<Mybooking />} />
        <Route exact path="/:username/myproperties" element={<Bookings />} />
        <Route exact path="/:username/profile" element={<Profile />} />
        <Route exact path="/:username/payment" element={ <Paymentdone/>} />
        <Route exact path="/verify/:token" element={<VerifyProfile />} />
      </Routes>
    </Router>
  </div>
);

export default MyRoutes;
