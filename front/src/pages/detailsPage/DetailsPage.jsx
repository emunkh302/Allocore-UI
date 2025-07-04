import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  getRootBeerById,
  getReviewsByDrinkId,
  deleteDrink,
  deleteImage,
  deleteReview,
  updateReview,
} from "../../services/api";
import ReviewList from "../../components/reviewList/ReviewList";
import AddReviewForm from "../../components/addReviewFrom/AddReviewForm";
import ImageUploader from "../../components/imageUploader/ImageUploader";
import ImageSlider from "../../components/imageSlider/ImageSlider";
import "./DetailsPage.css";

function DetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [drink, setDrink] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = () => {
    setLoading(true);
    Promise.all([getRootBeerById(id), getReviewsByDrinkId(id)])
      .then(([drinkResponse, reviewsResponse]) => {
        setDrink(drinkResponse.data);
        setReviews(reviewsResponse.data.items);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch page data:", err);
        setError("Could not load page data.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleReviewAdded = (newReview) => {
    setReviews([newReview, ...reviews]);
  };

  const handleUpdateReview = async (reviewId, updatedData) => {
    try {
      const response = await updateReview(id, reviewId, updatedData);
      setReviews(
        reviews.map((review) =>
          review.id === reviewId ? response.data : review
        )
      );
    } catch (error) {
      console.error("Failed to update review:", error);
      alert("Error: Could not update the review.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this root beer?")) {
      try {
        await deleteDrink(id);
        navigate("/");
      } catch (err) {
        console.error("Failed to delete drink:", err);
        alert("Could not delete drink.");
      }
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await deleteReview(id, reviewId);
        setReviews(reviews.filter((review) => review.id !== reviewId));
      } catch (error) {
        console.error("Failed to delete review:", error);
        alert("Error: Could not delete the review.");
      }
    }
  };

  const handleDeleteImage = async (pictureId) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      try {
        await deleteImage(id, pictureId);
        fetchData();
      } catch (error) {
        console.error("Failed to delete image:", error);
        alert("Error: Could not delete image.");
      }
    }
  };

  if (loading) {
    return <div className="loader">Loading...</div>;
  }

  if (error || !drink) {
    return <p className="error-message">{error || "Could not find drink."}</p>;
  }

  return (
    <div className="details-container">
      <Link to="/" className="back-link">
        ← Back to Dashboard
      </Link>
      <div className="details-content">
        <div className="details-image-section">
          <ImageSlider pictures={drink.Pictures} onDelete={handleDeleteImage} />
          <ImageUploader drinkId={id} onUploadSuccess={fetchData} />
        </div>

        <div className="details-info">
          <h1 className="details-title">{drink.name}</h1>
          <p className="details-brand">{drink.brand}</p>
          <p className="details-description">{drink.description}</p>
          <div className="actions-container">
            <Link to={`/edit/${drink.id}`} className="edit-link-button">
              Edit
            </Link>
            <button onClick={handleDelete} className="delete-button">
              Delete
            </button>
          </div>
        </div>
      </div>

      <AddReviewForm drinkId={id} onReviewAdded={handleReviewAdded} />
      <ReviewList
        reviews={reviews}
        onDeleteReview={handleDeleteReview}
        onUpdateReview={handleUpdateReview}
      />
    </div>
  );
}

export default DetailsPage;
