import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getRootBeerById, updateDrink } from '../services/api';
import DrinkForm from '../components/drinkFrom/DrinkForm';

function EditDrinkPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [drink, setDrink] = useState(null);

  useEffect(() => {
    getRootBeerById(id).then(response => {
      setDrink(response.data);
    });
  }, [id]);

  const handleUpdate = async (formData) => {
    try {
      await updateDrink(id, formData);
      navigate(`/rootbeer/${id}`); 
    } catch (error) {
      console.error('Failed to update drink:', error);
      alert('Error: Could not update drink.');
    }
  };

  if (!drink) {
    return <div>Loading...</div>;
  }

  return (
    <div className="add-drink-container"> 
      <header className="add-drink-header">
        <Link to={`/rootbeer/${id}`} className="back-link">
          ← Back to Details
        </Link>
        <h1>Edit {drink.name}</h1>
      </header>
      <main>
        <DrinkForm onSubmit={handleUpdate} initialData={drink} />
      </main>
    </div>
  );
}

export default EditDrinkPage;