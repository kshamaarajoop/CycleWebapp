import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider } from "../firebase";
import { signInWithPopup } from 'firebase/auth';
import './SignUp.css'; 

const SignUp = () => {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();

      const response = await fetch("http://localhost:3000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      const userData = await response.json();
      if (userData.NewUser) {
        navigate("/onboarding");
      } else {
        navigate("/home");
      }

    } catch (error) {
      console.log("Error in Sign-in:", error);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h1 className="signup-title">Sign Up</h1>
        <button className="google-btn" onClick={handleGoogleSignIn}>
          Sign In with Google
        </button>
      </div>
    </div>
  );
};

export default SignUp;
