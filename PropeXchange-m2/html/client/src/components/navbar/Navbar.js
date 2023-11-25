import React, { useState ,useEffect} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import "./Navbar.css"
import { useNavigate, Link , useParams, Navigate} from 'react-router-dom' // Note the change here
import Menunavbar from './Menunavbar';
import { HeaderBar } from '../../components';
const loading = {
    margin: '1em',
    fontSize: '24px',
};

const title = {
    pageTitle: 'PropeXchange',
};
function Navbar() {
    const [userData, setUserData] = useState({
        first_name: '',
        username: '',
        error: false,
        isLoading: true,
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
    const logout = () => {
        localStorage.removeItem('JWT');
        navigate("/login");
      };
    const { username, error, isLoading } = userData;
    const [ismenu,setMenu]=useState(false);
    let navigate = useNavigate();

    const mainpage = () => {
        navigate("/");
    }

    const handleMenuClick = () => {
        setMenu(!ismenu);
    }
    if (isLoading) {
        return (
          <div>
            <HeaderBar title={title} />
            <div style={loading}>Loading ...</div>
          </div>
        );
      }
    if(error){
        return (
            <Navigate to={`/login`}/>
          );
    }
    return (
        <div className='nav'>
            <div>
                <h2 className='jj' onClick={mainpage} style={{cursor:"pointer"}}>Property Deals !!!</h2>
            </div>
            <div>
                <button className='btn1 btn'>
                    <Link to={`/${username}/myproperties`}>My Properties</Link> 
                </button>
                <button className='btn1 btn'>
                    <Link to={`/${username}/bookings`}>My Bookings</Link> 
                </button>
                <button className='btn2 btn'>
                    <Link to={`/${username}/postproperty`}>Post Your Property</Link>
                </button>
                <button className='btn3 btn' onClick={logout}>LogOut</button> {/* Adjust if logout isn't a page */}
                <button className='btn4 btn' onClick={handleMenuClick}>Menu</button> {
                    ismenu && (<Menunavbar username={username}></Menunavbar>)
                }
            </div>
        </div>
    )
}
Navbar.propTypes = {
    // eslint-disable-next-line react/require-default-props
    params: PropTypes.shape({
      username: PropTypes.string.isRequired,
    }),
};
export default Navbar;
