import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/dashboardPage/DashboardPage';
import DetailsPage from './pages/detailsPage/DetailsPage';
import AddDrinkPage from './pages/addDrinkPage/AddDrinkPage';
import EditDrinkPage from './pages/EditDrinkPage';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/add" element={<AddDrinkPage />} />
        <Route path="/edit/:id" element={<EditDrinkPage />} />
        <Route path="/rootbeer/:id" element={<DetailsPage />} />
      </Routes>
    </div>
  );
}

export default App;