import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { useState } from "react";
import Cookies from 'js-cookie';
import axios from 'axios';
function Post() {

  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const username = Cookies.get("name");
  const navigate = useNavigate();


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
        setTimeout(() => {
          navigate('/home');
        }, 300);
      })
      .catch(error => {
        if (error.response) {
          setErrorMessage('Submission failed. Please try again later.');
          console.error(error.response.data);
          console.error(error.response.status);
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


      <div className=''>
        <center>
          <h2 className="register-head mb-5">Create new post</h2>
          <form className="rounded-md w-2/4" onSubmit={handleSubmit(onSubmit)}>

            {isSubmitted && !Object.keys(errors).length && (
              <div className="pop p-3 bg-green-500 text-white rounded mb-5">
                <p className="registered-heading">Posted successfully</p>
              </div>
            )}
            {errorMessage &&
              <div className="pop p-3 bg-red-500 text-white rounded mb-5">
                <p className="registered-heading">{errorMessage}
                </p>
              </div>
            }

            <label htmlFor="title">Song Title</label>
            <input className="form-input border mt-5" {...register('title', {
              required: 'This Field is required',
              minLength: { value: 5, message: 'Minimum 5 characters are required' },
              maxLength: { value: 20, message: 'Maximum length is 20 characters' }
            })} placeholder="Enter the Song Title" id="title" />
            <br />
            {errors.title && <span className="error-span">{errors.title.message}</span>}

            <br />
            <label htmlFor="description">Description</label>
            <input className="form-input border mt-5" {...register('description', {
              required: 'This Field is required',
              minLength: { value: 3, message: 'Minimum 3 characters are required' },
            })} placeholder="Enter the description " id="description" />
            <br />
            {errors.description && <span className="error-span">{errors.description.message}</span>}

            <label className='mt-minus' htmlFor="imageUrl">Image/Video URL</label>
            <input
              className="form-input border mt-5 mb-2"
              {...register('imageUrl', {
                required: 'This Field is required',
                minLength: { value: 5, message: 'Minimum 5 characters are required' },
              })}
              placeholder="Enter the Image/Video Link"
              id="imageUrl"
            />

            <br />
            <button className="submit-btn rounded bg-blue-400 p-2">Post</button>
          </form>
        </center>
      </div>
    </div>
  )
}

export default Post