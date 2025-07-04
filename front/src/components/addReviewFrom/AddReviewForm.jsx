import React, { useState } from "react";
import { addReview } from "../../services/api";
import "./AddReviewForm.css";

function AddReviewForm({ drinkId, onReviewAdded }) {
  const [rating, setRating] = useState(5);
  const [description, setDescription] = useState("");
  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!description || !userName) {
      setError("Please fill out all fields.");
      return;
    }

    const reviewData = {
      rating: Number(rating),
      description,
      user_name: userName,
    };

    try {
      const response = await addReview(drinkId, reviewData);
      onReviewAdded(response.data);
      setDescription("");
      setUserName("");
      setRating(5);
      setError("");
    } catch (err) {
      console.error("Failed to add review:", err);
      setError("Could not submit review.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-review-form">
      <h3>Add Your Review</h3>
      {error && <p className="form-error">{error}</p>}
      <div className="form-group">
        <label>Your Name</label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Rating: {rating} ★</label>
        <input
          type="range"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Review</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What did you think?"
        />
      </div>
      <button type="submit" className="submit-button">
        Submit Review
      </button>
    </form>
  );
}

export default AddReviewForm;
