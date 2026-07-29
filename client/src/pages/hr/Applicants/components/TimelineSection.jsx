import "./TimelineSection.css";

function TimelineSection() {

const timeline=[

["Applied","12 Oct 2023"],

["AI Screening","13 Oct 2023"],

["Recruiter Review","15 Oct 2023"],

["Interview Scheduled","18 Oct 2023"]

];

return(

<div className="timeline-card">

<h2>Application Timeline</h2>

{timeline.map((item,index)=>(

<div className="timeline-item" key={index}>

<div className="dot"></div>

<div>

<h4>{item[0]}</h4>

<p>{item[1]}</p>

</div>

</div>

))}

</div>

)

}

export default TimelineSection;