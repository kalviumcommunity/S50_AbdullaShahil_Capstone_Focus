import { useState, useEffect, useCallback } from 'react';
import { useForm } from "react-hook-form";
import Cookies from 'js-cookie';
import axios from 'axios';
import { formatDistanceToNow, parseISO } from 'date-fns';
import Header from "./Home Components/Header";
import Posts from "./UserProfile Components/Posts";
import Articles from "./UserProfile Components/Articles";
import prof from '../assets/reviewProfile.jpeg';

function UserProfile() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [activeButton, setActiveButton] = useState('One');
    const [userData, setUserData] = useState({});
    const [isEditable, setIsEditable] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [id, setId] = useState('');
    const [buttonText, setButtonText] = useState('Edit'); 
    const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const [likedPosts, setLikedPosts] = useState({});
    const [articles, setArticles] = useState([]);
    const [likedArticles, setLikedArticles] = useState({});

    const username = Cookies.get("name")?.replace(/\"/g, '') || '';
    const token = Cookies.get("token") || localStorage.getItem('token');
    const profileID = Cookies.get("profileID");

    const handleClick = (button) => setActiveButton(button);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.post(`http://localhost:4000/users/getUser`, { token }, { withCredentials: true });
                const userData = response.data.user;
                setUserData(userData);
                setName(userData.name);
                setEmail(userData.email);
                setId(userData._id);
            } catch (err) {
                console.error(err);
            }
        };
        fetchUserData();
    }, [token]);

    useEffect(() => {
        if (!profileID) return;

        const fetchPostsAndArticles = async () => {
            try {
                const [postsResponse, articlesResponse] = await Promise.all([
                    axios.get(`http://localhost:4000/posts/userPosts/${profileID}`),
                    axios.get(`http://localhost:4000/articles/userArticles/${profileID}`)
                ]);

                const fetchedPosts = postsResponse.data;
                const initialLikedPosts = fetchedPosts.reduce((acc, post) => {
                    acc[post._id] = post.likes.includes(profileID);
                    return acc;
                }, {});
                
                setPosts(fetchedPosts);
                setLikedPosts(initialLikedPosts);
                setIsLoading(false);

                const articlesWithRelativeTime = articlesResponse.data.map(article => ({
                    ...article,
                    relativeTime: formatDistanceToNow(parseISO(article.postedTime), { addSuffix: true })
                }));
                const initialLikedArticles = articlesWithRelativeTime.reduce((acc, article) => {
                    acc[article._id] = article.likes.includes(profileID);
                    return acc;
                }, {});
                
                setArticles(articlesWithRelativeTime);
                setLikedArticles(initialLikedArticles);
            } catch (err) {
                console.error("Error fetching posts and articles", err);
                setIsLoading(false);
            }
        };

        fetchPostsAndArticles();
    }, [profileID]);

    const toggleLike = useCallback(async (id, type) => {
        const isLiked = type === 'post' ? likedPosts[id] : likedArticles[id];
        try {
            const endpoint = type === 'post' ? `posts/like/${id}` : `articles/like/${id}`;
            const response = await axios.patch(`http://localhost:4000/${endpoint}`, { action: isLiked ? 'unlike' : 'like', profileID });

            if (type === 'post') {
                setLikedPosts(prev => ({ ...prev, [id]: !isLiked }));
                setPosts(prev => prev.map(item => item._id === id ? { ...item, likes: response.data.likes } : item));
            } else {
                setLikedArticles(prev => ({ ...prev, [id]: !isLiked }));
                setArticles(prev => prev.map(item => item._id === id ? { ...item, likes: response.data.likes } : item));
            }
        } catch (err) {
            console.error(`Error toggling ${type} like`, err);
        }
    }, [likedPosts, likedArticles, profileID]);

    const onSubmit = async (data) => {
        try {
            const response = await axios.put(`http://localhost:4000/users/${id}`, data);
            setIsEditable(false);
            setButtonText('Edit');
            setIsSubmitted(true);
            Cookies.set("name", data.name);
            localStorage.setItem("token", response.data.token);
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = (e) => {
        e.preventDefault();
        if (isEditable) {
            handleSubmit(onSubmit)();
        } else {
            setIsEditable(true);
            setButtonText('Save');
        }
    };

    return (
        <div>
            <Header />
            <div className='flex items-center justify-center mt-10'>
                <center className="flex items-center">
                    <div className="mr-[6rem]">
                        <img className='h-[22vh] w-[22vh] rounded-full overflow-hidden' src={prof} alt="Profile" />
                        <h1 className="pt-7 text-gray-800 text-2xl poppins">{username}</h1>
                    </div>

                    <form className="posts border-gray-300 rounded-md flex flex-col justify-between p-5 lg:w-[45vw]">
                        <label className='text-left text-gray-800 mb-1' htmlFor="name">Name</label>
                        <input
                            className="form-input bg-gray-100 p-3 rounded border"
                            {...register('name', {
                                required: 'This Field is required',
                                minLength: { value: 5, message: 'Minimum 5 characters are required' },
                                maxLength: { value: 20, message: 'Maximum length is 20 characters' }
                            })}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Name"
                            id="name"
                            disabled={!isEditable}
                        />
                        {errors.name && <span className="text-left text-red-500">{errors.name.message}</span>}

                        <label className='text-left text-gray-800 mb-1' htmlFor="email">Email</label>
                        <input
                            className="form-input bg-gray-100 p-3 rounded border"
                            {...register('email', {
                                required: 'This Field is required',
                                minLength: { value: 3, message: 'Minimum 3 characters are required' }
                            })}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            id="email"
                            disabled={!isEditable}
                        />
                        {errors.email && <span className="text-left text-red-500">{errors.email.message}</span>}

                        <div className='w-full flex justify-between'>
                            <button onClick={handleEdit} className="submit-btn rounded text-white gradient2 font-bold p-2 h-[7vh] w-[13.5vw]">
                                {buttonText}
                            </button>
                            <button className="submit-btn rounded text-white font-bold p-2 gradient1 h-[7vh] w-[13.5vw]">Change password</button>
                            <button className="submit-btn rounded text-white bg-red-600 font-bold p-2 h-[7vh] w-[13.5vw]">Delete Account</button>
                        </div>
                    </form>
                </center>
            </div>

            <hr className="mt-10 bg-black" />

            <div className="bg-gray-100 pt-6">
                <div className="flex justify-center mt-9">
                    <button
                        className={`bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-l ${activeButton === 'One' ? 'gradient2' : ''}`}
                        onClick={() => handleClick('One')}
                    >
                        Posts
                    </button>
                    <button
                        className={`bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-r ${activeButton === 'Two' ? 'gradient2' : ''}`}
                        onClick={() => handleClick('Two')}
                    >
                        Articles
                    </button>
                </div>
                {activeButton === 'One' && <Posts posts={posts} likedPosts={likedPosts} toggleLike={(id) => toggleLike(id, 'post')} />}
                {activeButton === 'Two' && <Articles articles={articles} likedArticles={likedArticles} toggleLike={(id) => toggleLike(id, 'article')} />}
            </div>
        </div>
    );
}

export default UserProfile;
