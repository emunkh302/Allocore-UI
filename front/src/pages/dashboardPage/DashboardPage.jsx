import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import RootBeerCard from "../../components/rootBeerCard/RootBeerCard";
import SearchBar from "../../components/searchBar/SearchBar";
import { getRootBeers, searchDrinks } from "../../services/api";
import "./DashboardPage.css";

function DashboardPage() {
  const [beers, setBeers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchDrinks = () => {
      setLoading(true);
      setError(null);

      const apiCall = searchQuery ? searchDrinks(searchQuery) : getRootBeers();

      apiCall
        .then((response) => {
          setBeers(response.data.items);
        })
        .catch((err) => {
          console.error("Failed to fetch drinks:", err);
          setError("Could not load drinks. Please try again later.");
        })
        .finally(() => {
          setLoading(false);
        });
    };

    const timerId = setTimeout(fetchDrinks, 300);
    return () => clearTimeout(timerId);
  }, [searchQuery]);

  const renderContent = () => {
    if (loading) {
      return <div className="loader"></div>;
    }
    if (error) {
      return <p className="error-message">{error}</p>;
    }
    if (beers.length === 0) {
      return (
        <div className="info-message-container">
          <p>No root beers found. Why not add the first one?</p>
        </div>
      );
    }
    return (
      <div className="card-grid">
        {beers.map((beer) => (
          <RootBeerCard key={beer.id} beer={beer} />
        ))}
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Reviews on Tap 🍻</h1>
        <p>Your ultimate guide to the best root beers.</p>
        <Link to="/add" className="add-link-button">
          + Add New Root Beer
        </Link>
      </header>
      <main className="dashboard-main">
        <SearchBar onSearch={setSearchQuery} />
        {renderContent()}
      </main>
    </div>
  );
}

export default DashboardPage;
