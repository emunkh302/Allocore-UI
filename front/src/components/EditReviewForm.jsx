import React, { useState } from 'react';

function EditReviewForm({ review, onSubmit, onCancel }) {
  // Add state for the rating, initialized with the current review's rating
  const [rating, setRating] = useState(review.rating);
  const [description, setDescription] = useState(review.description);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass back an object with both the description and the new rating
    onSubmit({ description, rating: Number(rating) });
  };

  return (
    <form onSubmit={handleSubmit} className="edit-review-form">
      {/* Add a range slider for the rating */}
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
          required
        />
      </div>
      
      <div className="edit-form-actions">
        <button type="submit">Save Changes</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

export default EditReviewForm;
