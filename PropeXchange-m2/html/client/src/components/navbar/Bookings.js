import React, { useEffect, useState } from 'react';
import Bookingsitem from './Bookingsitem';
import Navbar from './Navbar';
import axios from 'axios';

function Bookings() {
    const [propdata, setPropdata] = useState([]);

    const handleSubmit = async () => {
        const accessString = localStorage.getItem('JWT');
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_BASE_URL}/bookings`,
                {
                    headers: { Authorization: `JWT ${accessString}` },
                }
            );
            setPropdata(response.data);
        } catch (error) {
            alert("Something went wrong!");
            console.error(error.response.data);
        }
    }

    useEffect((e) => {
        handleSubmit();
        // e.preventDefault();
    }, []);

    return (
        <>
            <Navbar />
            <h1>History</h1>
            {propdata.map((data,index) => (
                <Bookingsitem booking={data} key={index}/>
            ))}
        </>
    )
}

export default Bookings;
