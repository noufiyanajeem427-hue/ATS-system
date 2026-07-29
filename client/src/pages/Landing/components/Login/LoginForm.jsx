import "./LoginForm.css";
import { Link, useNavigate } from "react-router-dom";
import loginImage from "../../../../assets/images/login/login.webp";
import { useState } from "react";
import { login } from "../../../../services/authService";
function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validate()) return;

  try {
    setLoading(true);

    const data = await login({
      email,
      password,
    });

    localStorage.setItem("user", JSON.stringify(data));

    alert("Login Successful!");

    if (data.role === "recruiter") {
      navigate("/hr/dashboard");
    } else {
      navigate("/candidate/dashboard");
    }

   } catch (error) {
    alert(
      error.response?.data?.message ||
      "Invalid email or password."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <section className="login">
      <div className="login-container">

        {/* Left */}
        <div className="login-left">
          <img
            src={loginImage}
            alt="Login"
          />
        </div>

        {/* Right */}
        <div className="login-right">

          <span className="login-tag">
            Welcome Back
          </span>

          <h2>Sign in to NexHire</h2>

          <p>
            Login to continue your recruitment journey.
          </p>

          <form onSubmit={handleSubmit}>

            {/* Email */}

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {errors.email && (
              <p className="error">{errors.email}</p>
            )}

            {/* Password */}

            <div className="password-wrapper">

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {/* Keep your existing eye icon/button here */}

            </div>

            {errors.password && (
              <p className="error">{errors.password}</p>
            )}

            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          <div className="login-links">

            <Link to="/forgot-password">
              Forgot Password?
            </Link>
            <br></br>
           <p>
              Don't have an account?{" "}
              <Link to="/register">
                Register
              </Link>
            </p>

          </div>

        </div>

      </div>
    </section>
  );
}

export default LoginForm;