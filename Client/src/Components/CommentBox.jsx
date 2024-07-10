import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Toaster, toast } from 'sonner';

import postComment from '../assets/post-comment.png';
import more from '../assets/more.png';

function CommentBox({ entity, onClose, type }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const username = Cookies.get("name") ? Cookies.get("name").replace(/\"/g, '') : '';

    const [showOptionsIndex, setShowOptionsIndex] = useState(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [deleteCommentId, setDeleteCommentId] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:4000/${type}/comments/${entity._id}`)
        .then(response => {
            const fetchedComments = response.data.map(comment => ({
                    ...comment,
                    relativeTime: formatDistanceToNow(parseISO(comment.postedTime), { addSuffix: true })
                }));
                setComments(fetchedComments.reverse());
            })
            .catch(err => {
                console.log(err);
            });
    }, [entity._id]);
    
    const handleDelete = (commentId, entityId) => {
        axios.delete(`http://localhost:4000/${type}/comments/delete/${entityId}`, { params: {commentId} })
            .then(response => {
                toast.success('Comment deleted successfully');
                console.log(response);
                setComments(comments.filter(comment => comment._id !== commentId));
                setShowDeleteConfirmation(false);
            })
            .catch(err => {
                toast.error('Event has not been created');
                console.log(err);
            });
    };

    const handleCommentChange = (event) => {
        setNewComment(event.target.value);
    };
        
    const handleCommentSubmit = (event) => {
        event.preventDefault();
        
        const payload = {
            name: username,
            message: newComment,
        };
        
        axios.post(`http://localhost:4000/${type}/comments/${entity._id}`, payload)
        .then(response => {
            toast.success('Comment added successfully');
            console.log(response);
            const newComment = {
                name: response.data.name,
                message: response.data.message,
                relativeTime: "now",
                _id: response.data._id
            };
            setComments([newComment, ...comments]);
            setNewComment("");
        })
        .catch(err => {
            toast.error('An unexpected error occured');
            console.log(err);
        });
    };

    return (
        <div>
            <Toaster richColors position="top-center" />
            <div className="fixed top-0 left-0 w-full h-full flex items-end justify-center bg-black bg-opacity-50">
            <section className="w-full rounded-3xl rounded-b-none border-2 text-left bg-white border-gray-600 p-4 mx-auto max-w-xl animate-slideUp">
                <div className="flex justify-between items-center">
                    <h3 className="poppins text-2xl font-semibold">Comments</h3>
                    <button
                        className="text-gray-800 hover:text-red-600 flex justify-center items-center text-4xl mb-1 h-12 w-12 hover:bg-gray-100 rounded-full transition"
                        onClick={onClose}
                    >
                        <span className="mb-1 close-button">&times;</span>
                    </button>
                </div>
                {showDeleteConfirmation && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg z-50 text-center">
                            <h2 className='mb-7 poppins'>Are you sure you want to delete this comment?</h2>
                            <div>
                                <button onClick={() => handleDelete(deleteCommentId, entity._id)} className='py-3 px-5 mr-5 rounded bg-red-500 text-white font-bold hover:bg-red-400'>Yes</button>
                                <button onClick={() => setShowDeleteConfirmation(false)} className='py-3 px-5 ml-5 border rounded text-black font-bold'>No</button>
                            </div>
                        </div>
                    </div>
                )}
                <div className='overflow-x-scroll h-[60vh] bg-gray-100 p-1 px-4 rounded-xl'>
                    {comments.length > 0 ? (
                        comments.map((comment, index) => (
                            <div className="flex mt-5 p-2 rounded-lg bg-white" key={index}>
                                <div className="w-14 h-14 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center">
                                    <img className="h-12 w-12 rounded-full object-cover" src="https://randomuser.me/api/portraits/men/43.jpg" alt="" />
                                </div>
                                <div className="ml-3 w-full">
                                    <div className="h-6 flex justify-between items-center">
                                        <div className="font-medium text-sm poppins text-gray-800">
                                            {comment.name === username ? 'You' : comment.name}
                                        </div>

                                        {comment.name === username && (
                                            <div className='relative'>
                                                <img
                                                    className='h-8 p-1 ml-5 cursor-pointer hover:bg-gray-100 rounded-full'
                                                    src={more}
                                                    alt="more options"
                                                    onClick={() => setShowOptionsIndex(showOptionsIndex === index ? null : index)}
                                                />
                                                {showOptionsIndex === index && (
                                                    <div className='absolute top-10 p-1 right-0 w-32 bg-white shadow-[0px_0px_8px_rgba(0,0,0,0.08)] rounded-lg'>
                                                        <button
                                                            className='block w-full text-left px-4 py-2 rounded-md transition text-white text-sm bg-red-500 hover:bg-gray-100 hover:text-gray-800'
                                                            onClick={() => {
                                                                setShowDeleteConfirmation(true);
                                                                setShowOptionsIndex(null);
                                                                setDeleteCommentId(comment._id);
                                                            }}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className="poppins text-xs text-gray-500">{comment.relativeTime}</div>
                                    <div className="mt-1 poppins text-black">{comment.message}</div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex justify-center items-center mt-12">
                            <h1 className="poppins textgray">Be the first one to comment.</h1>
                        </div>
                    )}
                </div>

                <form className="mt-4 flex justify-between items-center" onSubmit={handleCommentSubmit}>
                    <input
                        id="comment"
                        name="comment"
                        className="border-2 border-gray-800 p-2 w-full rounded-full placeholder:text-sm placeholder:pl-2"
                        required
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={handleCommentChange}
                    />
                    <button type="submit">
                        <img src={postComment} className="h-[6vh] w-[4vw] cursor-pointer text-white font-medium rounded hover:opacity-80" alt="Post Comment" />
                    </button>
                </form>
            </section>
        </div>
        </div>
    );
}

export default CommentBox;
