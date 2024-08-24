import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { getId } from '../Utils/ApiUtils';
import Cookies from 'js-cookie';
import NoProfile from "../../assets/noprofile.png";

function UserPanel() {
    const [isLogoutPopupOpen, setIsLogoutPopupOpen] = useState(false);
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const [profileImg, setProfileImg] = useState(null);
    const [username, setUsername] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [profileID, setProfileID] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfileIDAndUserData = async () => {
            try {
                const id = await getId('profileID');
                setProfileID(id);

                if (id) {
                    const response = await axios.get(`http://localhost:4000/users/profile/get/${id}`);
                    setUsername(response.data.name);
                    setProfileImg(response.data.profile_img);

                    const suggestedResponse = await axios.get(`http://localhost:4000/users/otherUsers`);
                    const filteredUsers = suggestedResponse.data.filter(user => user._id !== id);
                    setSuggestedUsers(filteredUsers);
                }
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };

        fetchProfileIDAndUserData();
    }, []);

    const handleUserClick = (userId) => {
        navigate(`/profile/${userId}`);
        console.log(userId)
    };

    const handleLogout = () => {
        axios.get('http://localhost:4000/logout', {
            withCredentials: true
        })
            .then(response => {
                if (response.status === 200) {
                    console.log('Logged out successfully');
                } else {
                    console.error('Logout failed');
                }
            })
            .catch(error => {
                console.error('Error during logout:', error);
            });

        localStorage.removeItem('token');
        Cookies.remove('token');
        navigate('/');
        setIsLogoutPopupOpen(false);
    };

    const handleNoClick = () => {
        setIsLogoutPopupOpen(false);
    };

    const filteredUsers = suggestedUsers.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className='pl-5 pr-5 pt-10'>
            <div className="gradient2 p-2 pl-3 flex items-center justify-between border w-[18vw] h-[10vh] rounded-full shadow-[0px_0px_10px_rgba(0,0,0,0.08)] overflow-hidden">
                <div className='flex items-center'>
                    <img className='h-16 w-16 rounded-full overflow-hidden' src={profileImg || NoProfile} alt="" />
                    <Link to='/profile'>
                        <h3 className='post-username pl-4 poppins text-white'>{username}</h3>
                    </Link>
                </div>
                <div className="toggle-switch mr-5">
                    <input onClick={() => setIsLogoutPopupOpen(prevState => !prevState)} checked={isLogoutPopupOpen} className="toggle-input" id="toggle" type="checkbox" />
                    <label className="toggle-label" htmlFor="toggle"></label>
                </div>
            </div>

            {isLogoutPopupOpen && (
                <div>
                    <div className="overlay"></div>
                    <div className="border logout-popup p-5 rounded flex flex-col justify-around text-center">
                        <h2>Are you sure you want to logout?</h2>
                        <div className='flex justify-around'>
                            <button onClick={handleLogout} className='py-3 px-5 rounded gradient1 text-white font-bold hover:bg-red-400'>Yes</button>
                            <button onClick={handleNoClick} className='py-3 px-5 border rounded text-black font-bold hover:bg-gray-50'>No</button>
                        </div>
                    </div>
                </div>
            )}

            <center className='pt-12'>
                <h1 className='suggestion-title mb-6'>Other users</h1>
            </center>
            <input
                className='w-[20vw] search border border-gray-400 rounded-full px-8 py-4 mb-4'
                id="genreSelect"
                placeholder='Search...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className='border border-gray-400 suggestion-scroll h-[42vh] overflow-scroll p-2 shadow-[0px_0px_10px_rgba(0,0,0,0.08)] rounded-lg'>
                {filteredUsers.map((user, index) => (
                    <div key={index} onClick={() => handleUserClick(user._id)} className="cm-panel profile-panel bg-white rounded-lg flex items-center p-5 h-20 hover:bg-gray-100 hover:cursor-pointer transition">
                        <div className="profile-img w-14 h-14 rounded-full flex justify-center items-center overflow-hidden">
                            <img src={user.profile_img || NoProfile} alt="Profile" />
                        </div>
                        <h1 className='profile-name p-4'>{user.name}</h1>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UserPanel;
