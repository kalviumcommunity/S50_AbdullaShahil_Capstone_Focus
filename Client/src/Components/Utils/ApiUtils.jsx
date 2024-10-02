import axios from 'axios';

export const getId = async (idType) => {
    try {
        const response = await axios.post(
            `https://s50-abdullashahil-capstone-focus.onrender.com/users/token/getId/${idType}`,
            {},
            { withCredentials: true }
        );
        console.log(response.data);
        
        return { id: response.data.id, name: response.data.name };
    } catch (error) {
        console.error(error);
        return null;
    }
};
