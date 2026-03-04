// src/services/api.js
import axios from 'axios';

const BASE_URL = (import.meta.env && import.meta.env.VITE_BACKEND_URL)

const API_URL = `${BASE_URL}/person`;
const EVENT_API = `${BASE_URL}/event`;
    
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

export const eventService = {
    getAll: async () => { 
        const response = await axios.get(`${EVENT_API}/getevents`); 
        return response.data; 
    },
    create: async (formData) => { 
        const response = await axios.post(`${EVENT_API}/addevent`, formData, { 
            headers: { 'Content-Type': 'multipart/form-data' } 
        }); 
        return response.data; 
    },
    update: async (id, formData) => { 
        const response = await axios.put(`${EVENT_API}/update/${id}`, formData, { 
            headers: { 'Content-Type': 'multipart/form-data' } 
        }); 
        return response.data; 
    },
    delete: async (id) => { 
        const response = await axios.delete(`${EVENT_API}/delete/${id}`); 
        return response.data; 
    }
};