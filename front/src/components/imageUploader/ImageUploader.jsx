import React, { useState, useEffect } from "react";
import { uploadImage } from "../../services/api";
import "./ImageUploader.css";

function ImageUploader({ drinkId, onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  // Create a preview of the selected image
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const handleFileChange = (event) => {
    if (!event.target.files || event.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }
    setSelectedFile(event.target.files[0]);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setError("Please select a file first.");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      await uploadImage(drinkId, selectedFile);
      onUploadSuccess();
      setSelectedFile(null);
    } catch (err) {
      console.error("Failed to upload image:", err);
      setError("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="image-uploader">
      {preview ? (
        <div className="image-preview">
          <img src={preview} alt="Preview" />
        </div>
      ) : (
        <div className="upload-placeholder">
          <p>Select an image to preview</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="upload-form">
        <label htmlFor="file-upload" className="file-input-label">
          {selectedFile ? selectedFile.name : "Choose File"}
        </label>
        <input
          id="file-upload"
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          className="file-input"
        />

        <button
          type="submit"
          className="upload-button"
          disabled={isUploading || !selectedFile}
        >
          {isUploading ? "Uploading..." : "Upload"}
        </button>
      </form>
      {error && <p className="upload-error">{error}</p>}
    </div>
  );
}

export default ImageUploader;
