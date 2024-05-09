import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import axios from 'axios';
import { v4 } from 'uuid';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Header from './Home Components/Header';
import ProfileIMG2 from '../assets/review2.jpeg';
import { ImageDB } from '../firebase';

import 'ldrs/tailspin'
import 'ldrs/ring'


function Write() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const name = Cookies.get('name');
  const navigate = useNavigate();

  const getCurrentTime = () => {
    const currentTime = new Date();
    return currentTime.toLocaleString();
  };

  console.log(getCurrentTime())

  const navigateLensHub = () => {
    navigate('/lenshub');
  };
  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const { title, description, image } = data;
      const Image = ref(ImageDB, `Articles/${v4()}`);
      await uploadBytes(Image, image[0]);
      const imageUrl = await getDownloadURL(Image);

      const payload = {
        name: name,
        title: title,
        description: description,
        image: imageUrl,
      };

      await axios.post('http://localhost:4000/articles', payload);
      setLoading(false);
      setIsSubmitted(true);
      setErrorMessage('');
      console.log("POST REQUEST SUCCESSFUL")
      setTimeout(() => {
        navigate('/home');
      }, 300);

    } catch (error) {
      console.log(error)
      setLoading(false);
      setIsSubmitted(false);
      if (error.request || error.response) {
        setErrorMessage('Submission failed. Please try again later.');
        console.error('Error', error.message);
      } else {
        setErrorMessage('Submission failed. Please check your network connection.');
      }
    }
  };
  


  return (
    <div>
      <Header />
      <div className=''>
        <center className=''>
          <h2 className="register-head textgray text-2xl font-semibold mt-10">Write a new article</h2>
          <form className="posts border border-gray-300 rounded-md flex flex-col mt-10 p-6 lg:w-[45vw] shadow-[0px_0px_8px_rgba(0,0,0,0.08)]" onSubmit={handleSubmit(onSubmit)}>
            {isSubmitted && !errorMessage ? (
              <div className="pop p-3 bg-green-500 text-white rounded mb-5">
                <p className="registered-heading">Posted successfully</p>
              </div>
            ) : errorMessage && !isSubmitted ? (
              <div className="pop p-3 bg-red-500 text-white rounded mb-5">
                <p className="registered-heading">{errorMessage}</p>
              </div>
            ) : null}


            <div className=' top-opt flex justify-between items-center mb-5'>
              <div className='flex items-center w-[15vw]'>
                <img className='h-12 w-12 rounded-full overflow-hidden' src={ProfileIMG2} alt="" />
                <h3 className='post-username pl-4 font-normal poppins'>{name}</h3>
              </div>

              {loading && <l-ring
                size="40"
                stroke="5"
                bg-opacity="0"
                speed="2"
                color="#2E93FF"
              ></l-ring>}

            </div>
            <label className='text-left textgray mb-1 ' htmlFor="title">Title</label>
            <input className="form-input bg-gray-100 p-3 rounded border" {...register('title', {
              required: 'This Field is required',
              minLength: { value: 5, message: 'Minimum 5 characters are required' },
              maxLength: { value: 30, message: 'Maximum length is 30 characters' }
            })} placeholder="Enter the Title" id="title" />
            <br />
            {errors.title && <span className=" text-left text-red-500">{errors.title.message}</span>}

            <label className='text-left textgray mb-1 ' htmlFor="description">Description</label>
            <textarea className="form-input bg-gray-100 p-3 rounded border" {...register('description', {
              required: 'This Field is required',
              minLength: { value: 3, message: 'Minimum 3 characters are required' },
            })} placeholder="Enter the description " id="description" maxLength={2500} style={{ maxHeight: "250px" }} />
            <br />
            {errors.description && <span className="text-left text-red-500">{errors.description.message}</span>}

            <label className="text-sm text-left textgray mb-1">Upload Image</label>
            <input
              type="file"
              className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-gray-400 file:border-0 file:bg-transparent file:text-gray-600 file:text-sm file:font-medium"
              {...register('image', {
                required: 'This Field is required',
              })}
              id="image"
            />

            <br />
            {errors.image && <span className="text-left text-red-500">{errors.image.message}</span>}
            <div className='flex items-center  w-full h-12'>
              <button onClick={navigateLensHub} className="submit-btn font-bold textgray border rounded p-2 h-full w-1/2 mr-1">Cancel</button>
              <button className="submit-btn rounded text-white font-bold p-2 gradient1 h-full w-1/2">Post</button>
            </div>
          </form>
        </center>
      </div>
    </div>
  )
}

export default Write;
