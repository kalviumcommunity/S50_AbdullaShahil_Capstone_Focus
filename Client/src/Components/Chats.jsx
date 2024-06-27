import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'tailwindcss/tailwind.css';
import Cookies from 'js-cookie';
import Header from './Home Components/Header';
import axios from 'axios';
import ActiveChat from './Chat Components/ActiveChat';

const ChatApp = () => {
    const navigate = useNavigate();
    const [allUsers, setAllUsers] = useState([]);
    const [communities, setCommunities] = useState([]);
    const [activeChatType, setActiveChatType] = useState('personal');
    const [activeChat, setActiveChat] = useState(null);
    const [viewInfo, setViewInfo] = useState(false);

    
    const toHome = () => {
        navigate("/home");
    };

    const toSettings = () => {
        navigate("/settings");
    };

    const toLensHub = () => {
        navigate("/lenshub");
    };

    const toCreateCommunity = () => {
        navigate("/createCommunity");
    };
    
    const username = Cookies.get("name") ? Cookies.get("name").replace(/\"/g, '') : '';
    const profilePic = 'https://www.famousbirthdays.com/headshots/russell-crowe-6.jpg';
    
   


    useEffect(() => {
        axios.get(`http://localhost:4000/users`)
            .then(response => {
                setAllUsers(response.data);
                console.log(response.data);
            })
            .catch(error => {
                console.log("error: ", error);
            });

            axios.get(`http://localhost:4000/communities/list/displayData`)
            .then(response => {
                setCommunities(response.data);
                console.log("communities", response.data);
            })
            .catch(error => {
                console.log("error: ", error);
            });
    }, []);

    const handleChatClick = (chat) => {
        setActiveChat(chat);
        setViewInfo(false);
        setMessages([]);
    };


    return (
        <div>
            <Header />
            <div className="flex justify-around">
                <div>
                    <div className='gradient1 mt-10 p-3 rounded-lg flex items-center hover:opacity-90 hover:cursor-pointer' onClick={toCreateCommunity}>
                        <button
                            className="plus pb-1 ml-3 text-white text-4xl cursor-pointer outline-none hover:rotate-90 duration-300"
                            title="Add New"
                        >+</button>
                        <h1 className='text-white poppins text-lg ml-5'>Create a group</h1>
                    </div>
                    <div className="category-panel gradient2 mt-4 lg:w-[20vw] h-fit border border-grey shadow-md p-8 rounded-lg">
                        <ul className='cm-panel category-list text-left'>
                            <li className='rounded'>
                                <button className='text-md py-2 pr-[7.2rem] text-white poppins px-4 transition text-left mb-2 hover:bg-black rounded' onClick={toHome}>Home</button>
                            </li>
                            <li className='rounded'>
                                <button className='text-md py-2 pr-[2.5rem] px-4 text-white poppins transition text-left mb-2 hover:bg-black rounded' onClick={toLensHub}>Lens Hub</button>
                            </li>
                            <li className='rounded'>
                                <button className='text-md py-2 text-white poppins px-4 transition text-left mb-2 hover:bg-black rounded'>Chats</button>
                            </li>
                            <li className='rounded'>
                                <button className='text-md py-2 text-white poppins px-4 transition text-left hover:bg-black rounded' onClick={toSettings}>Account Settings</button>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className='chatlist-main-box mt-10 border border-gray-300 shadow-sm lg:w-[25vw] lg:h-[78vh] rounded-lg p-2'>
                    <h1 className='p-4 font-semibold poppins text-2xl'>Chats</h1>
                    <div className="flex mb-2" role="group">
                        <button
                            type="button"
                            className={`border-b w-1/2 px-4 py-2 text-sm font-medium ${activeChatType === 'personal' ? 'text-blue-800 border-b-blue-800' : 'text-gray-900'} bg-white hover:bg-gray-100 hover:text-blue-800 focus:z-10 focus:border-b-blue-800 focus:text-blue-800 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white`}
                            onClick={() => setActiveChatType('personal')}
                        >
                            Personal
                        </button>
                        <button
                            type="button"
                            className={`border-b w-1/2 px-4 py-2 text-sm font-medium ${activeChatType === 'groups' ? 'text-blue-800 border-b-blue-800' : 'text-gray-900'} bg-white hover:bg-gray-100 hover:text-blue-800 focus:z-10 focus:border-b-blue-800 focus:text-blue-800 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white`}
                            onClick={() => setActiveChatType('groups')}
                        >
                            Groups
                        </button>
                    </div>
                    <div className='user-chat-list w-full h-[63vh] overflow-scroll'>
                        {activeChatType === 'personal' && allUsers.map(user => (
                            <div key={user._id} className='flex items-center p-2 hover:bg-gray-100 rounded-lg transition hover:cursor-pointer' onClick={() => handleChatClick(user)}>
                                <img
                                    className="w-16 h-16 border rounded-full mr-2"
                                    src={profilePic}
                                    alt="Profile"
                                />
                                <h1 className='p-4 poppins text-md'>{user.name}</h1>
                            </div>
                        ))}
                        {activeChatType === 'groups' && communities.map(community => (
                            <div key={community._id} className='flex items-center p-2 hover:bg-gray-100 rounded-lg transition hover:cursor-pointer' onClick={() => handleChatClick(community)}>
                                <img
                                    className="w-16 h-16 border rounded-full mr-2"
                                    src={community.profileImg}
                                    alt="Profile"
                                />
                                <h1 className='p-4 poppins text-md'>{community.name}</h1>
                            </div>
                        ))}
                    </div>
                </div>

                <div className='relative chat-main-box mt-10 border border-gray-300 shadow-sm lg:w-[45vw] h-[78vh] rounded-lg p-2'>
                    {activeChat ? (
                        <ActiveChat id={activeChat._id} chatType={activeChatType} setActiveChat={setActiveChat} />
                        ) : (
                        <div className='flex justify-center items-center h-full'>
                            <h1 className='poppins text-xl text-gray-600'>Select a chat to start messaging</h1>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatApp;