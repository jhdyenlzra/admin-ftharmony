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
  const [verificationSent, setVerificationSent] = useState(false);
  const navigate = useNavigate();

  // Validate email is a Gmail address
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
    return emailRegex.test(email);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    setVerificationSent(false);

    try {
      // First, check if the email exists in auth
      const { data: authUser } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      console.log('Auth signup response:', authUser); // Debug log

      if (!authUser?.user?.id) {
        throw new Error('Failed to create auth user');
      }

      // Insert into users table
      const { error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: authUser.user.id,
            email: email,
            full_name: fullName,
          }
        ]);

      if (profileError) {
        console.error('Profile creation error:', profileError);
        throw profileError;
      }

      setVerificationSent(true);
      // Clear form
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setFullName("");

    } catch (error) {
      console.error('Detailed error:', error); // Debug log
      
      if (error.message?.includes("User already registered")) {
        setError("This email is already registered. Please use a different email or try logging in.");
      } else if (error.message?.includes("Password")) {
        setError(error.message);
      } else {
        setError(`Signup failed: ${error.message}`); // More specific error message
      }
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/login'
        }
      });

      if (error) throw error;
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="signup-page">
      <div className="image-section"></div>
      <div className="form-section">
        <h1>Welcome to Admin</h1>
        {verificationSent ? (
          <div className="verification-message">
            <h2>Please verify your email</h2>
            <p>A verification link has been sent to {email}.</p>
            <p>Please check your email and click the link to verify your account.</p>
            <button onClick={() => navigate("/login")} className="login-button">
              Go to Login
            </button>
          </div>
        ) : (
          <>
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
                placeholder="Gmail Address Only"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null); // Clear error when typing
                }}
                required
              />
              <input
                type="password"
                placeholder="Password (min 6 characters)"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                required
                minLength={6}
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError(null);
                }}
                required
              />
              {error && <div className="error-message">{error}</div>}
              <button type="submit" className="signup-button">
                Sign Up
              </button>
            </form>
            
            <button onClick={handleGoogleSignup} className="google-signup">
              Sign Up with Google
            </button>
            
            <p className="redirect-message">
              Already have an account?{" "}
              <span onClick={() => navigate("/login")} className="signin-link">
                Sign in
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Signup;
