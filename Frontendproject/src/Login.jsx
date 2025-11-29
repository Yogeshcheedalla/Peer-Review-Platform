// Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Save token + user info
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role);
        localStorage.setItem("userId", data.user._id);
        localStorage.setItem("userName", data.user.name);

        // Redirect based on role
        if (data.user.role === "teacher") navigate("/teacher");
        else if (data.user.role === "admin") navigate("/admin");
        else navigate("/student");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error");
    }

    setLoading(false);
  };

  return (
    <div className="login-bg">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-logo">
          <span style={{ color: "#6a7dd6" }}>PeerReview</span>
        </div>

        <h2 className="login-title">Welcome Back</h2>
        <p className="login-desc">Please log in to your account.</p>

        <label>Email</label>
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="login-btn" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Log In"}
        </button>

        <button
          className="signup-btn"
          type="button"
          onClick={() => navigate("/signup")}
        >
          Sign Up
        </button>

        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}

export default Login;
