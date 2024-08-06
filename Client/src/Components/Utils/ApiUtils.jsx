import React, { useState } from 'react';
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

const MyComponent = () => {
    const [userId, setUserId] = useState(null);
    const [profileId, setProfileId] = useState(null);

    const fetchIds = async () => {
        const userIdData = await getId('userID');
        setUserId(userIdData);

        const profileIdData = await getId('profileID');
        setProfileId(profileIdData);
    };

    return (
        <div>
            <button onClick={fetchIds} className='border'>Fetch IDs</button>
            <p>User ID: {userId}</p>
            <p>Profile ID: {profileId}</p>
        </div>
    );
};

export default MyComponent;
