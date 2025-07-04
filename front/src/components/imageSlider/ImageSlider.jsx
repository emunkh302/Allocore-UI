import React, { useState } from "react";
import "./ImageSlider.css";

function ImageSlider({ pictures, onDelete }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!pictures || pictures.length === 0) {
    return (
      <div className="image-slider-container">
        <img
          src="https://images.unsplash.com/photo-1623932767935-93404255142f?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600"
          alt="Default root beer"
          className="slider-image"
        />
      </div>
    );
  }

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? pictures.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === pictures.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const currentPicture = pictures[currentIndex];

  return (
    <div className="image-slider-container">
      <div className="slider-arrow left" onClick={goToPrevious}>
        &#10094;
      </div>
      <div className="slider-arrow right" onClick={goToNext}>
        &#10095;
      </div>

      <div className="slider-image-wrapper">
        <img
          src={`http://localhost:4000/${currentPicture.path}`}
          alt={currentPicture.name}
          className="slider-image"
        />
        <button
          onClick={() => onDelete(currentPicture.id)}
          className="delete-image-button"
        >
          &times;
        </button>
      </div>

      <div className="dots-container">
        {pictures.map((pic, index) => (
          <div
            key={pic.id}
            className={`dot ${currentIndex === index ? "active" : ""}`}
            onClick={() => setCurrentIndex(index)}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default ImageSlider;
