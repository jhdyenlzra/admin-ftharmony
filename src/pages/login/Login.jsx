import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import "./login.scss";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);

  // Standard login with email and password
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
        
      if (error) {
        setError(error.message);
      } else if (data.session) {
        dispatch({ type: "LOGIN", payload: data.session.user });
        navigate("/"); // Redirect to dashboard
      } else {
        setError("Unexpected error. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred.");
    }
  };

  // Login with Google
  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });

      if (error) {
        setError(error.message);
      }
    } catch (err) {
      console.error("Google login error:", err);
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div className="login-page">
      <div className="image-section"></div>
      <div className="form-section">
        <h1>Welcome to Admin</h1>
        <p>Please login to continue</p>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
          {error && <span className="error-message">{error}</span>}
        </form>
        <button onClick={handleGoogleLogin} className="btn google-login">
          Login with Google
        </button>
        <div className="signup-link">
          <p>
            Don't have an account?{" "}
            <span onClick={() => navigate("/signup")}>Sign Up</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
