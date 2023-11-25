import { useState,useEffect } from "react";
import React from 'react'
import { useParams } from "react-router-dom";
import CloseIcon from '@mui/icons-material/Close';
import "../navbar/Bookings.css"
import axios from "axios";
import { useNavigate } from "react-router-dom";
function Bookingsitem(props) {
    const [visible,setvisible]=useState(false);
    const [imageData, setImageData] = useState(null);
    const [credentials, setUpdatedData] = useState({
        id:props.booking.id,
        apartment: props.booking.apartment,
        apartmentname: props.booking.apartmentname,
        bhk: props.booking.bhk,
        floor: props.booking.floor,
        totalfloor: props.booking.totalfloor,
        expectedrent: props.booking.expectedrent,
        expectedDepost: props.booking.expectedDepost,
        state: props.booking.state,
        propertyage: props.booking.propertyage,
        district:props.booking.district,
        pincode:props.booking.pincode,
        address:props.booking.address,
        date:props.booking.date,
    });
    const delprop = async () => {
        const propertyId = props.booking.id;
        const accessString = localStorage.getItem('JWT');
        try {
            const response = await axios.delete(
                `${process.env.REACT_APP_BASE_URL}/deleteproperty`,
                {
                    headers: { Authorization: `JWT ${accessString}` },
                    data: { id: propertyId },
                },
            );
            alert('Property deleted successfully');
            window.location.reload();
        } catch (error) {
            alert('Something went wrong!');
            console.error(error.response.data);
        }
    }
    const updateprop =()=>{
        setvisible(true);
    }
    const updateprops=async ()=>{
        const accessString = localStorage.getItem('JWT');
        try {
            const response = await axios.put( 
                `${process.env.REACT_APP_BASE_URL}/updateproperty`, 
                credentials,
                {
                    headers: { Authorization: `JWT ${accessString}` },
                }
            );
            alert('Property updated successfully');
            setvisible(false);
        } catch (error) {
            alert('Something went wrong!');
            console.error(error.response.data);
        }
    }
    const onChange=(e)=>{
        setUpdatedData({...credentials,[e.target.name]:e.target.value})
    }
    const params = useParams();
    let navigate = useNavigate();
    const handlep = () => {
        navigate(`/${params.username}/booknow`);
    };
    useEffect(() => {
        if (props.booking.imagefile && props.booking.imagefile.type) {
            console.log(props.booking.imagefile.data);
            const arrayBufferView = new Uint8Array(props.booking.imagefile.data);
            const blob = new Blob([arrayBufferView], { type: props.booking.imagefile.type });
            const url = URL.createObjectURL(blob);
            setImageData(url);
        }
    }, [props.booking.image]);
    return (
        <div className="www">
            <div className={`${visible ? 'visible' : 'hidden'}`}>
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
                                <option value="apartment">Apartment</option>
                                <option value="independent house">Independent house</option>
                                <option value="Flatmates">Flatmates</option>
                            </select>
                        </label>
                        <input type="text" placeholder="apartment name" name='apartmentname' required maxLength={20} value={credentials.apartmentname} onChange={onChange}/>
                    </div>
                    <CloseIcon id="w" onClick={()=>{setvisible(false); window.location.reload();}}></CloseIcon>
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
                        <input type="file" name='imagefile' accept="image/*" onChange={onChange} />
                    </div>
                    <div className='submit'>
                        <div className='date'>Available from:
                            <input type="date" name="date" id="date" required value={credentials.date} onChange={onChange}/>
                        </div>
                        <input type="submit" value="Update Your Property" onClick={updateprops} />
                    </div>
            </div>
            <div className='mm1'>
                <div className='mm11'>
                    <div className='mm111'>
                        <p>{credentials.apartment}</p>
                        <p>Apartment Name   : {credentials.apartmentname}</p>
                    </div>
                    <div className='mm111'>
                        <p>{credentials.bhk}</p>
                        <p>Which Floor : {credentials.floor}</p>
                        <p>Total Floor : {credentials.totalfloor}</p>
                    </div>
                    <div className='mm111'>
                        <p>Rent : {credentials.expectedrent}</p>
                        <p>Deposit : {credentials.expectedDepost}</p>
                    </div>
                    <div className='mm111'>
                        <p>State : {credentials.state}</p>
                        <p>Property Age : {credentials.propertyage}</p>
                    </div>
                </div>
                <div className='ex'> 
                    {imageData && <img src={imageData} alt="Property Image" />}
                    <p>Available From : {credentials.date}</p>
                </div>
            </div>
            <div>
                <button className="book"onClick={handlep} >Book Now</button>
            </div>
        </div>
    )
}

export default Bookingsitem;
