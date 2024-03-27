import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { useState } from "react";
import ProfileIMG2 from '../assets/review2.jpeg';
import Header from './Home Components/Header'

import Cookies from 'js-cookie';
import axios from 'axios';

function Post() {

  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const username = Cookies.get("name");
  const navigate = useNavigate();

  const navigateHome = () => {
    navigate('/home');
  }

  const onSubmit = data => {
    const { title, description, imageUrl } = data;

    axios.post('http://localhost:4000/posts', {
      name: username,
      title,
      description,
      imageUrl
    })
      .then(response => {
        console.log(response);
        setIsSubmitted(true);
        setErrorMessage('');
        setTimeout(() => {
          navigate('/home');
        }, 300);
      })
      .catch(error => {
        if (error.response) {
          setErrorMessage('Submission failed. Please try again later.');
        } else if (error.request) {
          setErrorMessage('Submission failed. Please check your internet connection.');
          console.error(error.request);
        } else {
          setErrorMessage('Submission failed. Please try again later.');
          console.error('Error', error.message);
        }
      });
  };

  return (
    <div>
      <Header />
      <div className=''>
        <center>
          <h2 className="register-head textgray text-2xl font-semibold mt-10">Create new post</h2>
          <form className="posts border border-gray-300 rounded-md flex flex-col mt-10 p-5 lg:w-[45vw] shadow-[0px_0px_8px_rgba(0,0,0,0.08)]" onSubmit={handleSubmit(onSubmit)}>
            {isSubmitted && !Object.keys(errors).length && (
              <div className="pop p-3 bg-green-500 text-white rounded mb-5">
                <p className="registered-heading">Posted successfully</p>
              </div>
            )}
            {errorMessage && (
              <div className="pop p-3 bg-red-500 text-white rounded mb-5">
                <p className="registered-heading">{errorMessage}</p>
              </div>
            )}
            <div className=' top-opt flex justify-between items-center mb-5'>
              <div className='flex items-center w-[15vw]'>
                <img className='h-12 w-12 rounded-full overflow-hidden' src={ProfileIMG2} alt="" />
                <h3 className='post-username pl-4 font-normal poppins'>{username}</h3>
              </div>
              <h1></h1>
            </div>
            <label className='text-left textgray mb-1 ' htmlFor="title">Title</label>
            <input className="form-input bg-gray-100 p-3 rounded border" {...register('title', {
              required: 'This Field is required',
              minLength: { value: 5, message: 'Minimum 5 characters are required' },
              maxLength: { value: 20, message: 'Maximum length is 20 characters' }
            })} placeholder="Enter the Title" id="title" />
            <br />
            {errors.title && <span className=" text-left text-red-500">{errors.title.message}</span>}
            <label className='text-left textgray mb-1 ' htmlFor="description">Description</label>
            <textarea className="form-input bg-gray-100 p-3 rounded border" {...register('description', {
              required: 'This Field is required',
              minLength: { value: 3, message: 'Minimum 3 characters are required' },
            })} placeholder="Enter the description " id="description" maxLength={250} style={{ maxHeight: "200px" }} />
            <br />
            {errors.description && <span className="text-left text-red-500">{errors.description.message}</span>}
            <label className='text-left textgray mb-1 ' htmlFor="imageUrl">Image URL</label>
            <input
              className="form-input bg-gray-100 p-3 rounded border "
              {...register('imageUrl', {
                required: 'This Field is required',
                minLength: { value: 5, message: 'Minimum 5 characters are required' },
              })}
              placeholder="Enter the Image Link"
              id="imageUrl"
            />
            <br />
            <div className='flex items-center  w-full h-12'>
              <button onClick={navigateHome} className="submit-btn font-bold textgray border rounded p-2 h-full w-1/2 mr-1">Cancel</button>
              <button type="submit" className="submit-btn rounded text-white font-bold p-2 gradient1 h-full w-1/2">Post</button>
            </div>
          </form>
        </center>
      </div>
    </div>
  )
}

export default Post;
