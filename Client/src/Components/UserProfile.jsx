import { useState, useEffect, useCallback } from 'react';
import { useForm } from "react-hook-form";
import Cookies from 'js-cookie';
import axios from 'axios';
import { formatDistanceToNow, parseISO } from 'date-fns';
import Header from "./Home Components/Header";
import Posts from "./UserProfile Components/Posts";
import Articles from "./UserProfile Components/Articles";
import { getId } from './Utils/ApiUtils';

function UserProfile() {
    const [activeButton, setActiveButton] = useState('One');
    const [loading, setIsLoading] = useState(true);
    const [profileData, setProfileData] = useState({});
    const [posts, setPosts] = useState([]);
    const [likedPosts, setLikedPosts] = useState({});
    const [articles, setArticles] = useState([]);
    const [likedArticles, setLikedArticles] = useState({});
    const [profileID, setProfileID] = useState(null);

    useEffect(() => {
        const fetchProfileID = async () => {
            const id = await getId('profileID');
            setProfileID(id);
        };

        fetchProfileID();
    }, []);


    const handleClick = (button) => setActiveButton(button);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/users/profile/get/${profileID}`);
                setProfileData({
                    name: response.data.name,
                    about: response.data.about,
                    interests: response.data.interests,
                    profile_img: response.data.profile_img,

                });
            } catch (err) {
                console.error(err);
            }
        };
        fetchUserData();
    }, [profileID]);

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
console.log(fetchedPosts)
                setPosts(fetchedPosts);
                setLikedPosts(initialLikedPosts);

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
                setIsLoading(false);
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

    return (
        <div>
            <Header />
            <section className="flex items-center justify-around p-8 h-min">
                <div className="user-info flex items-center p-12 w-[65vw] h-[35vh] gradient2 rounded-[45px] transition">
                    <img className='h-[20vh] w-[20vh] rounded-full overflow-hidden border-4 border-white shadow-lg' src={profileData.profile_img
} alt="Profile" />
                    <div className='ml-8 flex flex-col items-left justify-start'>
                        <h1 className="text-white font-semibold text-3xl poppins">{profileData.name}</h1>
                        <div className='flex items-center mt-3'>
                            {profileData.interests && profileData.interests.map((interest, index) => (
                                <div key={index} className="text-white p-2 text-md px-8 mr-1 rounded-full hover:scale-[100.5%] bg-gray-800">
                                    {interest}
                                </div>
                            ))}
                        </div>
                        <div className='mt-3 w-[40vw]'>
                            <p className='text-left font-light text-white poppins text-md'>{profileData.about}</p>
                        </div>
                    </div>
                </div>
                <div className='statistics gradient1 p-10 w-[28vw] h-[35vh] flex flex-col items-center rounded-[45px]'>
                    <h1 className='poppins text-white text-2xl font-medium'>Insights</h1>
                    <hr className='text-white w-[20vw] mt-5 opacity-30'/>
                    <div className="flex items-center justify-between w-[13vw] h-max mt-3">
                        <div className="flex flex-col items-center justify-between">
                            <h1 className='text-[4.5rem] font-semibold poppins text-white'>{posts.length}</h1>
                            <h1 className="poppins text-white text-xl">posts</h1>
                        </div>
                        <div className="flex flex-col items-center justify-between">
                            <h1 className='text-[4.5rem] font-semibold poppins text-white'>{articles.length}</h1>
                            <h1 className="poppins text-white text-xl">articles</h1>
                        </div>
                    </div>
                </div>
            </section>
            <hr className="mt-10 bg-black" />
            <div className="bg-gray-50 pt-6">
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
