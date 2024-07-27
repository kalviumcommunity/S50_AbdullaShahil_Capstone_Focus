import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import interestTags from './InterestTags';
import NoProfile from "../../assets/noprofile.png";
import Cookies from 'js-cookie';
import axios from 'axios';
import { MultiSelect } from 'primereact/multiselect';
import { v4 } from 'uuid';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ImageDB } from '../../firebase';

import { Toaster, toast } from 'sonner';

function SetupProfile() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const { interests } = interestTags;
    const [selectedInterests, setSelectedInterests] = useState([]);
    const [picture, setPicture] = useState(null); 
    const [pictureUrl, setPictureUrl] = useState(NoProfile);
    const [interestError, setInterestError] = useState('');

    const handleInterestChange = (e) => {
        if (e.value.length <= 5) {
            setSelectedInterests(e.value);
            setInterestError('');
            
        } else {
            toast.error("You can select a maximum of 5 interests.")
        }
    };

    const handleSkip = (e) => {
        e.preventDefault();
        navigate('/home');
    };

    // const profileID = Cookies.get('profileID');
    const profileID = '662887b3d0cab0df779b9bb3';

    const onSubmit = async (data) => {
        const { about } = data;

        let imageUrl = pictureUrl;
        if (picture) {
            const imageRef = ref(ImageDB, `ProfImg/${v4()}`);
            await uploadBytes(imageRef, picture);
            imageUrl = await getDownloadURL(imageRef);
        }

        const payload = {
            profile_img: imageUrl,
            about,
            interests: selectedInterests
        };

        console.log(payload);

        axios.patch(`http://localhost:4000/users/updateProfile/${profileID}`, payload)
            .then(response => {
                console.log(response);
                navigate('/home');
            })
            .catch(error => {
                console.log(error);
            });
    };

    const handleFileUpload = () => {
        document.getElementById('picture').click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setPicture(file);

        const reader = new FileReader();

        reader.onloadend = () => {
            setPictureUrl(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    return (
        <div>
            <Toaster position="top-center"  />

            <form className="w-[85vw] h-[75vh] md:w-[70vw] lg:w-[35vw] text-left rounded-lg bg-white p-8" onSubmit={handleSubmit(onSubmit)}>
                <div className="relative mx-auto w-48 text-center">
                    <div className="relative w-48 h-48">
                        <img className="w-48 h-48 rounded-full absolute" src={pictureUrl} alt="Profile" />
                        <div
                            className="w-48 h-48 group hover:bg-gray-200 opacity-60 rounded-full absolute flex justify-center items-center cursor-pointer transition duration-500"
                            onClick={handleFileUpload}
                        >
                            <img className="upload-icon hidden group-hover:block w-12" src="https://www.svgrepo.com/show/33565/upload.svg" alt="Upload Icon" />
                        </div>
                        <input
                            type="file"
                            id="picture"
                            className="hidden"
                            {...register('picture', {
                                required: 'This Field is required',
                            })}
                            onChange={handleFileChange} 
                        />
                    </div>
                </div>

                <br />
                <div className="card flex justify-content-center">
                    <MultiSelect
                        value={selectedInterests}
                        options={interests.map(interest => ({ label: interest, value: interest }))}
                        onChange={handleInterestChange}
                        placeholder="Select Interests"
                        display="chip"
                        className="w-full md:w-20rem border selection:border"
                    />
                </div>
                {interestError && <span className="error-span text-[1.5vh] text-red-500">{interestError}</span>}
                <br />
                {errors.interests && <span className="error-span text-[1.5vh] text-red-500">{errors.interests.message}</span>}

                <label className="text-gray-600" htmlFor="about">About</label>
                <br />
                <textarea
                    className="form-input w-full h-[150px] bg-gray-100 p-3 border-none focus:outline-none rounded border border-gray-400"
                    {...register('about', {
                        required: 'This Field is required',
                        minLength: { value: 3, message: 'Minimum 3 characters are required' },
                    })}
                    placeholder=""
                    id="about"
                    maxLength={200}
                    style={{ maxHeight: "160px" }}
                />
                <br />
                {errors.about && <span className="text-left text-red-500">{errors.about.message}</span>}

                <div className="flex justify-between items-center w-full">
                    <button
                        type="button"
                        className='w-1/2 px-9 py-4 mt-4 mr-1 font-bold text-lg rounded bg-gray-25 text-gray-600 border hover:bg-gray-100'
                        onClick={handleSkip}>
                        Skip
                    </button>
                    <button 
                        onClick={handleSubmit}
                        className='w-1/2 save-btn px-9 py-4 mt-4 ml-1 font-bold text-lg rounded text-white bg-E49600 transition'
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
}

export default SetupProfile;
