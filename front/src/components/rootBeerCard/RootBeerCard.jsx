import React from "react";
import { Link } from "react-router-dom";
import "./RootBeerCard.css";

function RootBeerCard({ beer }) {
  const imageUrl =
    beer.Pictures && beer.Pictures.length > 0
      ? `http://localhost:4000/${beer.Pictures[0].path}`
      : "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmVlcnxlbnwwfHwwfHx8MA%3D%3D";

  const renderStars = (rating) => {
    const fullStars = Math.round(rating);
    const emptyStars = 5 - fullStars;
    return (
      <div className="star-rating">
        {"★".repeat(fullStars)}
        {"☆".repeat(emptyStars)}
      </div>
    );
  };

  return (
    <Link to={`/rootbeer/${beer.id}`} className="root-beer-card">
      <div className="card-image-container">
        <img src={imageUrl} alt={beer.name} className="card-image" />
        <div className="card-image-overlay"></div>
      </div>
      <div className="card-content">
        <h3 className="card-title">{beer.name}</h3>
        <div className="card-footer">
          {renderStars(beer.reviewAverageRating)}
          <span className="card-review-count">
            ({beer.reviewCount} reviews)
          </span>
        </div>
      </div>
    </Link>
  );
}

export default RootBeerCard;
