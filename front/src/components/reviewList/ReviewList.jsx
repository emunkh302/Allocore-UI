import React, { useState } from "react";
import EditReviewForm from "../EditReviewForm";
import "./ReviewList.css";

function ReviewList({ reviews, onDeleteReview, onUpdateReview }) {
  const [editingReviewId, setEditingReviewId] = useState(null);

  const handleUpdateSubmit = (reviewId, updatedData) => {
    onUpdateReview(reviewId, updatedData);
    setEditingReviewId(null);
  };

  if (!reviews || reviews.length === 0) {
    return <p style={{ color: "#ccc" }}>No reviews yet. Be the first!</p>;
  }

  return (
    <div className="review-list">
      <h2>Reviews</h2>
      {reviews.map((review) => (
        <div key={review.id} className="review-item">
          {editingReviewId === review.id ? (
            <EditReviewForm
              review={review}
              onSubmit={(updatedData) =>
                handleUpdateSubmit(review.id, updatedData)
              }
              onCancel={() => setEditingReviewId(null)}
            />
          ) : (
            <>
              <div className="review-actions">
                <button
                  onClick={() => setEditingReviewId(review.id)}
                  className="edit-review-button"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDeleteReview(review.id)}
                  className="delete-review-button"
                >
                  &times;
                </button>
              </div>
              <p className="review-text">"{review.description}"</p>
              <div className="review-footer">
                <span className="review-rating">
                  {"★".repeat(review.rating)}
                </span>
                <span className="review-author">- {review.user_name}</span>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default ReviewList;
