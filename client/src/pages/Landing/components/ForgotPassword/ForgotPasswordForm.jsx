import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword } from "../../../../services/authService";
import "./ForgotPasswordForm.css";
import { FaArrowLeft } from "react-icons/fa";

function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const data = await forgotPassword(email);

    alert(data.message);
    navigate(`/reset-password/${data.resetLink.split("/").pop()}`);
    
  } catch (error) {
    alert(
      error.response?.data?.message ||
      "Something went wrong."
    );
  }
};
  return (
    <section className="login">

      <div className="login-container">

        <div className="login-right">

          <span className="login-tag">
            Forgot Password
          </span>

          <h2>Reset Password</h2>

          <p>
            Enter your registered email.
          </p>

          <form onSubmit={handleSubmit}>

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />

            <button
              type="submit"
              className="login-btn"
            >
              Send Reset Link
            </button>

          </form>

          <div className="login-links">
            <Link to="/login" className="back-btn">
              <FaArrowLeft />
              <span>Back</span>
            </Link>
          </div>

        </div>

      </div>

    </section>
  );
}

export default ForgotPasswordForm;