import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import sendButton from "../../assets/sendbutton.png";
import io from 'socket.io-client';
import { getId } from '../Utils/ApiUtils';
import { DeletePopup } from '../Utils/Popups';
import { AddMemberPopup } from '../Utils/Popups';
import NoProfile from "../../assets/noprofile.png";

const socket = io('https://s50-abdullashahil-capstone-focus.onrender.com');

const ActiveChat = ({ id, chatType, setActiveChat, onCommunityJoin, isJoined, setIsJoined }) => {
    const chatId = id;
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
    const [profileID, setProfileID] = useState(null);

    useEffect(() => {
        const fetchProfileID = async () => {
            const id = await getId('profileID');
            setProfileID(id);
        };

        fetchProfileID();
    }, []);


    useEffect(() => {
        setMessages([])
        setViewInfo(false)
        console.log("type->", chatId, chatType)
        if (chatType === 'community') {
            axios.get(`https://s50-abdullashahil-capstone-focus.onrender.com/communities/${chatId}`)
                .then(response => {
                    setCommunity(response.data);
                    console.log("first", response.data)
                })
                .catch(error => {
                    console.log("error: ", error);
                });

            axios.get(`https://s50-abdullashahil-capstone-focus.onrender.com/communities/otherusers/${chatId}`)
                .then(response => {
                    setUserData(response.data);
                })
                .catch(error => {
                    console.log("error: ", error);
                });

            axios.get(`https://s50-abdullashahil-capstone-focus.onrender.com/messages/community/${chatId}`)
                .then(response => {
                    setMessages(response.data.messages);
                    console.log(response.data.messages)
                })
                .catch(error => {
                    console.log("error: ", error);
                });

            socket.emit('joinCommunity', chatId);

        } else {
            setCommunity("")
            const userId = Cookies.get('profileID');
            axios.get(`https://s50-abdullashahil-capstone-focus.onrender.com/communities/messages/personalMessages/${chatId}`, {
                params: {
                    userId: JSON.stringify({ _id: userId })
                }
            })
                .then(response => {
                    setMessages(response.data);

                })
                .catch(error => {
                    console.log("error: ", error);
                });

            axios.get(`https://s50-abdullashahil-capstone-focus.onrender.com/users/profile/${chatId}`)
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
            console.log(messages, message)

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
            if (chatType === 'community') {
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
            axios.patch(`https://s50-abdullashahil-capstone-focus.onrender.com/communities/addMember/${community._id}`, { userId })
                .then(response => {
                    setCommunity(prevCommunity => ({
                        ...prevCommunity,
                        members: [...prevCommunity.members, { _id: profileID }]
                    }));
                    setAddMemberPopupOpen(false);
                    onCommunityJoin(community);
                    setIsJoined(true)
                })
                .catch(error => {
                    console.log("Error adding member: ", error);
                });
        }
    };



    const handleDeleteCommunity = () => {
        if (community) {
            axios.delete(`https://s50-abdullashahil-capstone-focus.onrender.com/communities/${chatId}`)
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

    const isUserInCommunity = () => {
        const isMember = community?.members?.map(member => member._id).includes(profileID);
        const isAdmin = community?.admin._id === profileID;
        return isMember || isAdmin;
    };


    return (
        <div className="relative h-full">
            <div className="border-b flex items-center justify-between">
                <div className="flex items-center p-2 rounded-lg mb-2 cursor-pointer" onClick={toggleViewInfo}>
                    <img
                        className="w-16 h-16 border rounded-full mr-2"
                        src={community?.profileImg || NoProfile}
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

                    {community && (
                        <div className="flex flex-col items-center additional-info mt-4">
                            {community.admin._id == profileID &&
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
                            }

                            <hr className="mt-5 mb-5 w-[40vw]" />

                            <div className="flex flex-col items-left w-full pl-3 rounded">
                                <h1 className="poppins font-semibold text-lg text-left mb-2">Admin</h1>
                                <div className="gradient2 p-3 w-full flex items-center justify-left rounded-lg bg-gray-50 poppins text-gray-700 hover:bg-gray-200 transition">
                                    <img
                                        className="w-16 h-16 border rounded-full mr-2"
                                        src={community.admin.profile_img ? community.admin.profile_img : NoProfile}
                                        alt="Profile"
                                    />
                                    <h1 className="p-4 poppins text-lg text-white">{community.admin._id == profileID ? "You" : community.admin.name}</h1>
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
                                                    src={member.profile_img ? member.profile_img : NoProfile}
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
                        {messages.map((message, index) => {
                            // Check if the previous message was from the same sender
                            const showName = index === 0 || messages[index - 1].name !== message.name;

                            return (
                                <div key={index}>
                                    {chatType === 'community' && showName && message.name !== username && (
                                        <p className={`text-xs text-gray poppins mb-1 ${message.name === username ? 'text-right' : 'text-left'}`}>
                                            {message.name}
                                        </p>
                                    )}
                                    <div className={`my-1 ${message.name === username || message.senderId == profileID ? 'justify-end' : 'justify-start'} flex`}>
                                        <div className={`p-4 ${message.name === username || message.senderId == profileID ? 'gradient1 text-white' : 'gradient2 text-white'} rounded-full break-words`}>
                                            <p className="poppins">{message.message}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>




                    {(chatType === 'personal' || (chatType === 'community' && isJoined)) && (
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
                    )}
                    {(chatType === 'community' && !isJoined) && (
                        <div className="send-message lg:h-[6vh] mt-2 flex justify-center items-center">
                            <button
                                className='border rounded-lg gradient2 p-3 text-xl text-white poppins font-semibold w-full hover:opacity-90 transition'
                                onClick={() => handleAddMember(profileID)}
                            >
                                Join community
                            </button>
                        </div>
                    )}


                </>
            )}

            {deletePopupOpen && (
                <DeletePopup handleDelete={handleDeleteCommunity} handleNoClick={handleNoClick} />
            )}

            {addMemberPopupOpen && (
                <AddMemberPopup
                    userData={userData}
                    handleAddMember={handleAddMember}
                    setAddMemberPopupOpen={setAddMemberPopupOpen}
                />
            )}
        </div>
    );
};

export default ActiveChat;
