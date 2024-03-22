import { useState } from 'react';
import ProfileIMG2 from '../../assets/review2.jpeg';
import Post1 from '../../assets/fouristothree.jpeg';
import Heart from '../../assets/heart.png';
import HeartActive from '../../assets/heartactive.png';
import Comment from '../../assets/comment.png';

function Posts() {
  const [isLiked, setIsLiked] = useState(false);

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
  };

  return (
    <center className="h-[78vh] pl-5 pr-5 pt-10 overflow-hidden">

      <input className='w-[30vw] search border border-gray-400 rounded-full px-8 py-4 mb-4' id="genreSelect" placeholder='Search...' />

      <div className="pt-12 px-5 overflow-scroll h-[68vh]">

        <div className="posts border border-gray-300 rounded-md flex flex-col mb-10 p-5 lg:w-[45vw] shadow-[0px_0px_8px_rgba(0,0,0,0.08)]" >

          <div className=' top-opt flex justify-between items-center mb-5'>
            <div className='flex items-center w-[15vw]'>
              <img className='h-12 w-12 rounded-full overflow-hidden' src={ProfileIMG2} alt="" />
              <h3 className='post-username pl-4 font-light poppins'>Abhishek</h3>
            </div>

              <h1><strong>Nature</strong></h1>
          </div>

          <div className="image-wrapper image-wrapper-4x3 rounded-md">
            <img src={Post1} alt="Image 4:3" className='rounded-md' />
          </div>

          <div className="post-options  rounded  p-3 flex items-center  justify-between  mt-5">
            <h1 className=' font-semibold text-xl textgray poppins'>The beauty of mountains</h1>

            <div className='flex justify-between items-center'>
              <img className='h-10 w-10 mr-1 rounded-full overflow-hidden' src={isLiked ? HeartActive : Heart} alt="" onClick={handleLikeClick} />

              <img className='h-[2.1rem] w-[2.1rem] mb-[3px] overflow-hidden' src={Comment} alt="" />
            </div>
          </div>

          <div className='pl-3'>
            <p className='text-left font-light text-gray-700 poppins text-sm'>Click Sphere, your ultimate online platform for photographers. Showcase your creativity, connect with peers, and elevate your craft. Upload your best shots and collaborate seamlessly.
            </p>
          </div>

        </div>

        <div className="posts border border-gray-300 rounded-md flex flex-col mb-10 p-5 lg:w-[45vw] shadow-[0px_0px_8px_rgba(0,0,0,0.08)]" >

<div className=' top-opt flex justify-between items-center'>
  <div className='flex items-center w-[15vw]'>
    <img className='h-12 w-12 rounded-full overflow-hidden' src={ProfileIMG2} alt="" />
    <h3 className='post-username pl-4 poppins'>Abhishek</h3>
  </div>

  <div className="post-top mb-5 rounded  p-3 flex items-center  justify-between">
    <h1 className='font-semibold text-xl textgray poppins'>Nature</h1>
  </div>
</div>

<div className="image-wrapper image-wrapper-4x3 rounded-md">
  <img src={Post1} alt="Image 4:3" className='rounded-md' />
</div>

<div className="post-options  rounded  p-3 flex items-center  justify-between  mt-5">
  <h1 className=' font-semibold text-xl textgray poppins'>The beauty of mountains</h1>

  <div className='flex justify-between items-center'>
    <img className='h-10 w-10 mr-1 rounded-full overflow-hidden' src={isLiked ? HeartActive : Heart} alt="" onClick={handleLikeClick} />

    <img className='h-[2.1rem] w-[2.1rem] mb-[3px] overflow-hidden' src={Comment} alt="" />
  </div>
</div>

<div className='pl-3'>
  <p className='text-left font-light text-gray-700 poppins text-sm'>Click Sphere, your ultimate online platform for photographers. Showcase your creativity, connect with peers, and elevate your craft. Upload your best shots and collaborate seamlessly.
  </p>
</div>

</div>

      </div>

    </center>
  )
}

export default Posts;
