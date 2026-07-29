import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../../../../services/authService";
import "./ResetPasswordForm.css";

function ResetPasswordForm() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  try {
    const data = await resetPassword(token, password);

    alert(data.message);

    navigate("/login");

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
            Reset Password
          </span>

          <h2>Create New Password</h2>

          <p>
            Enter your new password below.
          </p>

          <form onSubmit={handleSubmit}>

            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button
              type="submit"
              className="login-btn"
            >
              Reset Password
            </button>

          </form>

        </div>

      </div>
    </section>
  );
}

export default ResetPasswordForm;