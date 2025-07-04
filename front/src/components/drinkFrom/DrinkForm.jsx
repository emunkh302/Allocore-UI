import React, { useState, useEffect } from "react";
import "./DrinkForm.css";
function DrinkForm({ onSubmit, initialData = null, isLoading = false }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description);
    }
  }, [initialData]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name.trim() || !description.trim()) {
      setError("Please fill out all fields.");
      return;
    }
    setError(""); 
    onSubmit({ name, description });
  };

  return (
    <form onSubmit={handleSubmit} className="drink-form">
      {error && <p className="form-error">{error}</p>}
      <div className="form-group">
        <label htmlFor="name">Root Beer Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., A&W Root Beer"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g., A classic with a creamy vanilla flavor."
          rows="4"
          required
        />
      </div>
      <button type="submit" className="submit-button" disabled={isLoading}>
        {isLoading
          ? "Saving..."
          : initialData
          ? "Update Drink"
          : "Create Drink"}
      </button>
    </form>
  );
}

export default DrinkForm;
