import "./InterviewCalendar.css";

import {
  FaChevronLeft,
  FaChevronRight,
  FaClock,
} from "react-icons/fa";

function InterviewCalendar() {

  const days = ["Mo","Tu","We","Th","Fr","Sa","Su"];

  const dates = [
    "", "", 1,2,3,4,5,
    6,7,8,9,10,11,12,
    13,14,15,16,17,18,19,
    20,21,22,23,24,25,26,
    27,28,29,30,31
  ];

  return (

    <div className="calendar-card">

      <div className="calendar-header">

        <h3>Interview Calendar</h3>

        <div className="calendar-nav">

          <button><FaChevronLeft /></button>

          <span>October 2023</span>

          <button><FaChevronRight /></button>

        </div>

      </div>

      <div className="calendar-grid">

        {days.map(day=>(
          <div className="day-name" key={day}>
            {day}
          </div>
        ))}

        {dates.map((date,index)=>(

          <div
            key={index}
            className={
              date===24
              ? "calendar-date active"
              : "calendar-date"
            }
          >
            {date}
          </div>

        ))}

      </div>

      <div className="today-interviews">

        <h4>Today's Schedule</h4>

        <div className="today-item">

          <FaClock />

          <div>

            <strong>10:30 AM</strong>

            <p>Sarah Jenkins</p>

          </div>

        </div>

        <div className="today-item">

          <FaClock />

          <div>

            <strong>2:00 PM</strong>

            <p>Marcus Brown</p>

          </div>

        </div>

      </div>

    </div>

  );

}

export default InterviewCalendar;