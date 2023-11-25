import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Navigate, useParams } from 'react-router-dom';
import "./Main.css";
import Navbar from '../navbar/Navbar';
import Bookingsitem from '../search_content/Searchitem';
import { HeaderBar } from '../../components';
const loading = {
    margin: '1em',
    fontSize: '24px',
};


const title = {
    pageTitle: 'Home Screen',
};

function Main() {
    const [credentials,setCredentials]=useState({location:"Delhi",landmark:"",type:"Apartment",bhk:"1BHK",Budget:5000,availability:"within 15 days",pincode:""});
    const [userData, setUserData] = useState({
        first_name: '',
        username: '',
        error: false,
        isLoading: true,
    });
    const onChange=(e)=>{
        setCredentials({...credentials,[e.target.name]:e.target.value})
    }
    const [propdata, setPropdata] = useState([]);
    const params = useParams();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const accessString = localStorage.getItem('JWT');
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BASE_URL}/searchitems`,credentials,
                {
                    headers: { Authorization: `JWT ${accessString}` }
                },
            );
            alert(`There Are ${response.data.length} Properties In Your Area`);
            setPropdata(response.data);
        } catch (error) {
            alert("Something went wrong!");
            console.error(error.response.data);
        }
    }
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
                username: params.username,
            },
            headers: { Authorization: `JWT ${accessString}` },
            })
            .then((response) => {
            setUserData({
                first_name: response.data.first_name,
                username: response.data.username,
                isLoading: false,
                error: false,
            });
            })
            .catch((error) => {
            console.error(error.response.data);
            setUserData({
                isLoading: false,
                error: true,
            });
            });
        }
    }, [params.username]);
    
    const { username, error, isLoading } = userData;

    if (isLoading) {
        return (
        <div>
            <HeaderBar title={title} />
            <div style={loading}>Loading Data...</div>
        </div>
        );
    }
    if(error===false){
    return (
        <>
        <Navbar/>
        <div className="har">
            <span>Sell or Rent your Property here</span>
        </div>
        <div className="whole">
            <div className="left">
                <div className="buy">Buy | Rent | Sale</div>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="second">
                    <div className="ee">
                        <label htmlFor="location">State:
                            <select name="location" id="location" onChange={onChange} value={credentials.location}>
                                <option value="Delhi">Delhi</option>
                                <option value="Mumbai">Mumbai</option>
                                <option value="Pune">Pune</option>
                                <option value="Goa">Goa</option>
                                <option value="Chennai">Chennai</option>
                            </select>
                        </label>
                    </div>
                    <div>
                        <input type="text" name="landmark" id="ilove" placeholder="Locality Or Landmark" required maxLength={40} onChange={onChange} value={credentials.landmark}/>
                    </div>
                    <div className='sub'>
                        <input type="submit" value="submit" />
                    </div>
                </div>
                <div>
                    <label htmlFor="type">Type Of Home:
                        <select name="type" id="type" onChange={onChange} value={credentials.type}>
                            <option value="Apartment">Apartment</option>
                            <option value="Independent house">Independent house</option>
                            <option value="Flatmates">Flatmates</option>
                        </select>
                    </label>
                    <label htmlFor="bhk">
                        <select name="bhk" id="bhk" onChange={onChange} value={credentials.bhk}>
                            <option value="1bhk">1bhk</option>
                            <option value="2bhk">2bhk</option>
                            <option value="3bhk">3bhk</option>
                        </select>
                    </label>
                    <label htmlFor="availability">
                        <select name="availability" id="availability" onChange={onChange} value={credentials.availability}>
                            <option value="within 15 days">within 15 days</option>
                            <option value="within 30 days">within 30 days</option>
                            <option value="after 30 days">after 30 days</option>
                        </select>
                    </label>
                    <label htmlFor="Budget">Budget   (In less manner)
                        <select name="Budget" id="Budget" onChange={onChange} value={credentials.Budget}>
                            <option value="5000">5000</option>
                            <option value="10000">10000</option>
                            <option value="20000">20000</option>
                        </select>
                    </label>
                </div>
                <div className='pincode'>Pincode  :
                    <input type="pincode" placeholder='Pincode' maxLength={10} name='pincode' required onChange={onChange} value={credentials.pincode}/>
                </div>
            </form>
        </div>
        <h1>DATA</h1>
            {propdata.map((data,index) => (
                <Bookingsitem booking={data} key={index}/>
            ))}
        </>
    )}
    return (
        <div>
        <HeaderBar title={title} />
        <div style={loading}>Problem fetching user data. Please login again.</div>
        <Navigate to={`/login`}/>
        </div>
    );
}

Main.propTypes = {
    // eslint-disable-next-line react/require-default-props
    params: PropTypes.shape({
        username: PropTypes.string.isRequired,
    }),
};

export default Main
