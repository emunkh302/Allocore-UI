import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:4000/api",
});

export const getRootBeers = () => {
  return apiClient.get("/drinks");
};

export const getRootBeerById = (id) => {
  return apiClient.get(`/drinks/${id}`);
};

export const createDrink = (drinkData) => {
  return apiClient.post("/drinks", drinkData);
};

export const getReviewsByDrinkId = (drinkId) => {
  return apiClient.get(`/drinks/${drinkId}/reviews`);
};

export const addReview = (drinkId, reviewData) => {
  return apiClient.post(`/drinks/${drinkId}/reviews`, reviewData);
};

export const uploadImage = (drinkId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  return apiClient.post(`/drinks/${drinkId}/pictures`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const searchDrinks = (query) => {
  return apiClient.get(`/drinks?name=${query}`);
};

export const deleteDrink = (id) => {
  return apiClient.delete(`/drinks/${id}`);
};

export const updateDrink = (id, drinkData) => {
  return apiClient.put(`/drinks/${id}`, drinkData);
};

export const deleteImage = (drinkId, pictureId) => {
  return apiClient.delete(`/drinks/${drinkId}/pictures/${pictureId}`);
 };

 export const deleteReview = (drinkId, reviewId) => {
  return apiClient.delete(`/drinks/${drinkId}/reviews/${reviewId}`);
};

export const updateReview = (drinkId, reviewId, reviewData) => {
  return apiClient.put(`/drinks/${drinkId}/reviews/${reviewId}`, reviewData);
};