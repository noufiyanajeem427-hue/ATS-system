import "./ActionButtons.css";

import {

FaUserCheck,

FaCalendarAlt,

FaEnvelope,

FaTimesCircle,

} from "react-icons/fa";

function ActionButtons(){

return(

<div className="action-buttons">

<button className="shortlist">

<FaUserCheck/>

Shortlist

</button>

<button className="interview">

<FaCalendarAlt/>

Schedule Interview

</button>

<button className="email">

<FaEnvelope/>

Send Email

</button>

<button className="reject">

<FaTimesCircle/>

Reject

</button>

</div>

);

}

export default ActionButtons;