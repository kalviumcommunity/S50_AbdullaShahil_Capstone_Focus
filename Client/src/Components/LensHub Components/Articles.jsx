import { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { parseISO } from 'date-fns';

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


function Articles() {
  const [isLiked, setIsLiked] = useState(false);
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
  };

  useEffect(() => {
    axios.get(`http://localhost:4000/articles`)
      .then(response => {
        const articlesWithRelativeTime = response.data.map(article => ({
          ...article,
          relativeTime: formatDistanceToNow(parseISO(article.postedTime), { addSuffix: true })
        }));
        setArticles(articlesWithRelativeTime);
        console.log(articlesWithRelativeTime)
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  }, []);



  return (
    <center className="h-[85vh] pt-10 overflow-hidden">
      <input className='w-[30vw] search border border-gray-400 rounded-full px-8 py-4 mb-4' id="genreSelect" placeholder='Search...' />
      <div className="pt-12 px-5 overflow-scroll h-[75vh]">

        {isLoading ? (
          Array.from({ length: 10 }).map((_, index) => (
            <div className='posts border border-gray-300 rounded-md flex flex-col mb-10 p-5 lg:w-[63vw] shadow-[0px_0px_8px_rgba(0,0,0,0.08)]' key={index}>
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
          articles.map((article, index) => {
            return (
              <div className="posts border border-gray-300 rounded-md flex flex-col mb-10 p-5 lg:w-[63vw] shadow-[0px_0px_8px_rgba(0,0,0,0.08)]" key={index} >
                <div className='top-opt flex justify-between items-center mb-5'>
                  <div className='flex items-center w-[15vw]'>
                    <img className='h-12 w-12 rounded-full overflow-hidden' src={ProfileIMG2} alt="" />
                    <h3 className='post-username pl-4 font-light poppins'>{article.name}</h3>
                  </div>
                  <h3 className='font-light poppins text-gray-700'>{article.relativeTime}</h3>
                </div>

                <div className='flex justify-center'>

                  <div className="article-image-wrapper rounded-md">
                    <img src={article.image} alt="Image" className='rounded-md' style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>


                  <div className="post-options rounded flex ">

                    <div className='pl-3 w-[35vw] '>
                      <h1 className='font-semibold text-left text-xl textgray poppins mb-2'>{article.title}</h1>

                      <div className='h-[37vh] overflow-scroll'>
                        <p className=' font-light text-gray-700 poppins text-sm border border-gray-150 rounded-md p-1' style={{ textAlign: 'justify' }}>{article.description}</p>
                      </div>

                      <div className='flex items-center justify-end'>
                        <img className='h-10 w-10 mr-1 rounded-full overflow-hidden' src={isLiked ? HeartActive : Heart} alt="" onClick={handleLikeClick} />
                        <img className='h-[2.1rem] w-[2.1rem] mb-[3px] overflow-hidden' src={Comment} alt="" />
                      </div>

                    </div>

                  </div>
                </div>


              </div>
            )
          })
        )}

      </div>
    </center>
  )
}

export default Articles;