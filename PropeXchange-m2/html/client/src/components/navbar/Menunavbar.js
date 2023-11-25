import React from 'react';
import './Menunavbar.css';
import { useNavigate } from 'react-router';
    function Menunavbar({ username }) {
    let navigate = useNavigate();
    const handlep = () => {
        navigate(`/${username}/profile`);
    };
    const handlep2 = () => {
        navigate(`/${username}/postproperty`);
    };
    return (
        <>
        <div className="uu">
        <div onClick={ handlep } className="uu1">
            <p>My Profile</p>
        </div>
        <div onClick={handlep2 } className="uu1">
            <p>Post Your Property</p>
        </div>
        <div className="uu1">Rental Agreemenet</div>
        <div className="uu1">Rent Receipts</div>
        <div className="uu1">reviews</div>
        <div className="uu1">
            <p>Contact Us!!</p>
            <p>harsh20434@iiitd.ac.in</p>
        </div>
        </div>
        </>
    );
}

export default Menunavbar;
