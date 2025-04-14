import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider } from "../firebase";
import { signInWithPopup } from 'firebase/auth';
import './SignUp.css'; 

const SignUp = () => {
 

  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      console.log("Starting Google Sign in...");
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Signed in successfully", result);

      const token = await result.user.getIdToken();

      const response = await fetch("http://localhost:3000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      const userData = await response.json();
      console.log("User Data:", userData);

      if (userData.newUser) {
        navigate("/onboarding");
      } else {
        navigate("/home");
      }

    } catch (error) {
      console.log("Error in Sign-in:", error);
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <button onClick={handleGoogleSignIn}>
        Sign In with Google
      </button>
    </div>
  );
};

export default SignUp;

