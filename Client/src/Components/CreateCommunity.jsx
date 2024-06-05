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

import 'tailwindcss/tailwind.css';
import sendButton from "../assets/sendbutton.png";


function CreateCommunity() {

    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const admin = Cookies.get('profileID');
    const name = Cookies.get('name');
    const navigate = useNavigate();
  
    const getCurrentTime = () => {
      const currentTime = new Date();
      return currentTime.toLocaleString();
    };
  
    const toChats = () => {
      navigate('/chats');
    };
    const onSubmit = async (data) => {
      try {
        setLoading(true);
  
        const { name, description, profileImg } = data;
        const Image = ref(ImageDB, `CommunityImg/${v4()}`);
        await uploadBytes(Image, profileImg[0]);
        const imageUrl = await getDownloadURL(Image);
  
        const payload = {
          name: name,
          admin: admin,
          description: description,
          profileImg: imageUrl,
        };
  
        await axios.post('http://localhost:4000/communities', payload);
        setLoading(false);
        setIsSubmitted(true);
        setErrorMessage('');
        console.log("POST REQUEST SUCCESSFUL")
        setTimeout(() => {
          navigate('/chats');
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
        <h2 className="register-head textgray text-2xl font-semibold mt-10">Create a Community</h2>
        <form className="posts border border-gray-500 rounded-md flex flex-col mt-10 p-6 lg:w-[45vw] shadow-[0px_0px_8px_rgba(0,0,0,0.08)]" onSubmit={handleSubmit(onSubmit)}>
          {isSubmitted && !errorMessage ? (
            <div className="pop p-3 bg-green-500 text-white rounded mb-5">
              <p className="registered-heading">Created successfully</p>
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
          <label className='text-left textgray mb-1 ' htmlFor="name">Community name</label>
          <input className="form-input bg-gray-100 p-3 rounded border border-gray-400" {...register('name', {
            required: 'This Field is required',
            minLength: { value: 5, message: 'Minimum 5 characters are required' },
            maxLength: { value: 30, message: 'Maximum length is 30 characters' }
          })} placeholder="Enter the Name" id="name" />
          <br />
          {errors.title && <span className=" text-left text-red-500">{errors.title.message}</span>}

          <label className='text-left textgray mb-1 ' htmlFor="description">Description</label>
          <textarea className="form-input bg-gray-100 p-3 rounded border border-gray-400" {...register('description', {
            required: 'This Field is required',
            minLength: { value: 3, message: 'Minimum 3 characters are required' },
          })} placeholder="Enter the description " id="description" maxLength={2500} style={{ maxHeight: "250px" }} />
          <br />
          {errors.description && <span className="text-left text-red-500">{errors.description.message}</span>}

          <label className="text-left textgray mb-1">Upload Profile image</label>
          <input
              type="file"
              className="flex h-10 w-full text-gray-800 rounded-lg border file:h-10 file:mr-4 file:py-2 file:px-5 items-center 
              file:rounded-md file:bg-gray-700 border-gray-400 bg-white file:text-white hover:file:bg-gray-600 text-sm file:border-0  file:text-md file:font-bold file:cursor-pointer"
              {...register('profileImg', {
                required: 'This Field is required',
              })}
              id="profileImg"
            />


          <br />
          {errors.image && <span className="text-left text-red-500">{errors.image.message}</span>}
          <div className='flex items-center  w-full h-12'>
            <button onClick={toChats} className="submit-btn font-bold bg-gray-800 text-white  rounded p-2 h-full w-1/2 mr-1 hover:bg-gray-600 transition">Cancel</button>
            <button className="submit-btn rounded text-white font-bold p-2 gradient1 h-full w-1/2 hover:opacity-90 transition">Create</button>
          </div>
        </form>
      </center>
    </div>
  </div>
  )
}

export default CreateCommunity