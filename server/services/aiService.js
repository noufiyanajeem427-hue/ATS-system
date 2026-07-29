import axios from "axios";
import FormData from "form-data";
import fs from "fs";

export const analyzeResume = async (resumePath, jobDescription) => {

  const formData = new FormData();

  formData.append("resume", fs.createReadStream(resumePath));

  formData.append("job_description", jobDescription);

  const response = await axios.post(
    "http://127.0.0.1:5001/match-resume",
    formData,
    {
      headers: formData.getHeaders(),
    }
  );

  return response.data;
};