import React from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to Your Cycle Tracker</h1>
      <button className="home-button" onClick={() => navigate("/tracker")}>
        Go to Tracker
      </button>
    </div>
  );
};

export default Home;
