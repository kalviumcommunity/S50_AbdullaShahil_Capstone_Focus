import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ShimmerButton,
  ShimmerText,
  ShimmerCircularImage,
  ShimmerThumbnail,
  ShimmerBadge,
} from "react-shimmer-effects";
import Cookies from 'js-cookie';

import ProfileIMG2 from '../../assets/review2.jpeg';
import Heart from '../../assets/heart.png';
import HeartActive from '../../assets/heartactive.png';
import Comment from '../../assets/comment.png';


function Posts() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState({});

  const profileID = Cookies.get("profileID");
  const initialLikedPosts = {}

  useEffect(() => {
    axios.get(`http://localhost:4000/posts`)
      .then(response => {
        const fetchedPosts = response.data;
        fetchedPosts.forEach(post => {
          const isLikedByUser = post.likes.includes(profileID);
          initialLikedPosts[post._id] = isLikedByUser;
        });

        setPosts(fetchedPosts);
        setLikedPosts(initialLikedPosts);
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  }, []);

  const handleLikeClick = async (postId) => {
    try {
      const response = await axios.patch(`http://localhost:4000/posts/like/${postId}`, { action: !likedPosts[postId] ? 'like' : 'unlike', profileID });
      const updatedPost = response.data;
      setPosts(posts.map(post => post._id === updatedPost._id ? updatedPost : post));
      setLikedPosts({ ...likedPosts, [postId]: !likedPosts[postId] });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <center className="h-[85vh]  pl-5 pr-5 pt-10 overflow-hidden ">
      <input className='w-[30vw] search border border-gray-400 rounded-full px-8 py-4 mb-4' id="genreSelect" placeholder='Search...' />
      <div className="pt-12 px-5  overflow-x-hidden overflow-y-scroll h-[75vh]">

        {isLoading ? (
          Array.from({ length: 10 }).map((_, index) => (
            <div className='posts border border-gray-300 rounded-md flex flex-col mb-10 p-5 lg:w-[35vw] shadow-[0px_0px_8px_rgba(0,0,0,0.08)]' key={index}>
              <div className='top-opt flex justify-between items-center mb-5'>
                <div className='flex items-center w-[15vw]'>
                  <ShimmerCircularImage size={50} />
                  <div style={{ width: '10px' }}></div>
                  <ShimmerBadge width={130} />
                </div>
                <ShimmerBadge width={70} />
              </div>
              <ShimmerThumbnail height={550} rounded />
              <div className="post-options  rounded  p-3 flex items-center  justify-between  mt-1">
                <ShimmerBadge width={200} />
                <ShimmerButton size="md" />
              </div>
              <ShimmerText />
            </div>
          ))
        ) : (
          posts.map((post, index) => {
            return (
              <div className="posts border border-gray-400 rounded-md flex flex-col mb-10 p-5 lg:w-[35vw] shadow-[0px_0px_8px_rgba(0,0,0,0.08)]" key={index} >
                <div className='top-opt flex justify-between items-center mb-5'>
                  <div className='flex items-center w-[15vw]'>
                    <img className='h-12 w-12 rounded-full overflow-hidden' src={ProfileIMG2} alt="" />
                    <h3 className='post-username pl-4 font-light poppins'>{post.name}</h3>
                  </div>
                  <h1 className='font-light'>{post.category}</h1>
                </div>
                <div className="image-wrapper image-wrapper-4x3 rounded-md">
                  <img src={post.image} alt="Image 4x3" className='rounded-md' />
                </div>
                <div className="post-options  rounded  p-3 flex items-center  justify-between  mt-1">
                  <h1 className='font-semibold text-xl textgray poppins'>{post.title}</h1>
                  <div className='flex justify-between items-center'>
                    <h2 className='mr-2 text-lg'>{post.likes.length}</h2>
                    <img
                      className='h-10 w-10 mr-1 rounded-full overflow-hidden cursor-pointer'
                      src={likedPosts[post._id] ? HeartActive : Heart}
                      alt=""
                      onClick={() => handleLikeClick(post._id)}
                    />
                    <img className='h-[2.1rem] w-[2.1rem] mb-[3px] overflow-hidden' src={Comment} alt="" />
                  </div>
                </div>
                <div className='pl-3'>
                  <p className='text-left font-light text-gray-700 poppins text-sm'>{post.description}</p>
                </div>
              </div>
            )
          })
        )}

      </div>
    </center>
  )
}

export default Posts;
