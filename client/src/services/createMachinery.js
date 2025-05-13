import axios from 'axios';

/**
 * Sends a POST request to create a new machinery listing.
 * @param {FormData} formData - FormData instance containing machinery fields and files.
 * @returns {Promise} Axios response promise.
 */
export const createMachinery = (formData) => {
    return axios.post('/api/machinery', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};
