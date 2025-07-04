import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createDrink } from "../../services/api";
import DrinkForm from "../../components/drinkFrom/DrinkForm";
import "./AddDrinkPage.css";

function AddDrinkPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async (formData) => {
    setIsLoading(true);
    try {
      const response = await createDrink(formData);
      navigate(`/rootbeer/${response.data.id}`);
    } catch (error) {
      console.error("Failed to create drink:", error);
      alert("Error: Could not create the drink.");
      setIsLoading(false);
    }
  };

  return (
    <div className="add-drink-container">
      <header className="add-drink-header">
        <Link to="/" className="back-link">
          ← Back to Dashboard
        </Link>
        <h1>Add a New Root Beer</h1>
        <p>Fill out the details below to add a new drink to the collection.</p>
      </header>
      <main>
        <DrinkForm onSubmit={handleCreate} isLoading={isLoading} />
      </main>
    </div>
  );
}

export default AddDrinkPage;
