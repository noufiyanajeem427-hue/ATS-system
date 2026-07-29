import "./UpcomingInterviews.css";
import InterviewCard from "./InterviewCard";

import { useEffect, useState } from "react";
import { getInterviews } from "../../../../services/interviewService";

function UpcomingInterviews() {

  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const res = await getInterviews();

      const upcoming = res.data.filter(
        (interview) => interview.status === "Scheduled");

        setInterviews(upcoming);
    } catch (err) {
      console.error("Error fetching interviews", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h3>Loading Interviews...</h3>;
  }

  return (

    <div className="upcoming-card">

      <div className="upcoming-header">

        <h2>Upcoming Interviews</h2>

        <span className="active-badge">
          {interviews.length} Active
        </span>

      </div>

      {interviews.map((item) => (

        <InterviewCard
          key={item._id}
          name={item.candidate?.fullName}
          role={item.interviewType}
          team={item.interviewer}
          time={item.time}
          status={item.status}
          aiMatch="95%"
        />

      ))}

    </div>

  );

}

export default UpcomingInterviews;