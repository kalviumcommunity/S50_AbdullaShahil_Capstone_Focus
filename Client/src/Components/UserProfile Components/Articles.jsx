import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import NoProfile from "../../assets/noprofile.png";

import CommentBox from '../CommentBox';
import { ArticleShimmer } from '../Utils/Shimmers';
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

function Articles({ articles, likedArticles, toggleLike }) {
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [deleteArticleId, setDeleteArticleId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeCommentPost, setActiveCommentPost] = useState(null);

    const username = Cookies.get("name") ? Cookies.get("name").replace(/\"/g, '') : '';
    const profileID = Cookies.get('profileID');
    const navigate = useNavigate();

    useEffect(() => {
        if (articles && articles.length > 0) {
            setIsLoading(false);
        }
    }, [articles]);

    const handleDelete = () => {
        axios.delete(`http://localhost:4000/articles/${deleteArticleId}`, {
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

    const EditArticle = (id) => {
        navigate(`/edit/article/${id}`);
    }

    const handleCommentClick = (article) => {
        setActiveCommentPost(article);
    };

    const handleCloseCommentBox = () => {
        setActiveCommentPost(null);
    };

    return (
        <div className="pt-2 overflow-hidden">

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

            <div className="flex flex-col items-center">
                {isLoading ? (
                    
                    <ArticleShimmer />

                ) : (
                    articles.map((article, index) => (
                        <div className=" border bg-white border-gray-300 rounded-md flex flex-col p-5 my-5 lg:w-[60vw] shadow-[0px_0px_8px_rgba(0,0,0,0.08)]" key={index} >
                            <div className='top-opt flex justify-between items-center mb-5'>
                                <div className='flex items-center w-[15vw]'>
                                    <img className='h-12 w-12 rounded-full overflow-hidden' src={article.profile_img ? (article.profile_img) : (NoProfile)} alt="" />
                                    <h3 className='post-username pl-4 font-light poppins'>{username}</h3>
                                </div>
                                <div className="flex items-center">
                                    <h3 className='font-light poppins text-gray-700'>{article.relativeTime}</h3>
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
                                            <MenuItem className='mb-2 text-white bg-gray-800' onClick={() => EditArticle(article._id)}>Edit</MenuItem>
                                            <MenuItem onClick={() => {
                                                console.log(article._id);
                                                setShowDeleteConfirmation(true);
                                                setDeleteArticleId(article._id);
                                            }} className='text-white bg-red-500'>Delete</MenuItem>
                                        </MenuList>
                                    </Menu>
                                </div>
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
                                            <h2 className='mr-2 text-lg'>{article.likes.length}</h2>
                                            <img className='h-10 w-10 mr-1 rounded-full overflow-hidden cursor-pointer' src={likedArticles[article._id] ? HeartActive : Heart} alt="" onClick={() => toggleLike(article._id)} />
                                            <img className='h-[2.1rem] w-[2.1rem] mb-[3px] overflow-hidden cursor-pointer' src={Comment} alt="" onClick={() => handleCommentClick(article)} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            {activeCommentPost && (
                <CommentBox entity={activeCommentPost} onClose={handleCloseCommentBox} type="articles" />
            )}
        </div>
    )
}

export default Articles;
