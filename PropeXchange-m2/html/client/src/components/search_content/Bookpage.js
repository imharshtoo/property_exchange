import React from 'react'
import Navbar from '../navbar/Navbar'
import { useParams,useNavigate } from 'react-router-dom';
import "./Bookpage.css"
function Bookpage(props) {
    const params = useParams();
    let navigate = useNavigate();
    const subot = () => {
        navigate(`/${params.username}/payment`);
    };
    return (
        <>
            <Navbar/>
            <div className='rrrrr'>
                <h1>Contract Signature</h1>
                <p>1.	That the Tenant/Lessee shall pay as the monthly rent  per  month,  excluding  electricity  and  water charge.</p>
                <p>2. That the Tenant /Lessee shall not sub let any part of the above said demised premised premises to anyone else under any circumstances without the consent of Owner.</p>
                <p>3.	That  the  Tenant  / Lessee  shall   abide  by   all  the  bye  -  laws ,  rules  and regulation, of the local authorities in respect  of the demised premises and shall not do any illegal activities in the said demised premises.</p>
                <p>4.	That   this   Lease   is   granted  for  a  period   of   Eleven  (11)  months  only commencing (date of rent commencing from) and  this  lease   can  be  extended further by   both   the   parties  with   their  mutual  consent on the basis of  prevailing rental value  in the market .</p>
                <p>5.	That the Lessee shall pay Electricity & Water charge as per   the proportionate consumption of the meter to the Lessor /Owner.</p>
                <p>6.	That the Tenant/Lessee shall not be entitled to make structure in the rented premises except the installation of temporary decoration, wooden partition/ cabin, air – conditioners etc. without the prior consent of   the owner.</p>
                <p>7.	That  the  Tenant/lessee  can neither  make  addition/alteration in  the said              premises without  the  written  consent of the owner, nor the lessee can sublet          part or entire  premises to any person(s)/firm(s)/company(s).</p>
                <p>8.	That  the  Tenant/Lessee shall permit  the  Lessor/Owner or his Authorized    agent  to  enter   in  to  the   said  tenanted  premises  for  inspection/general        checking or to carry out the repair work, at any reasonable time.</p>
                <p>9.	That the Tenant/Lessee shall keep the said premises in clean & hygienic condition and shall not do or causes to be done any act which may be a nuisance to other.</p>
                <p>10.	That the Tenant/Lessees shall carry on all day to day minor repairs at his/her own cost.</p>
                <p>11.	That  this Agreement  may  be  terminated   before  the expiry of this tenancy period by serving One month prior notice by either  party  for  this intention .</p>
                <p>12.	That the Lessee shall use the above said premises for Official Purpose Only.</p>
                <p>13.	That  the  Lessee/Tenant  Shall  not  store/Keep any offensive, dangerous, explosive or highly  Inflammable  articles  in  the  said  premises and shall not use the same for any unlawful activities .</p>
                <p>14.	That the Lessee shall pay the one month’s advance rent to the Lessor the same shall be adjusted in monthly rent.</p>
                <p className='eee'>15.	That both the parties have read over and understood all the contents of this agreement and have signed the same without any force or pressure from any side.</p>
                <div className='errr'>
                    <input type="checkbox" name="checkbox" id="checkbox" required/> I agree to all the terms and regulations which is mentioned in this and i will sincerely obey all the rules which is mentioned in it.
                </div>
                <div className='fff'>
                    <input type="submit" value="Payment" onClick={subot}/>
                </div>
            </div>
        </>
    )
}

export default Bookpage
