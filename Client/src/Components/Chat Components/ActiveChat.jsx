import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import sendButton from "../../assets/sendbutton.png";
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

const ActiveChat = ({ id, chatType, setActiveChat }) => {
    const chatId = id;
    const profilePic = 'https://www.famousbirthdays.com/headshots/russell-crowe-6.jpg';
    const username = Cookies.get("name") ? Cookies.get("name").replace(/\"/g, '') : '';
    const navigate = useNavigate();

    const [userData, setUserData] = useState([]);
    const [community, setCommunity] = useState(null);
    const messagesEndRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [viewInfo, setViewInfo] = useState(false);
    const [deletePopupOpen, setDeletePopupOpen] = useState(false);
    const [addMemberPopupOpen, setAddMemberPopupOpen] = useState(false);
    const profileID = Cookies.get("profileID")

    useEffect(() => {
        setViewInfo(false)
        console.log("hhhhhh",chatId,chatType)
        if (chatType === 'groups') {
            axios.get(`http://localhost:4000/communities/${chatId}`)
                .then(response => {
                    setCommunity(response.data);
                })
                .catch(error => {
                    console.log("error: ", error);
                });

            axios.get(`http://localhost:4000/users/list/displayData`)
                .then(response => {
                    setUserData(response.data);
                    console.log(response.data)
                })
                .catch(error => {
                    console.log("error: ", error);
                });

            axios.get(`http://localhost:4000/messages/community/${chatId}`)
                .then(response => {
                    setMessages(response.data.messages);
                })
                .catch(error => {
                    console.log("error: ", error);
                });

            socket.emit('joinCommunity', chatId); 

        } else {
            setCommunity("")
            const userId = Cookies.get('profileID'); 
            axios.get(`http://localhost:4000/communities/messages/personalMessages/${chatId}`, {
                params: {
                    userId: JSON.stringify({ _id: userId }) 
                }
            })
            .then(response => {
                setMessages(response.data);
                console.log("msggggg-----",response.data)

            })
            .catch(error => {
                console.log("error: ", error);
            });

            axios.get(`http://localhost:4000/users/profile/${chatId}`)
            .then(response => {
                console.log(response.data)
                setUserData(response.data);
            })
            .catch(error => {
                console.log("error: ", error);
            });
            const otherUserId = chatId;
            socket.emit('joinPersonalChat', { userId, otherUserId });
        }
    }, [chatId]);

    useEffect(() => {
        socket.on('message', (message) => {
            setMessages(prevMessages => [...prevMessages, message]);
        });

        socket.on('personalMessage', (message) => {
            setMessages(prevMessages => [...prevMessages, message]);
        });

        return () => {
            socket.off('message');
            socket.off('personalMessage');
        };
    }, []);

    const handleSendMessage = () => {
        if (messageInput.trim() !== '') {
            if (chatType === 'groups') {
                const newMessage = {
                    name: username,
                    message: messageInput,
                    communityId: chatId,
                };

                socket.emit("message", newMessage);
            } else if (chatType === 'personal') {
                const newMessage = {
                    senderId: Cookies.get('profileID'),
                    receiverId: chatId,
                    message: messageInput,
                };

                socket.emit("personalMessage", newMessage);
            }
            setMessageInput('');
        }
    };

    const toggleViewInfo = () => {
        setViewInfo(!viewInfo);
    };

    const closeChat = () => {
        setActiveChat(null);
    };

    const handleAddMember = (userId) => {
        if (community) {
            axios.patch(`http://localhost:4000/communities/addMember/${community._id}`, { userId })
                .then(response => {
                    setCommunity({ ...community, members: response.data.members });
                    setAddMemberPopupOpen(false);
                })
                .catch(error => {
                    console.log("Error adding member: ", error);
                });
        }
    };

    const handleDeleteCommunity = () => {
        if (community) {
            axios.delete(`http://localhost:4000/communities/${chatId}`)
                .then(response => {
                    setDeletePopupOpen(false);
                    window.location.reload();
                })
                .catch(error => {
                    console.log("Error deleting community: ", error);
                });
        }
    };

    const handleNoClick = () => {
        setDeletePopupOpen(false);
    };

    const handleInputChange = (e) => {
        setMessageInput(e.target.value);
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };


    return (
        <div className="relative h-full">
            <div className="border-b flex items-center justify-between">
                <div className="flex items-center p-2 rounded-lg mb-2 cursor-pointer" onClick={toggleViewInfo}>
                    <img
                        className="w-16 h-16 border rounded-full mr-2"
                        src={community?.profileImg || profilePic}
                        alt="Profile"
                    />
                    <h1 className="p-4 poppins text-lg">{community?.name || userData.name}</h1>
                </div>

                <button
                    className="text-gray-800 hover:text-red-600 flex justify-center items-center text-4xl mr-2 mb-1 h-12 w-12 hover:bg-gray-100 rounded-full transition"
                    onClick={closeChat}
                >
                    <span className="mb-1 close-button">&times;</span>
                </button>
            </div>

            {viewInfo ? (
                <div className="chat-info p-4 rounded-lg h-[65vh] overflow-scroll">
                    <img
                        className="w-32 h-32 border rounded-full mx-auto my-4"
                        src={community?.profileImg || profilePic}
                        alt="Profile"
                    />
                    <center className="poppins text-xl font-semibold">{community?.name || userData.name}</center>
                    <p className="poppins text-center text-md mt-2">{community?.description || "No description available."}</p>

                    { community && (
                        <div className="flex flex-col items-center additional-info mt-4">
                            <div className="flex items-center justify-around w-[30vw]">
                                <div
                                    className="gradient1 p-2 rounded-lg flex items-center hover:opacity-90 hover:cursor-pointer"
                                    onClick={() => setAddMemberPopupOpen(true)}
                                >
                                    <button
                                        className="plus pb-1 ml-3 text-white text-3xl cursor-pointer outline-none hover:rotate-90 duration-300"
                                        title="Add New"
                                    >
                                        +
                                    </button>
                                    <h1 className="text-white poppins text-md ml-4 mr-2 ">Add members</h1>
                                </div>

                                <button className="bg-red-600 p-4 text-white poppins rounded-lg text-md" onClick={() => setDeletePopupOpen(true)}>
                                    Delete Community
                                </button>
                            </div>

                            <hr className="mt-5 mb-5 w-[40vw]" />

                            <div className="flex flex-col items-left w-full pl-3 rounded">
                                <h1 className="poppins font-semibold text-lg text-left mb-2">Admin</h1>
                                <div className="gradient2 p-3 w-full flex items-center justify-left rounded-lg bg-gray-50 poppins text-gray-700 hover:bg-gray-200 transition">
                                    <img
                                        className="w-16 h-16 border rounded-full mr-2"
                                        src={profilePic}
                                        alt="Profile"
                                    />
                                    <h1 className="p-4 poppins text-lg text-white">{community.admin.name}</h1>
                                </div>
                            </div>

                            <hr className="mt-5 mb-5 w-[40vw]" />

                            <div className="w-full">
                                <h1 className="poppins text-lg font-semibold text-left mb-3">Members</h1>
                                <ul className="w-full">
                                    {community.members && community.members.length > 0 ? (
                                        community.members.map((member) => (
                                            <div
                                                key={member._id}
                                                className="mb-2 p-3 w-full flex items-center justify-left rounded-lg bg-gray-700 poppins text-gray-700 hover:bg-gray-600 transition"
                                            >
                                                <img
                                                    className="w-16 h-16 border rounded-full mr-2"
                                                    src={profilePic}
                                                    alt="Profile"
                                                />
                                                <h1 className="p-4 poppins text-lg text-white">{member.name}</h1>
                                            </div>
                                        ))
                                    ) : (
                                        <center className="p-4 poppins text-lg text-gray-600">No members available.</center>
                                    )}
                                </ul>
                            </div>

                            <hr className="mt-5 mb-3 w-[40vw]" />
                            <h1 className="p-4 poppins text-lg text-gray-600">#FocusCommunity</h1>
                        </div>
                    )}
                </div>
            ) : (
                <>
                    <div className="messages-section mt-2 h-[57vh] overflow-scroll">
                        {messages.map((message, index) => (
                            <div key={index} className={`flex ${message.name === username || message.senderId == profileID ? 'justify-end' : 'justify-start'} my-2`}>
                                <div className={`p-4 ${message.name === username || message.senderId == profileID ? 'gradient1 text-white' : 'gradient2 text-white'} rounded-full w-max-full text-right break-words`}>
                                    <p className="poppins">{message.message}</p>
                                </div>
                            </div>
                        ))}

                        <div ref={messagesEndRef} />
                    </div>

                    <div className="send-message lg:h-[7vh] mt-2 flex justify-between items-center">
                        <input
                            type="text"
                            className="border p-4 bg-blue-gray-50 lg:w-[40vw] lg:h-[6vh] rounded-full"
                            placeholder="Type your message here"
                            value={messageInput}
                            onChange={handleInputChange}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <button onClick={handleSendMessage}>
                            <img src={sendButton} className="h-12 hover:opacity-80" alt="Send" />
                        </button>
                    </div>
                </>
            )}

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
                    <div className="overlay bg-blue-black bg-opacity-60"></div>
                    <div className="border h-[60vh] logout-popup p-5 rounded-lg flex flex-col justify-around text-center">
                        <h2 className='text-lg poppins mb-5'>Add new members</h2>
                        <div className='border border-gray-300 rounded-lg overflow-scroll'>
                            <ul className='user-list'>
                                {userData.map(user => (
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
        </div>
    );
};

export default ActiveChat;
