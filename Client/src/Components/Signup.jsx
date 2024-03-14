import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate, Link } from 'react-router-dom';
import bg from '../assets/blurleaf-bg.png'
import WhiteLogo from '../assets/focus-white.png'


function Signup() {

    const { register, handleSubmit, formState: { errors }, watch } = useForm();

    return (
        <div className="h-screen w-screen bg flex justify-center items-center" style={{ backgroundImage: `url(${bg})` }}>
            <div className=" h-screen w-1/2  flex justify-center items-center">
                <img className='logo h-16 pl-10' src={WhiteLogo} alt="" />

            </div>

            <div className="h-screen w-1/2 form-main  flex flex-col justify-center items-center ">

                <center>
                    <h1 className="register-head mb-5 text-3xl font-bold text-white">Create an Account</h1>
                    <form className=" w-[35vw] text-left rounded-lg bg-white p-8">

                        <button className="gsi-material-button mb-5">
                            <div className="gsi-material-button-state"></div>
                            <div className="gsi-material-button-content-wrapper">
                                <div className="gsi-material-button-icon">
                                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" xmlnsXlink="http://www.w3.org/1999/xlink" className="block">
                                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                                        <path fill="none" d="M0 0h48v48H0z"></path>
                                    </svg>
                                </div>
                                <span className="gsi-material-button-contents mb">Sign up with Google</span>
                                <span className="hidden mb">Sign up with Google</span>
                            </div>
                        </button>
                        
                        <br />

                        <center>
                            <h2 className="text-gray-400">Or</h2>
                            </center>
                            
                        <label className="text-gray-600" htmlFor="username">User name</label>
                        <br />
                        <input className="form-input  mb-5 border-b py-2 px-2 w-full md:w-96" {...register('username', {
                            required: 'This Field is required',
                            minLength: { value: 5, message: 'Minimum 5 characters are required' },
                            maxLength: { value: 10, message: 'Maximum length is 10 characters' }
                        })} />
                        <br />
                        {errors.username && <span className="error-span">{errors.username.message}</span>}

                        <label className="text-gray-600" htmlFor="email">Email</label>
                        <br />

                        <input className="form-input mb-5 py-2 px-2 border-b w-full md:w-96 focus:outline-none " {...register('email', {
                            required: 'This Field is required',
                            pattern: { value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: 'Invalid email' },
                            minLength: { value: 4, message: 'Minimum 4 characters are required' },
                            maxLength: { value: 30, message: 'Maximum length is 20 characters' }
                        })} />
                        <br />
                        {errors.email && <span className="error-span">{errors.email.message}</span>}

                        <label className="text-gray-600" htmlFor="password">New Password</label>
                        <br />

                        <input className="form-input mb-5 py-2 px-2 border-b w-full md:w-96" {...register('password', {
                            required: 'This Field is required',
                            minLength: { value: 10, message: 'Minimum 10 characters are required' },
                            maxLength: { value: 20, message: 'Maximum length is 20 characters' },
                            pattern: {
                                value: /^(?=.*[!@#$%^&*])/,
                                message: 'Password must contain at least one special character',
                            }
                        })} />
                        <br />
                        {errors.password && <span className="error-span">{errors.password.message}</span>}

                        <label className="text-gray-600" htmlFor="repeat-password">Confirm Password</label>
                        <br />

                        <input
                            className="form-input border-b py-2 px-2 w-full md:w-96"
                            {...register('repeatPassword', {
                                required: 'This Field is required',
                                validate: value => value === checkPassword || 'Your Passwords do not match',
                            })}
                            type="password"
                            id="repeatPassword"
                        />
                        <br />
                        {errors.repeatPassword && <span className="error-span">{errors.repeatPassword.message}</span>}

                        <label className="terms" htmlFor="terms">
                            <br />

                            <input
                                type="checkbox"
                                id="terms"
                                {...register('terms', { required: 'You must accept the terms and conditions' })}
                            />
                            &nbsp;&nbsp;Accept <span className="  underline">Terms and Conditions</span>
                        </label>
                        <br />
                        {errors.terms && <span className="error-terms" >{errors.terms.message}</span>}

                        <br />
                        <button className='login px-8 py-4 mt-2 font-bold text-lg rounded text-white bg-E49600'>Signup</button>

                    </form>
                </center>
            </div>
        </div>
    )
}

export default Signup;
