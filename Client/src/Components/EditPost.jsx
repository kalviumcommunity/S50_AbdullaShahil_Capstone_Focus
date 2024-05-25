import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Select, Option } from "@material-tailwind/react";
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import axios from 'axios';
import { v4 } from 'uuid';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Header from './Home Components/Header';
import ProfileIMG2 from '../assets/review2.jpeg';
import { ImageDB } from '../firebase';

import 'ldrs/tailspin';
import 'ldrs/ring';

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [category, setCategory] = useState('');
  const [existingImage, setExistingImage] = useState('');
  const name = Cookies.get('name')?.replace(/\"/g, '');

  useEffect(() => {
    // Fetch the existing post data
    axios.get(`http://localhost:4000/posts/${id}`)
      .then(response => {
        const post = response.data;
        setValue('title', post.title);
        setValue('description', post.description);
        setCategory(post.category);
        setExistingImage(post.image);
      })
      .catch(error => {
        console.error('Error fetching post data', error);
      });
  }, [id, setValue]);

  const handleCategoryChange = (value) => {
    setCategory(value);
  };

  const navigateHome = () => {
    navigate('/home');
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const { title, description } = data;

      const payload = {
        title: title,
        description: description,
        category: category,
      };

      await axios.put(`http://localhost:4000/posts/${id}`, payload);
      setLoading(false);
      setIsSubmitted(true);
      setErrorMessage('');
      setTimeout(() => {
        navigate('/home');
      }, 300);

    } catch (error) {
      console.error(error);
      setLoading(false);
      setIsSubmitted(false);
      setErrorMessage('Submission failed. Please try again later.');
    }
  };

  return (
    <div>
      <Header />
      <div className=''>
        <center className=''>
          <h2 className="register-head textgray text-2xl font-semibold mt-10">Edit the post</h2>
          <form className="posts border border-gray-500 rounded-md flex flex-col mt-10 p-6 lg:w-[55vw] shadow-[0px_0px_8px_rgba(0,0,0,0.08)]" onSubmit={handleSubmit(onSubmit)}>
            {isSubmitted && !errorMessage ? (
              <div className="pop p-3 bg-green-500 text-white rounded mb-5">
                <p className="registered-heading">Updated successfully</p>
              </div>
            ) : errorMessage && !isSubmitted ? (
              <div className="pop p-3 bg-red-500 text-white rounded mb-5">
                <p className="registered-heading">{errorMessage}</p>
              </div>
            ) : null}

            <div className='top-opt flex justify-between items-center mb-5'>
              <div className='flex items-center w-[15vw] '>
                <img className='h-12 w-12 rounded-full overflow-hidden' src={ProfileIMG2} alt="" />
                <h3 className='post-username pl-4 font-normal poppins'>{name}</h3>
              </div>

              {loading && <l-ring size="40" stroke="5" bg-opacity="0" speed="2" color="#2E93FF"></l-ring>}
            </div>

            <div className='flex items-start justify-between '>
              {existingImage && <div className="w-[20vw] h-[45vh] existing-image-wrapper  image-wrapper-4x3 rounded-md">
                <img src={existingImage} alt="Image 4x3" className='rounded-md ' />
              </div>}
              <div className='flex flex-col w-[30vw] h-full'>

                <label className='text-left textgray mb-1' htmlFor="title">Title</label>
                <input className="form-input bg-gray-100 p-3 rounded border border-gray-400" {...register('title', {
                  required: 'This Field is required',
                  minLength: { value: 5, message: 'Minimum 5 characters are required' },
                  maxLength: { value: 30, message: 'Maximum length is 30 characters' }
                })} placeholder="Enter the Title" id="title" />
                <br />
                {errors.title && <span className="text-left text-red-500">{errors.title.message}</span>}

                <label className='text-left textgray mb-1' htmlFor="description">Description</label>
                <textarea className="form-input bg-gray-100 p-3 rounded border border-gray-400 mb-3" {...register('description', {
                  required: 'This Field is required',
                  minLength: { value: 3, message: 'Minimum 3 characters are required' },
                })} placeholder="Enter the description" id="description" maxLength={250} style={{ maxHeight: "200px", minHeight:"93px" }} />
                <br />
                {errors.description && <span className="text-left text-red-500">{errors.description.message}</span>}


                  <div className=' mb-5'>
                    <Select
                      label="Select Category"
                      value={category}
                      id="category"
                      onChange={handleCategoryChange}
                    >
                      <Option value="Portraits">Portraits</Option>
                      <Option value="Landscapes">Landscapes</Option>
                      <Option value="Grayscales">Grayscales</Option>
                      <Option value="Macro">Macro</Option>
                      <Option value="Minimal">Minimal</Option>
                    </Select>
                  </div>

                <div className='flex items-center w-full h-12'>
                  <button onClick={navigateHome} className="submit-btn font-bold bg-gray-800 text-white rounded p-2 h-full w-1/2 mr-1 hover:bg-gray-600 transition">Cancel</button>
                  <button className="submit-btn rounded text-white font-bold p-2 gradient1 h-full w-1/2 hover:opacity-90 transition">Update</button>
                </div>
              </div>
            </div>
          </form>
        </center>
      </div>
    </div>
  );
}

export default EditPost;
