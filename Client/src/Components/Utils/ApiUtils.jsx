import React, { useState } from 'react';
import axios from 'axios';

export const getId = async (idType) => {
    try {
        const response = await axios.get(`http://localhost:4000/users/token/getId/${idType}`);
        console.log(response.data);
        return response.data;
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
        setUserId(userIdData?.id);

        // const profileIdData = await getId('profileID');
        // setProfileId(profileIdData?.id);
    };

    return (
        <div>
            <button onClick={fetchIds} className='border'>Fetch IDs</button>
            <p>User ID: {userId}</p>
            {/* <p>Profile ID: {profileId}</p> */}
        </div>
    );
};

export default MyComponent;
