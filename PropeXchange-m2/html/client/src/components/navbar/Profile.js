import React from 'react'
import "./Profile.css"
import Navbar from './Navbar';
function Profile() {
    return (
        <>
        <Navbar/>
        <div className='ll'>
            <div>
                <p>Name</p>
                <input type="text" />
            </div>
            <div>
                <p>Email Address</p>
                <input type="email" name="email" id="email" />
            </div>
            <div>
                <p>Mobile Phone</p>
                <input type="number" name="number" id="number" />
            </div>
            <div className='profile'>
                <input type="submit" value="Save Profile"/>
            </div>
        </div>
        </>
    )
}

export default Profile;
