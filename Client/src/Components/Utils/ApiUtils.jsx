import axios from 'axios';
// import Cookies from 'js-cookie';

// const token = Cookies.get("token")

export const getId = async (idType) => {
    console.log(token)
    try {
        const response = await axios.post(
            `https://s50-abdullashahil-capstone-focus.onrender.com/users/token/getId/${idType}`,
            { },
            { withCredentials: true }
          );
        console.log(response.data);
        return response.data.id;
    } catch (error) {
        console.error(error);
        return null;
    }
};
