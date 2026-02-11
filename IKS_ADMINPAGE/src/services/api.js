// src/services/api.js
import axios from 'axios';

const BASE_URL = (import.meta.env && import.meta.env.VITE_BACKEND_URL)

const API_URL = `${BASE_URL}/person`;

export const peopleService = {
    // Get all people
    getAll: async () => {
        const response = await axios.get(`${API_URL}/getpeople`);
        return response.data;
    },

    // Add a new person
    create: async (formData) => {
        const response = await axios.post(`${API_URL}/addperson`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // Update existing person
    update: async (id, formData) => {
        const response = await axios.put(`${API_URL}/update/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // Delete a person
    delete: async (id) => {
        const response = await axios.delete(`${API_URL}/delete/${id}`);
        return response.data;
    }
};