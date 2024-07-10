import { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDistanceToNow, parseISO } from 'date-fns';
import Cookies from 'js-cookie';
import CommentBox from '../CommentBox';

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

function Articles({articleCategory}) {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [likedArticles, setLikedArticles] = useState({});
  const [activeCommentPost, setActiveCommentPost] = useState(null); 

  const profileID = Cookies.get("profileID");

  useEffect(() => {
    const initialLikedArticles = {};
    axios.get('http://localhost:4000/articles')
      .then(response => {
        const articlesWithRelativeTime = response.data.map(article => ({
          ...article,
          relativeTime: formatDistanceToNow(parseISO(article.postedTime), { addSuffix: true })
        }));
        console.log(response.data)

        articlesWithRelativeTime.forEach(article => {
          const isLikedByUser = Array.isArray(article.likes) && article.likes.includes(profileID);
          initialLikedArticles[article._id] = isLikedByUser;
        });

        setArticles(articlesWithRelativeTime);
        setLikedArticles(initialLikedArticles);
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  }, [profileID]);

  console.log(articles)

  const handleLikeClick = async (articleId) => {
    try {
      const response = await axios.patch(`http://localhost:4000/articles/like/${articleId}`, { action: !likedArticles[articleId] ? 'like' : 'unlike', profileID });
      console.log(response)
      const updatedArticle = response.data;
      setArticles(articles.map(article => article._id === updatedArticle._id ? updatedArticle : article));
      setLikedArticles(prevLikedArticles => ({
        ...prevLikedArticles,
        [articleId]: !prevLikedArticles[articleId]
      }));
          } catch (error) {
      console.error(error);
    }
  };

  const handleCommentClick = (article) => {
    setActiveCommentPost(article);
  };

  const handleCloseCommentBox = () => {
    setActiveCommentPost(null);
  };
  
  const filteredArticles = articleCategory ? articles.filter(article => article.category === articleCategory) : articles;

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
              <div className="rounded p-2 flex items-center justify-between mt-1">
                <ShimmerBadge width={200} />
                <ShimmerButton size="md" />
              </div>
              <ShimmerText />
            </div>
          ))
        ) : (
filteredArticles.length>0 ? (
  filteredArticles.map((article, index) => (
    <div className="posts border border-gray-400 rounded-md flex flex-col mb-10 p-5 lg:w-[63vw] shadow-[0px_0px_8px_rgba(0,0,0,0.08)]" key={index} >
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
            <div className='h-[37vh] overflow-y-scroll'>
              <p className='font-light w-full text-gray-700 poppins text-sm border border-gray-150 rounded-md p-1' style={{ textAlign: 'justify' }}>{article.description}</p>
            </div>
            <div className='flex items-center justify-end mt-2'>
              <h2 className='mr-2 text-lg'>{Array.isArray(article.likes) ? article.likes.length : 0}</h2>
              <img className='h-10 w-10 mr-1 rounded-full overflow-hidden cursor-pointer' src={likedArticles[article._id] ? HeartActive : Heart} alt="" onClick={() => handleLikeClick(article._id)} />
              <img className='h-[2.1rem] w-[2.1rem] mb-[3px] overflow-hidden cursor-pointer' src={Comment} alt="" onClick={() => handleCommentClick(article)}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  ))
): (
  <div className='posts border border-gray-400 rounded-md flex flex-col mb-10 p-5 lg:w-[63vw] shadow-[0px_0px_8px_rgba(0,0,0,0.08)]'>
    <h2 className='text-center font-light poppins'>No articles found in the selected category</h2>
  </div>
)
        )}
      </div>
      {activeCommentPost && (
        <CommentBox entity={activeCommentPost} onClose={handleCloseCommentBox} type="articles"/>
      )}
    </center>
  );
}

export default Articles;
