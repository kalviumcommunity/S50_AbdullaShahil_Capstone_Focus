import { useState, useEffect } from 'react';
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
    const [posts, setPosts] = useState([]);
    const [articles, setArticles] = useState([]);
    const [buttonText, setButtonText] = useState('Edit'); 
    const [likedPosts, setLikedPosts] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const username = Cookies.get("name") ? Cookies.get("name").replace(/\"/g, '') : '';
    const token = Cookies.get("token") ? Cookies.get("token") : localStorage.getItem('token');
    const profileID = Cookies.get("profileID");

    const handleClick = (button) => {
        setActiveButton(button);
    };

    useEffect(() => {
        axios.post(`http://localhost:4000/users/getUser`, { token }, { withCredentials: true })
            .then(response => {
                const userData = response.data.user;
                setUserData(userData);
                setName(userData.name);
                setEmail(userData.email);
                setId(userData._id);
            })
            .catch(err => {
                console.error(err);
            });
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
                const initialLikedPosts = {};

                fetchedPosts.forEach(post => {
                    const isLikedByUser = post.likes.includes(profileID);
                    initialLikedPosts[post._id] = isLikedByUser;
                });

                setPosts(fetchedPosts);
                setLikedPosts(initialLikedPosts);
                setIsLoading(false);

                const articlesWithRelativeTime = articlesResponse.data.map(article => ({
                    ...article,
                    relativeTime: formatDistanceToNow(parseISO(article.postedTime), { addSuffix: true })
                }));
                setArticles(articlesWithRelativeTime);
            } catch (err) {
                console.error("Error fetching posts and articles", err);
                setIsLoading(false);
            }
        };

        fetchPostsAndArticles();
    }, [profileID]);

    const toggleLike = async (postId) => {
        const isLiked = likedPosts[postId];
        try {
            const response = await axios.patch(`http://localhost:4000/posts/like/${postId}`, { action: !isLiked ? 'like' : 'unlike', profileID });
            console.log(response)
            setLikedPosts(prevLikedPosts => ({
                ...prevLikedPosts,
                [postId]: !isLiked
            }));

            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post._id === postId
                        ? { ...post, likes: response.data.likes }
                        : post
                )
            );
        } catch (err) {
            console.error("Error toggling like", err);
        }
    };

    const onSubmit = data => {
        axios.put(`http://localhost:4000/users/${id}`, data)
            .then(response => {
                setIsEditable(false);
                setButtonText('Edit');
                setIsSubmitted(true);
                Cookies.set("name", data.name);
                localStorage.setItem("token", response.data.token);
            })
            .catch(error => {
                console.error(error);
            });
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
                        <img className='h-[22vh] w-[22vh] rounded-full overflow-hidden' src={prof} alt="" />
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
                {activeButton === 'One' && <Posts posts={posts} likedPosts={likedPosts} toggleLike={toggleLike} isLoading={isLoading} />}
                {activeButton === 'Two' && <Articles articles={articles} />}
            </div>
        </div>
    );
}

export default UserProfile;
