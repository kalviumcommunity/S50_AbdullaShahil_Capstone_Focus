import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import NoProfile from "../../assets/noprofile.png";
import { PostShimmer } from '../Utils/Shimmers';
import CommentBox from '../CommentBox';
import Heart from '../../assets/heart.png';
import HeartActive from '../../assets/heartactive.png';
import Comment from '../../assets/comment.png';
import more from '../../assets/more.png';
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";

function Posts({ posts, likedPosts, toggleLike }) {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deletePostId, setDeletePostId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCommentPost, setActiveCommentPost] = useState(null);  

  const profileID = Cookies.get('profileID');
  const navigate = useNavigate();
  const username = Cookies.get("name").replace(/\"/g, '');

  useEffect(() => {
    if (posts && posts.length > 0) {
        setIsLoading(false);
    }
}, [posts]);
  const handleDelete = () => {
    axios.delete(`http://localhost:4000/posts/${deletePostId}`, {
      headers: {
        'profileID': profileID
      }
    })
    .then(response => {
      console.log(response);
      setShowDeleteConfirmation(false);
      window.location.reload();
    })
    .catch(err => {
      console.log(err);
    });
  };

  const EditPost = (id) => {
    navigate(`/edit/post/${id}`);
  }

  const handleCommentClick = (post) => {
    setActiveCommentPost(post);
  };

  const handleCloseCommentBox = () => {
    setActiveCommentPost(null);
  };

  return (
    <center className="">
      {showDeleteConfirmation && (
        <div>
          <div className="overlay"></div>
          <div className="border delete-popup rounded flex flex-col justify-around">
            <h2 className='mb-7'>Are you sure you want to delete your post?</h2>
            <div>
              <button onClick={handleDelete} className='py-3 px-5 mr-5 rounded bg-red-500 text-white font-bold hover:bg-red-400'>Yes</button>
              <button onClick={() => setShowDeleteConfirmation(false)} className='py-3 px-5 ml-5 border rounded text-black font-bold'>No</button>
            </div>
          </div>
        </div>
      )}

      <div className="pt-12 grid grid-cols-1 lg:grid-cols-3">
        {isLoading ? (

          <PostShimmer scaleValue="80%" />

        ) : (
          posts.map((post, index) => (
            <center key={index} className='flex'>
              <div className="posts bg-white border border-gray-300 rounded-md flex flex-col mb-10 p-5 w-[85vw] md:w-[55vw] lg:w-[35vw] scale-90 shadow-[0px_0px_8px_rgba(0,0,0,0.08)]">
                <div className='top-opt flex justify-between items-center mb-5'>
                  <div className='flex items-center w-[25vw] sm:w-[20vw] md:w-[15vw]'>
                    <img className='md:h-12 md:w-12 rounded-full overflow-hidden' src={ post.profile_img ? (post.profile_img):(NoProfile) } alt="" />
                    <h3 className='post-username pl-4 font-light poppins'>{username}</h3>
                  </div>

                  <div className="flex items-center">
                    <h1 className='font-light'>{post.category}</h1>
                    <Menu
                      animate={{
                        mount: { y: 0 },
                        unmount: { y: 25 },
                      }}
                    >
                      <MenuHandler>
                        <img className='h-9 p-1 ml-5 cursor-pointer hover:bg-gray-100 rounded-full' src={more} alt="more options" />
                      </MenuHandler>
                      <MenuList>
                        <MenuItem className='mb-2 text-white bg-gray-800' onClick={() => EditPost(post._id)}>Edit</MenuItem>
                        <MenuItem onClick={() => {
                          console.log(post._id);
                          setShowDeleteConfirmation(true);
                          setDeletePostId(post._id);
                        }} className='text-white bg-red-500'>Delete</MenuItem>
                      </MenuList>
                    </Menu>
                  </div>
                </div>
                <div className="image-wrapper image-wrapper-4x3 rounded-md">
                  <img src={post.image} alt="Image 4x3" className='rounded-md' />
                </div>
                <div className="post-options rounded p-3 flex items-center justify-between mt-1">
                  <h1 className='font-semibold text-xl textgray poppins'>{post.title}</h1>
                  <div className='flex justify-between items-center'>
                    <h2 className='mr-2 text-lg'>{post.likes.length}</h2>
                    <img className='h-10 w-10 mr-1 rounded-full overflow-hidden cursor-pointer' src={likedPosts[post._id] ? HeartActive : Heart} alt="" onClick={() => toggleLike(post._id)} />
                    <img className='h-[2.1rem] w-[2.1rem] mb-[3px] overflow-hidden cursor-pointer' src={Comment} alt="" onClick={() => handleCommentClick(post)}/>
                  </div>
                </div>
                <div className='pl-3'>
                  <p className='text-left font-light text-gray-700 poppins text-sm'>{post.description}</p>
                </div>
              </div>
            </center>
          ))
        )}
      </div>

      {activeCommentPost && (
        <CommentBox entity={activeCommentPost} onClose={handleCloseCommentBox} type="posts"/>
      )}
    </center>
  );
}

export default Posts;
