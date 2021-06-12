import React from "react";

import "../styles/Banner.css";
import imageLogo from "../styles/stashaway.png";

export const Banner = () => {
  return (
    <div className="container banner-container">
      <div className="row">
        <img width="10%" height="10%" src={imageLogo} />

        <div className="row banner-header">
          <p>Home</p>
          <p>Manage Deposits</p>
          <p>Refer a Friend</p>
          <p>Support</p>
          <p>Oliver</p>
        </div>
      </div>

      <div className="row" style={{ display: "block", margin: "2rem 0" }}>
        <p style={{ color: "lightseagreen" }}> &lt;- Overview</p>
        <h1>General Investing</h1>
      </div>

      <div className="row links-container">
        <div className="row links">
          <p className="clicked">Overview</p>
          <p>Assets</p>
          <p>Projection</p>
          <p>About Portfolio</p>
        </div>

        <div>
          <p>More Actions</p>
        </div>
      </div>
    </div>
  );
};

export default Banner;
