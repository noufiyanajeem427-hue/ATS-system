import "./RecruiterNotes.css";
import { FaStickyNote } from "react-icons/fa";
import { useState } from "react";

function RecruiterNotes() {

  const [notes, setNotes] = useState(
    "Candidate has excellent communication skills and a strong Python foundation. Recommended for the technical interview round."
  );

  return (

    <div className="notes-card">

    <div className="notes-title">

        <div className="notes-icon">
            <FaStickyNote />
        </div>

        <div>
            <h2>Recruiter Notes</h2>
            <p>Private notes visible only to recruiters</p>
        </div>

    </div>

    <textarea
        defaultValue="Candidate has excellent communication skills and a strong Python foundation. Recommended for the technical interview round."
    />

    <div className="notes-footer">

        <span>Last updated • Today 11:35 AM</span>

        <button>Save Notes</button>

    </div>

</div>

  );

}

export default RecruiterNotes;