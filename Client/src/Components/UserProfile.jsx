import { useState } from 'react';
import { useForm } from "react-hook-form";
import Header from "./Home Components/Header";
import Posts from "./UserProfile Components/Posts";

import prof from '../assets/reviewProfile.jpeg';

function UserProfile() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [activeButton, setActiveButton] = useState('One');

    const handleClick = (button) => {
        setActiveButton(button);
    };

    return (
        <div>
            <Header />

            <div className='flex items-center justify-center mt-10'>
                <center className=" flex items-center   ">

                    <div className="mr-[6rem]">
                        <img className='h-[22vh] w-[22vh] rounded-full overflow-hidden' src={prof} alt="" />
                        <h1 className="pt-7 textgray text-2xl poppins">Tommy-meg</h1>
                    </div>

                    <form className="posts border-gray-300 rounded-md flex flex-col justify-between  p-5 lg:w-[45vw]" >
                        <label className='text-left textgray mb-1 ' htmlFor="title">Name</label>
                        <input className="form-input bg-gray-100 p-3 rounded border" {...register('title', {
                            required: 'This Field is required',
                            minLength: { value: 5, message: 'Minimum 5 characters are required' },
                            maxLength: { value: 20, message: 'Maximum length is 20 characters' }
                        })} placeholder="Name" id="title" />
                        <br />
                        {errors.title && <span className=" text-left text-red-500">{errors.title.message}</span>}
                        <label className='text-left textgray mb-1 ' htmlFor="description">Email</label>
                        <input className="form-input bg-gray-100 p-3 rounded border" {...register('description', {
                            required: 'This Field is required',
                            minLength: { value: 3, message: 'Minimum 3 characters are required' },
                        })} placeholder="Email " id="description" />
                        <br />
                        {errors.description && <span className="text-left text-red-500">{errors.description.message}</span>}

                        <div className=' w-full flex justify-between'>
                            <button className="submit-btn rounded text-white gradient2 font-bold p-2 h-[7vh] w-[13.5vw] ">Edit</button>
                            <button className="submit-btn rounded text-white font-bold p-2 gradient1 h-[7vh] w-[13.5vw] ">Change password</button>
                            <button className="submit-btn rounded text-white bg-red-600 font-bold p-2 h-[7vh] w-[13.5vw] ">Delete Account</button>
                        </div>
                    </form>
                </center>
            </div>

            <hr className="mt-10 bg-black " />

            <div className="flex justify-center mt-12">
                <button className={`bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-l ${activeButton === 'One' ? 'gradient2' : ''
                    }`}
                    onClick={() => handleClick('One')}>Posts</button>
                <button className={`bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-r ${activeButton === 'Two' ? 'gradient2' : ''
                    }`}
                    onClick={() => handleClick('Two')}>Articles</button>
            </div>

            {activeButton === 'One' && <Posts />}
        </div >
    )
}

export default UserProfile;
