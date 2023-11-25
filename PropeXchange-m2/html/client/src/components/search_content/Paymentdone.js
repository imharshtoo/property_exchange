import React, { useState } from 'react'
import "./Paymentdone.css"
import { useNavigate ,useParams} from 'react-router-dom'
function Paymentdone() {
    const params = useParams();
    const [Pay,SetPay]=useState("");
    const success= async (e)=>{
        e.preventDefault();
        const accessString = localStorage.getItem('JWT');
        try {
            SetPay(params.username);
        const response = await axios.post(
            `${process.env.REACT_APP_BASE_URL}/paymentdone`,
            Pay,
            {
            headers: { Authorization: `JWT ${accessString}`,'Content-Type': 'multipart/form-data', },
        },
        );
        alert("payment done");
        } catch (error) {
            alert("Something went wrong!");
            console.error(error.response.data);
        }
    }
    let navigate = useNavigate();
    const failure = () => {
        alert("payment failed");
        navigate(`/${params.username}/home`);
    };
    return (
        <div>
            <h1>Payment Will be done here</h1>
            <button className='eeww' onClick={failure}>Faliure</button>
            <button className='succs' onClick={success}>Success</button>
        </div>
    )
}

export default Paymentdone
