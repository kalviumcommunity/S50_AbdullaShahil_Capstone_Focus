import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'tailwindcss/tailwind.css';
import Cookies from 'js-cookie';
import sendButton from "../assets/sendbutton.png";
import Header from './Home Components/Header';
import axios from 'axios';
import io from 'socket.io-client';


const ChatApp = () => {
    const navigate = useNavigate();
    const [allUsers, setAllUsers] = useState([]);
    const [communities, setCommunities] = useState([]);
    const [activeChatType, setActiveChatType] = useState('personal');
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [viewInfo, setViewInfo] = useState(false);
    const [deletePopupOpen, setDeletePopupOpen] = useState(false);
    const [addMemberPopupOpen, setAddMemberPopupOpen] = useState(false);
    const socket = io('http://localhost:4000');

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
        console.log(activeChat)
        socket.on('connect', () => {
            console.log("server cnctd")
            socket.emit("joinCommunity", activeChat._id)
        });
        socket.on('disconnect', () => {
            console.log("server discnctd")
        });

        socket.on('message', (message) => {
            setMessages(prevMessages => [...prevMessages, message.message]);
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('message');
        };
    }, [activeChat?._id]);

    const handleSendMessage = () => {
        if (messageInput.trim() !== '') {
            const newMessage = messageInput;
            setMessages([...messages, newMessage]);
            setMessageInput('');

            const newMessageData = {
                name: username,
                message: newMessage,
                communityId: activeChat?._id,
            };

            console.log(newMessageData);
            socket.emit("message", newMessageData);
        }
    };


    useEffect(() => {
        axios.get(`http://localhost:4000/users`)
            .then(response => {
                setAllUsers(response.data);
                console.log(response.data);
            })
            .catch(error => {
                console.log("error: ", error);
            });

        axios.get(`http://localhost:4000/communities`)
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

    const toggleViewInfo = () => {
        setViewInfo(!viewInfo);
    };

    const closeChat = () => {
        setActiveChat(null);
        setViewInfo(false);
    };

    const handleDeleteCommunity = () => {
        if (activeChat) {
            axios.delete(`http://localhost:4000/communities/${activeChat._id}`)
                .then(response => {
                    setCommunities(communities.filter(community => community._id !== activeChat._id));
                    setActiveChat(null);
                    setDeletePopupOpen(false);
                })
                .catch(error => {
                    console.log("Error deleting community: ", error);
                });
        }
    };

    const handleNoClick = () => {
        setDeletePopupOpen(false);
    };

    const openAddMemberPopup = () => {
        setAddMemberPopupOpen(true);
    };

    const handleAddMember = (userId) => {
        if (activeChat) {
            axios.patch(`http://localhost:4000/communities/addMember/${activeChat._id}`, { userId })
                .then(response => {
                    setActiveChat({ ...activeChat, members: response.data.members });
                    setAddMemberPopupOpen(false);
                })
                .catch(error => {
                    console.log("Error adding member: ", error);
                });
        }
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
                                    src={community.profileImg || profilePic}
                                    alt="Community"
                                />
                                <h1 className='p-4 poppins text-md'>{community.name}</h1>
                            </div>
                        ))}
                    </div>
                </div>

                {deletePopupOpen && (
                    <div>
                        <div className="overlay"></div>
                        <div className="border logout-popup p-5 rounded flex flex-col justify-around text-center">
                            <h2>Are you sure you want to delete?</h2>
                            <div className='flex justify-around'>
                                <button onClick={handleDeleteCommunity} className='py-3 px-5 rounded bg-red-600 text-white font-bold hover:bg-red-400'>Yes</button>
                                <button onClick={handleNoClick} className='py-3 px-5 border rounded text-black font-bold hover:bg-gray-50'>No</button>
                            </div>
                        </div>
                    </div>
                )}
                {addMemberPopupOpen && (
                    <div>
                        <div className="overlay"></div>
                        <div className="border h-[60vh] logout-popup p-5 rounded-lg flex flex-col justify-around text-center">
                            <h2 className='text-lg'>Add new members</h2>
                            <div className='border border-gray-300 rounded-lg overflow-scroll'>
                                <ul className='user-list'>
                                    {allUsers.filter(user =>
                                        activeChat &&
                                        activeChat.admin &&
                                        user.name !== activeChat.admin.name &&
                                        !activeChat.members.some(member => member.name === user.name)
                                    ).map(user => (
                                        <li key={user._id} className='p-2'>
                                            <button onClick={() => handleAddMember(user._id)} className='p-2 w-full flex items-center justify-left bg-gray-50 poppins text-gray-700 rounded hover:bg-gray-200 transition'>
                                                <img
                                                    className="w-16 h-16 border rounded-full mr-2"
                                                    src={profilePic}
                                                    alt="Profile"
                                                />
                                                <h1 className='p-4 poppins text-lg'>{user.name}</h1>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <button onClick={() => setAddMemberPopupOpen(false)} className='gradient2 mt-4 py-2 px-4 border rounded text-white font-bold hover:opacity-90'>Cancel</button>
                        </div>
                    </div>
                )}


                <div className='chat-box mt-10 border border-gray-300 shadow-sm lg:w-[50vw] lg:h-[78vh] rounded-lg p-2'>
                    {activeChat ? (
                        <>
                            <div className='border-b flex items-center justify-between'>
                                <div className='flex items-center p-2 rounded-lg mb-2 cursor-pointer' onClick={toggleViewInfo}>
                                    <img
                                        className="w-16 h-16 border rounded-full mr-2"
                                        src={activeChat.profileImg || profilePic}
                                        alt="Profile"
                                    />
                                    <h1 className='p-4 poppins text-lg'>{activeChat.name}</h1>
                                </div>

                                <button
                                    className="text-gray-800 hover:text-red-600 flex justify-center items-center text-4xl mr-2 mb-1 h-12 w-12 hover:bg-gray-100 rounded-full transition" onClick={closeChat}>
                                    <span className='mb-1 close-button'>&times;</span>
                                </button>
                            </div>

                            {viewInfo ? (
                                <div className='chat-info p-4 rounded-lg h-[65vh]  overflow-scroll'>
                                    <img
                                        className="w-32 h-32 border rounded-full mx-auto my-4"
                                        src={activeChat.profileImg || profilePic}
                                        alt="Profile"
                                    />
                                    <center className='poppins text-xl font-semibold'>{activeChat.name}</center>
                                    <p className='poppins text-center text-md mt-2'>{activeChat.description || "No description available."}</p>

                                    {activeChatType === 'groups' && (
                                        <div className="flex flex-col items-center additional-info mt-4">
                                            <div className='flex items-center justify-around w-[30vw]'>
                                                <div className='gradient1 p-2 rounded-lg flex items-center hover:opacity-90 hover:cursor-pointer' onClick={openAddMemberPopup}>
                                                    <button
                                                        className="plus pb-1 ml-3 text-white text-3xl cursor-pointer outline-none hover:rotate-90 duration-300"
                                                        title="Add New"
                                                    >+</button>
                                                    <h1 className='text-white poppins text-md ml-4 mr-2'>Add members</h1>
                                                </div>

                                                <button className='bg-red-600 p-4 text-white poppins rounded-lg text-md' onClick={() => setDeletePopupOpen(true)}>Delete Community</button>
                                            </div>

                                            <hr className='mt-5 mb-5 w-[40vw]' />
                                            <div className='flex flex-col items-left w-full pl-3 rounded '>
                                                <h1 className='poppins font-semibold text-lg text-left mb-2'>Admin</h1>

                                                <div className=' gradient2 p-3 w-full flex items-center justify-left rounded-lg bg-gray-50 poppins text-gray-700 hover:bg-gray-200 transition'>
                                                    <img
                                                        className="w-16 h-16 border rounded-full mr-2"
                                                        src={profilePic}
                                                        alt="Profile"
                                                    />
                                                    <h1 className='p-4 poppins text-lg text-white'>{activeChat.admin.name}</h1>
                                                </div>
                                            </div>

                                            <hr className='mt-5 mb-5 w-[40vw]' />
                                            <div className='w-full'>
                                                <h1 className='poppins text-lg font-semibold text-left mb-3'>Members</h1>
                                                <ul className='w-full'>
                                                    {activeChat.members && activeChat.members.length > 0 ? (
                                                        activeChat.members.map(member => (
                                                            <div key={member._id} className='mb-2 p-3 w-full flex items-center justify-left rounded-lg bg-gray-700 poppins text-gray-700 hover:bg-gray-600 transition'>
                                                                <img
                                                                    className="w-16 h-16 border rounded-full mr-2"
                                                                    src={profilePic}
                                                                    alt="Profile"
                                                                />
                                                                <h1 className='p-4 poppins text-lg text-white'>{member.name}</h1>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <center className='p-4 poppins text-lg text-gray-600'>No members available.</center>
                                                    )}
                                                </ul>
                                            </div>
                                            <hr className='mt-5 mb-3 w-[40vw]' />

                                            <h1 className='p-4 poppins text-lg text-gray-600'>#FocusCommunity</h1>


                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <div className="chat-messages lg:w-full lg:h-[57vh] overflow-scroll">
                                        {messages.map((message, index) => (
                                            <div key={index} className='flex justify-end my-2'>
                                                <div className='p-4 gradient1 rounded-full w-max-full text-right break-words'>
                                                    <p className='text-white poppins'>{message}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className='send-message lg:h-[7vh] mt-2 flex justify-between items-center'>
                                        <input
                                            type="text"
                                            className='border p-4 bg-blue-gray-50 lg:w-[45vw] lg:h-[6vh] rounded-full'
                                            placeholder='Type your message here'
                                            value={messageInput}
                                            onChange={(e) => setMessageInput(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                        />
                                        <button onClick={handleSendMessage}>
                                            <img src={sendButton} className='h-12 hover:opacity-80' alt="Send" />
                                        </button>
                                    </div>
                                </>
                            )}

                        </>
                    ) : (
                        <div className='flex items-center justify-center lg:h-[78vh]'>
                            <h1 className='text-gray-500 poppins text-lg'>Select a chat to start messaging</h1>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatApp;
