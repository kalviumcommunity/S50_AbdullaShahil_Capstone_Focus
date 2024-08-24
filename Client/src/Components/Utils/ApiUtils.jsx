import axios from 'axios';
import Cookies from 'js-cookie';

const token = Cookies.get("token")

export const getId = async (idType) => {
    try {
        const response = await axios.post(
            `http://localhost:4000/users/token/getId/${idType}`,
            { token },
            { withCredentials: true }
          );
        console.log(response.data);
        return response.data.id;
    } catch (error) {
        console.error(error);
        return null;
    }
};
