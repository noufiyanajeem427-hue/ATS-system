import "./InterviewManagement.css";

import InterviewHeader from "./components/InterviewHeader";
import UpcomingInterviews from "./components/UpcomingInterviews";
import PendingFeedback from "./components/PendingFeedback";
import SchedulingQueue from "./components/SchedulingQueue";
import InterviewInsights from "./components/InterviewInsights";
import InterviewCalendar from "./components/InterviewCalendar";

function InterviewManagement() {
  return (
    <div className="interview-page">

      <InterviewHeader />

      <div className="interview-layout">

        <div className="left-column">
          <UpcomingInterviews />
        </div>

        <div className="right-column">

          <PendingFeedback />

          <SchedulingQueue />

          <InterviewCalendar />

        </div>

      </div>

      <InterviewInsights />

    </div>
  );
}

export default InterviewManagement;