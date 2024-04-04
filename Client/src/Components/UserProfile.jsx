import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import Cookies from 'js-cookie';
import axios from 'axios';
import Header from "./Home Components/Header";
import Posts from "./UserProfile Components/Posts";
import prof from '../assets/reviewProfile.jpeg';

function UserProfile() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [activeButton, setActiveButton] = useState('One');
    const [userData, setUserData] = useState({});
    const [isEditable, setIsEditable] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [id, setId] = useState('');
    const [buttonText, setButtonText] = useState('Edit'); 
    const username = Cookies.get("name").replace(/\"/g, '');
    const token = Cookies.get("token");

    const handleClick = (button) => {
        setActiveButton(button);
    };

    useEffect(() => {
        axios.post(`http://localhost:4000/getUser`, { token }, { withCredentials: true })
            .then(response => {
                console.log(response);
                const userData = response.data.user;
                setUserData(userData);
                setName(userData.name);
                setEmail(userData.email);
                setId(userData._id);
            })
            .catch(err => {
                console.error(err);
            });
    }, []);

    const onSubmit = data => {
        const { name, email } = data;
        axios.put(`http://localhost:4000/users/${id}`, { name, email })
            .then(response => {
                console.log(response)
                setIsEditable(false);
                setButtonText('Edit');
                setIsSubmitted(true); 
                Cookies.set("name", name);
            })
            .catch(error => {
                console.error(error);
            });
    };
    

    const handleEdit = (e) => {
        e.preventDefault();
        console.log("Edit button clicked");
        
        if (!isEditable) {
            setIsEditable(true); 
            setButtonText('Save');
        } else {
            const isFormDataEdited = name !== userData.name || email !== userData.email;
            if (isFormDataEdited) {
                handleSubmit(onSubmit({ name, email })); 
            }
            setIsEditable(false); 
            setButtonText('Edit'); 
        }
    };
    
    

    
    
    

    return (
        <div>
            <Header />

            <div className='flex items-center justify-center mt-10'>
                <center className=" flex items-center   ">

                    <div className="mr-[6rem]">
                        <img className='h-[22vh] w-[22vh] rounded-full overflow-hidden' src={prof} alt="" />
                        <h1 className="pt-7 textgray text-2xl poppins">{username}</h1>
                    </div>

                    <form className="posts border-gray-300 rounded-md flex flex-col justify-between  p-5 lg:w-[45vw]">
                        <label className='text-left textgray mb-1 ' htmlFor="name">Name</label>
              
                            <input className="form-input bg-gray-100 p-3 rounded border" {...register('name', {
                                required: 'This Field is required',
                                minLength: { value: 5, message: 'Minimum 5 characters are required' },
                                maxLength: { value: 20, message: 'Maximum length is 20 characters' }
                            })} value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" id="name" disabled={!isEditable}/>

                        <br />
                        {/* {errors.name && <span className=" text-left text-red-500">{errors.name.message}</span>} */}
                        <label className='text-left textgray mb-1 ' htmlFor="email">Email</label>
                            <input className="form-input bg-gray-100 p-3 rounded border" {...register('email', {
                                required: 'This Field is required',
                                minLength: { value: 3, message: 'Minimum 3 characters are required' },
                            })} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email " id="email" disabled={!isEditable}/>

                        <br />
                        {/* {errors.email && <span className="text-left text-red-500">{errors.email.message}</span>} */}

                        <div className=' w-full flex justify-between'>
                        <button onClick={handleEdit} className="submit-btn rounded text-white gradient2 font-bold p-2 h-[7vh] w-[13.5vw] ">{buttonText}</button>
                            <button className="submit-btn rounded text-white font-bold p-2 gradient1 h-[7vh] w-[13.5vw] ">Change password</button>
                            <button className="submit-btn rounded text-white bg-red-600 font-bold p-2 h-[7vh] w-[13.5vw] ">Delete Account</button>
                        </div>
                    </form>
                </center>
            </div>

            <hr className="mt-10 bg-black " />

            <div className="bg-gray-100 pt-6">
                <div className="flex justify-center mt-9">
                    <button className={`bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-l ${activeButton === 'One' ? 'gradient2' : ''}`}
                        onClick={() => handleClick('One')}>Posts</button>
                    <button className={`bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-r ${activeButton === 'Two' ? 'gradient2' : ''}`}
                        onClick={() => handleClick('Two')}>Articles</button>
                </div>

                {activeButton === 'One' && <Posts />}
                {activeButton === 'Two' && (
                    <>
                        <center className='h-[25vh] mt-2 border flex justify-center items-center'>
                            <h1 className=' text-xl'>In progress...</h1>
                        </center>
                    </>
                )}
            </div>
        </div>
    )
}

export default UserProfile;
