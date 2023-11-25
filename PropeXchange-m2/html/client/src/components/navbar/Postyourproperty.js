import React, { useState } from 'react'
import axios from "axios";
import "./Postyourproperty.css"
import Navbar from './Navbar';
function Mybooking() {
    const [credentials,setCredentials]=useState({imagefile:null,state:"Delhi",address:"",pincode:null,district:"",apartment:"Apartment",apartmentname:"",bhk:"1bhk",floor:"",totalfloor:"",propertyage:"",expectedrent:null,expectedDepost:null,date:""});
    const handleSubmit= async (e)=>{
        e.preventDefault();
        const accessString = localStorage.getItem('JWT');
        try {
        const response = await axios.post(
            `${process.env.REACT_APP_BASE_URL}/postyourproperty`,
            credentials,
            {
            headers: { Authorization: `JWT ${accessString}`,'Content-Type': 'multipart/form-data', },
        },
        );
        alert("Property posted successfully");
        } catch (error) {
            alert("Something went wrong!");
            console.error(error.response.data);
        }
    }
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setCredentials({...credentials,imagefile:file});
    };
    const onChange=(e)=>{
        setCredentials({...credentials,[e.target.name]:e.target.value})
    }
    return (
        <>
        <Navbar></Navbar>
        <div className='main'>
            <h1>Property details</h1>
            <form onSubmit={handleSubmit}>
                <div className='ee1'>
                    <label htmlFor="state">State:
                        <select name="state" id="state" value={credentials.state} onChange={onChange}>
                            <option value="Delhi">Delhi</option>
                            <option value="Mumbai">Mumbai</option>
                            <option value="Goa">Goa</option>
                            <option value="Chennai">Chennai</option>
                            <option value="Pune">Pune</option>
                        </select>
                    </label>
                    <label htmlFor="apartment">Apartment type:
                        <select name="apartment" id="apartment" value={credentials.apartment} onChange={onChange}>
                            <option value="Apartment">Apartment</option>
                            <option value="Independent house">Independent house</option>
                            <option value="Flatmates">Flatmates</option>
                        </select>
                    </label>
                    <input type="text" placeholder="apartment name" name='apartmentname' required maxLength={20} value={credentials.apartmentname} onChange={onChange}/>
                </div>
                <div className='love'>
                <label htmlFor="bhk">BHK type:
                        <select name="bhk" id="bhk" value={credentials.bhk} onChange={onChange}>
                            <option value="1bhk">1bhk</option>
                            <option value="2bhk">2bhk</option>
                            <option value="3bhk">3bhk</option>
                            <option value="4bhk">4bhk</option>
                            <option value="5bhk">5bhk</option>
                        </select>
                    </label>
                    <div className='floor'>Which Floor:
                        <input type="number" placeholder='Which floor?' name='floor'  required maxLength={20} value={credentials.floor} onChange={onChange}/>
                    </div>
                    <div>Total floor
                        <input type="number" placeholder='Total floor'name='totalfloor' required maxLength={20} value={credentials.totalfloor} onChange={onChange}/>
                    </div>
                </div>
                <div className='rot'>
                    <div>Property Age:
                        <input type="number" placeholder='property age' name='propertyage' required maxLength={20} value={credentials.propertyage} onChange={onChange}/>
                    </div>
                    <div>Expected Rent:
                        <input type="number" required maxLength={20} name='expectedrent' value={credentials.expectedrent} onChange={onChange}/>
                    </div>
                    <div>Expected Deposit
                        <input type="number" required maxLength={20} name='expectedDepost' value={credentials.expectedDepost} onChange={onChange}/>
                    </div>
                </div>
                <div className='riti'>
                    <div>District  : 
                        <input type="text" placeholder='District' name='district' maxLength={10} value={credentials.district}  onChange={onChange}/>
                    </div>
                    <div>Pincode  :
                        <input type="number" placeholder='Pincode' maxLength={10} name='pincode' value={credentials.pincode}  onChange={onChange}/>
                    </div>
                </div>
                <div className='reee'>Full address  :
                    <input type="text" placeholder='Full Address' maxLength={70} name='address' value={credentials.address}  onChange={onChange} />
                </div>
                <div>
                    <input type="file" name='imagefile' accept="image/*" onChange={handleFileChange} />
                </div>
                <div className='submit'>
                    <div className='date'>Available from:
                        <input type="date" name="date" id="date" required maxLength={20} value={credentials.date} onChange={onChange}/>
                    </div>
                    <input type="submit" value="Post your Property!!!" />
                </div>
            </form>
        </div>
        </>
    )
}

export default Mybooking;
