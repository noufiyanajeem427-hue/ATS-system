import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./RegisterForm.css";
import registerImage from "../../../../assets/images/register/register.webp";
import { register } from "../../../../services/authService";

function RegisterForm() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("candidate");

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};

      if (!fullName.trim()) {
        newErrors.fullName = "Full name is required.";
      }

      if (!email.trim()) {
        newErrors.email = "Email is required.";
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        newErrors.email = "Please enter a valid email.";
      }

      if (!password) {
        newErrors.password = "Password is required.";
      } else if (password.length < 8) {
        newErrors.password = "Password must be at least 8 characters.";
      }

      if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match.";
      }

      setErrors(newErrors);

      return Object.keys(newErrors).length === 0;
    };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const data = await register({
        fullName,
        email,
        password,
        role,
      });

      localStorage.setItem("user", JSON.stringify(data));

      alert("Registration Successful!");

      navigate("/login");

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="register">

      <div className="register-container">

        {/* Left Side */}
        <div className="register-left">

          <img
            src={registerImage}
            alt="Register"
          />

        </div>

        {/* Right Side */}
        <div className="register-right">

          <span className="register-tag">
            Create Account
          </span>

          <h2>Join NexHire</h2>

          <p>
            Create your account to begin your recruitment journey.
          </p>

          <form onSubmit={handleSubmit}>

           <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            {errors.fullName && (
              <p className="error">{errors.fullName}</p>
            )}

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {errors.email && (
              <p className="error">{errors.email}</p>
            )}

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {errors.password && (
              <p className="error">{errors.password}</p>
            )}
             <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              {errors.confirmPassword && (
                <p className="error">{errors.confirmPassword}</p>
              )}

            <div className="role-select">
              <label>
                <input
                  type="radio"
                  name="role"
                  value="candidate"
                  checked={role === "candidate"}
                  onChange={(e) => setRole(e.target.value)}
                />
                Candidate
              </label>

              <label>
                <input
                  type="radio"
                  name="role"
                  value="recruiter"
                  checked={role === "recruiter"}
                  onChange={(e) => setRole(e.target.value)}
                />
                Recruiter
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

          </form>

          <div className="register-links">

            <p>
              Already have an account?

              <Link to="/login">
                Login
              </Link>

            </p>

          </div>

        </div>

      </div>

    </section>
  );
}

export default RegisterForm;