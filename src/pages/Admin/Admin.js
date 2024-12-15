import React from "react";
import "./Admin.css";

const Admin = () => {
  const handleDeleteRoute = () => {
    alert("Route deleted successfully!");
  };

  const handleDeleteProfile = () => {
    alert("Profile deleted successfully!");
  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">ADMIN</h1>

      {/* Profile Section */}
      <div className="section">
        <div className="admin-icon">
          <img
            src="https://via.placeholder.com/100x100.png?text=Profile+Icon"
            alt="Admin Profile"
            className="profile-icon"
          />
        </div>
        <p className="section-title">(ROUTE)</p>
        <div className="route-image-container">
          <img
            src="https://via.placeholder.com/300x200.png?text=Route+Map"
            alt="Route"
            className="route-image"
          />
        </div>
        <button className="delete-button" onClick={handleDeleteRoute}>
          DELETE
        </button>
      </div>

      {/* Delete Profile Section */}
      <div className="section">
        <p className="section-title">(PROFILE)</p>
        <div className="profile-icon-container">
          <img
            src="https://via.placeholder.com/80x80.png?text=User+Icon"
            alt="Profile"
            className="profile-small-icon"
          />
        </div>
        <button className="delete-button" onClick={handleDeleteProfile}>
          DELETE
        </button>
      </div>
    </div>
  );
};

export default Admin;
