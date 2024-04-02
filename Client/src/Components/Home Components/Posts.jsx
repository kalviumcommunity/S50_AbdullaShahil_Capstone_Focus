import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ShimmerButton,
  ShimmerText,
  ShimmerCircularImage,
  ShimmerThumbnail,
  ShimmerBadge,
} from "react-shimmer-effects";
import ProfileIMG2 from '../../assets/review2.jpeg';
import Heart from '../../assets/heart.png';
import HeartActive from '../../assets/heartactive.png';
import Comment from '../../assets/comment.png';

function Posts() {
  const [isLiked, setIsLiked] = useState(false);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
  };

  useEffect(() => {
    axios.get('http://localhost:4000/posts')
      .then(response => {
        setPosts(response.data);
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  }, []);
  

  return (
    <center className="h-[85vh]  pl-5 pr-5 pt-10 overflow-hidden">
      <input className='w-[30vw] search border border-gray-400 rounded-full px-8 py-4 mb-4' id="genreSelect" placeholder='Search...' />
      <div className="pt-12 px-5 overflow-scroll h-[75vh]">

        {isLoading ? (
          Array.from({ length: 10 }).map((_, index) => (
            <div className='posts border border-gray-300 rounded-md flex flex-col mb-10 p-5 lg:w-[35vw] shadow-[0px_0px_8px_rgba(0,0,0,0.08)]' key={index}>
              <div className='flex justify-between items-center '>
                <div className="flex justify-between items-center">
                  <ShimmerCircularImage size={50} />
                  <div style={{ width: '10px' }}></div>
                  <ShimmerBadge width={130} />
                </div>

                <ShimmerBadge width={70} />
              </div>
              <ShimmerThumbnail height={550} rounded />
              <div className="rounded  p-2 flex items-center  justify-between  mt-1">
                <ShimmerBadge width={200} />
                <ShimmerButton size="md" />
              </div>

              <ShimmerText />
            </div>
          ))
        ) : (
          posts.map((post, index) => {
            return (
              <div className="posts border border-gray-300 rounded-md flex flex-col mb-10 p-5 lg:w-[35vw] shadow-[0px_0px_8px_rgba(0,0,0,0.08)]" key={index} >
                <div className='top-opt flex justify-between items-center mb-5'>
                  <div className='flex items-center w-[15vw]'>
                    <img className='h-12 w-12 rounded-full overflow-hidden' src={ProfileIMG2} alt="" />
                    <h3 className='post-username pl-4 font-light poppins'>{post.name}</h3>
                  </div>
                  <h1>Nature</h1>
                </div>
                <div className="image-wrapper image-wrapper-4x3 rounded-md">
                  <img src={`data:image/png;base64, ${post.image}`} alt="Image 4x3" className='rounded-md' />
                </div>
                <div className="post-options  rounded  p-3 flex items-center  justify-between  mt-1">
                  <h1 className=' font-semibold text-xl textgray poppins'>{post.title}</h1>
                  <div className='flex justify-between items-center'>
                    <img className='h-10 w-10 mr-1 rounded-full overflow-hidden' src={isLiked ? HeartActive : Heart} alt="" onClick={handleLikeClick} />
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
