import React from "react";
import "./Payment.css";

const Payment = () => {
  return (
    <div className="payment-form-container">
      <h1 className="logo">ROUTECRAFT</h1>
      <div className="profile-picture-section">
        <div className="profile-picture">👤</div>
        <button className="edit-button">✏️</button>
      </div>
      <form className="payment-form">
        <label className="form-label">NAME</label>
        <input type="text" placeholder="Name" className="input-field" />
        <label className="form-label">CARD NUMBER</label>
        <input type="text" placeholder="Card Number" className="input-field" />
        <div className="form-row">
          <div className="form-column">
            <label className="form-label">EXPIRE</label>
            <input type="text" placeholder="MM/YY" className="input-field" />
          </div>
          <div className="form-column">
            <label className="form-label">CVV</label>
            <input type="text" placeholder="CVV" className="input-field" />
          </div>
        </div>
        <div className="button-group">
          <button type="button" className="cancel-btn">CANCEL</button>
          <button type="submit" className="pay-btn">PAY</button>
        </div>
      </form>
    </div>
  );
};

export default Payment;
