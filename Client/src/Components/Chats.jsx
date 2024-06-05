import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import 'tailwindcss/tailwind.css';
import sendButton from "../assets/sendbutton.png";
import Header from './Home Components/Header';

const ChatApp = () => {
    const navigate = useNavigate();

    const toHome = () => {
        navigate("/home");
    };

    const toSettings = () => {
        navigate("/settings");
    };

    const toLensHub = () => {
        navigate("/lenshub");
    };

    const chats = Array.from({ length: 7 }, (_, i) => ({
        id: i,
        name: 'Jack Rossu',
        profilePic: 'https://www.famousbirthdays.com/headshots/russell-crowe-6.jpg',
    }));

    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');

    const handleSendMessage = () => {
        if (messageInput.trim() !== '') {
            setMessages([...messages, messageInput]);
            setMessageInput('');
        }
    };

    return (
        <div>
            <Header />
            <div className="flex justify-around">
                <div>
                    <div className='gradient1 mt-10 p-3 rounded-lg flex items-center'>
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

                <div className='chatlist mt-10 border border-gray-300 shadow-sm lg:w-[25vw] lg:h-[78vh] rounded-lg p-2'>
                    <h1 className='p-4 font-semibold poppins text-2xl'>Chats</h1>
                    <div className="flex mb-2" role="group">
                        <button type="button" className="border-b w-1/2 px-4 py-2 text-sm font-medium text-gray-900 bg-white hover:bg-gray-100 hover:text-blue-800 focus:z-10 focus:border-b-blue-800 focus:text-blue-800 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white">
                            Personal
                        </button>
                        <button type="button" className="border-b w-1/2 px-4 py-2 text-sm font-medium text-gray-900 bg-white border-gray-200 hover:bg-gray-100 hover:text-blue-800 focus:z-10 focus:border-b-blue-800 focus:text-blue-800 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white">
                            Groups
                        </button>
                    </div>
                    <div className='w-full h-[63vh] overflow-scroll'>
                        {chats.map(chat => (
                            <div key={chat.id} className='flex items-center p-2 hover:bg-gray-100 rounded-lg transition hover:cursor-pointer'>
                                <img
                                    className="w-16 h-16 rounded-full mr-2"
                                    src={chat.profilePic}
                                    alt="Profile"
                                />
                                <h1 className='p-4 poppins text-md'>{chat.name}</h1>
                            </div>
                        ))}
                    </div>
                </div>

                <div className='chat-box mt-10 border border-gray-300 shadow-sm lg:w-[50vw] lg:h-[78vh] rounded-lg p-2'>
                    <div className='border-b'>
                        <div className='flex items-center p-2 rounded-lg mb-2'>
                            <img
                                className="w-16 h-16 rounded-full mr-2"
                                src="https://www.famousbirthdays.com/headshots/russell-crowe-6.jpg"
                                alt="Profile"
                            />
                            <h1 className='p-4 poppins text-lg'>Jacky Russells</h1>
                        </div>
                    </div>
                    <div className="chat-messages lg:w-full lg:h-[57vh] overflow-scroll">
                        {messages.map((message, index) => (
                            <div key={index} className='flex justify-end my-2'>
                                <div className='p-4 gradient1 rounded-full text-right break-words'>
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
                </div>
            </div>
        </div>
    );
};

export default ChatApp;
