import api from '../config/apiConfig'
import axios from "axios";

const login =  async (credentials) => {
        try {
            console.log( "đối tượng gui lên backend credentials mà server nhận:", JSON.stringify(credentials, null, 2) );
            const response = await axios.post('http://localhost:8080/api/auth/login', credentials, {headers: {
                "Content-Type": "application/json"
            }});
            console.log("Phản hồi từ server:", response.data);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    }
const getProfile = async () => {
    try {
        const response = await api.get('/auth/profile');
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch profile');
    }
}
export {login, getProfile};
