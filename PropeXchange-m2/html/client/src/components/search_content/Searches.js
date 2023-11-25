import React from 'react'
import "./Searches.css"
import Searchitem from './Searchitem'
import Navbar from '../navbar/Navbar'
// import { Link } from 'react-router-dom'
function Searches() {
    return (
        <>
        <Navbar/>
        <Searchitem type="hey this is my type" address="thisis my address" rent="10500" deposit="15000" bhk="2bhk" availability="immediately"/>
        <Searchitem type="hey this is my type" address="thisis my address" rent="10500" deposit="15000" bhk="2bhk" availability="immediately"/>
        <Searchitem type="hey this is my type" address="thisis my address" rent="10500" deposit="15000" bhk="2bhk" availability="immediately"/>
        </>
    )
}

export default Searches;
