import React, { useState } from "react";
import { register } from "../services/auth";

const Register = ({ onRegisterSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate password match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      await register(username, password);
      setIsLoading(false);
      if (onRegisterSuccess) {
        onRegisterSuccess();
      }
    } catch (err) {
      setIsLoading(false);
      setError(err.message || "Registration failed. Please try again.");
    }
  };
  
  return (
    <div className="auth-form" style={{ maxWidth: "400px", margin: "0 auto" }}>
      <h2>Register</h2>
      <p style={{ marginBottom: "1.5rem", color: "#6c757d" }}>
        Create an account to access the Choikk Forum. All content is restricted to members only.
      </p>
      {error && (
        <div style={{ 
          backgroundColor: "#f8d7da", 
          color: "#721c24", 
          padding: "0.75rem", 
          borderRadius: "4px",
          marginBottom: "1rem"
        }}>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group" style={{ marginBottom: "1rem" }}>
          <label htmlFor="username" style={{ display: "block", marginBottom: "0.5rem" }}>Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ced4da" }}
            required
          />
        </div>
        <div className="form-group" style={{ marginBottom: "1rem" }}>
          <label htmlFor="password" style={{ display: "block", marginBottom: "0.5rem" }}>Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ced4da" }}
            required
          />
        </div>
        <div className="form-group" style={{ marginBottom: "1.5rem" }}>
          <label htmlFor="confirmPassword" style={{ display: "block", marginBottom: "0.5rem" }}>Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ced4da" }}
            required
          />
        </div>
        <button 
          type="submit" 
          disabled={isLoading}
          style={{ 
            padding: "0.5rem 1rem", 
            backgroundColor: "#28a745", 
            color: "white", 
            border: "none", 
            borderRadius: "4px",
            cursor: isLoading ? "not-allowed" : "pointer",
            width: "100%"
          }}
        >
          {isLoading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;
