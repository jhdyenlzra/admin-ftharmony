import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import "./signup.scss";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data.user) {
        // Insert additional user info into 'users' table
        const { error: insertError } = await supabase.from("users").insert([
          { id: data.user.id, email, full_name: fullName },
        ]);

        if (insertError) {
          setError(insertError.message);
          return;
        }

        setSuccess(true);
        navigate("/login"); // Redirect to login page
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("Unexpected error occurred.");
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });

      if (error) {
        setError(error.message);
      }
    } catch (err) {
      console.error("Google signup error:", err);
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div className="signup-page">
      <div className="image-section"></div>
      <div className="form-section">
        <h1>Welcome to Admin</h1>
        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
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
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">Sign Up</button>
          {error && <span className="error-message">{error}</span>}
          {success && (
            <span className="success-message">
              Signup successful!{" "}
              <span onClick={() => navigate("/login")}>Log in</span>
            </span>
          )}
        </form>
        <button onClick={handleGoogleSignup} className="btn google-signup">
          Sign Up with Google
        </button>
        <p className="redirect-message">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")} className="signin-link">
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
