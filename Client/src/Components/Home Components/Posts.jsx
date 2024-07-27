import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import CommentBox from '../CommentBox';
import NoProfile from "../../assets/noprofile.png";

import { PostShimmer } from '../Utils/Shimmers';


import Heart from '../../assets/heart.png';
import HeartActive from '../../assets/heartactive.png';
import Comment from '../../assets/comment.png';

function Posts({ postCategory }) {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState({});
  const [activeCommentPost, setActiveCommentPost] = useState(null);  
  
  const initialLikedPosts = {};
  const profileID = Cookies.get("profileID");

  useEffect(() => {
    axios.get(`http://localhost:4000/posts`)
      .then(response => {
        const fetchedPosts = response.data;

        fetchedPosts.forEach(post => {
          const isLikedByUser = post.likes.includes(profileID);
          initialLikedPosts[post._id] = isLikedByUser;
        });
        console.log(response.data)
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

  const handleCommentClick = (post) => {
    setActiveCommentPost(post);
  };

  const handleCloseCommentBox = () => {
    setActiveCommentPost(null);
  };

  const filteredPosts = postCategory ? posts.filter(post => post.category === postCategory) : posts;

  return (
    <center className="h-[85vh] pt-5 pl-5 pr-5 overflow-hidden">
      <div className="p-5 px overflow-x-hidden overflow-y-scroll h-[90vh]">

        {isLoading ? (

          <PostShimmer scaleValue="0%" />

        ) : (
          filteredPosts.length > 0 ? (
            filteredPosts.map((post, index) => (
              <div className="posts border border-gray-400 rounded-md flex flex-col mb-10 p-5  lg:w-[35vw] shadow-[0px_0px_8px_rgba(0,0,0,0.08)]" key={index}>
                <div className='top-opt flex justify-between items-center mb-5'>
                  <div className='flex items-center w-[15vw]'>
                    <img className='h-12 w-12 rounded-full overflow-hidden' src={ post.profile_img ? (post.profile_img):(NoProfile) } alt="" />
                    <h3 className='post-username pl-4 font-light poppins'>{post.name}</h3>
                  </div>
                  <h1 className='font-light'>{post.category}</h1>
                </div>
                <div className="image-wrapper image-wrapper-4x3 rounded-md">
                  <img src={post.image} alt="Image 4x3" className='rounded-md' />
                </div>
                <div className="post-options rounded p-3 flex items-center justify-between mt-1">
                  <h1 className='font-semibold text-xl textgray poppins'>{post.title}</h1>
                  <div className='flex justify-between items-center'>
                    <h2 className='mr-2 text-lg'>{post.likes.length}</h2>
                    <img
                      className='h-10 w-10 mr-1 rounded-full overflow-hidden cursor-pointer'
                      src={likedPosts[post._id] ? HeartActive : Heart}
                      alt=""
                      onClick={() => handleLikeClick(post._id)}
                    />
                    <img
                      className='comment-box h-[2.1rem] w-[2.1rem] mb-[3px] overflow-hidden cursor-pointer'
                      src={Comment}
                      alt=""
                      onClick={() => handleCommentClick(post)}
                    />
                  </div>
                </div>
                <div className='pl-3'>
                  <p className='text-left font-light text-gray-700 poppins text-sm'>{post.description}</p>
                </div>
              </div>
            ))
          ) : (
            <div className='posts border border-gray-400 rounded-md flex flex-col mb-10 p-5 lg:w-[35vw] shadow-[0px_0px_8px_rgba(0,0,0,0.08)]'>
              <h2 className='text-center font-light poppins'>No posts found in the selected category</h2>
            </div>
          )
        )}

      </div>

      {activeCommentPost && (
        <CommentBox entity={activeCommentPost} onClose={handleCloseCommentBox} type="posts"/>
      )}
    </center>
  );
}

export default Posts;
