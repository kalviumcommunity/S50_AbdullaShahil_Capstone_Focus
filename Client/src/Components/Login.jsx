import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import bg from '../assets/blurleaf-bg.png'
import WhiteLogo from '../assets/focus-white.png'
import Cookies from 'js-cookie';
import axios from 'axios';


function Login() {

    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [signupStatus, setSignupStatus] = useState(null);

    const toLogin = (event) => {
        event.preventDefault(); 
        window.location.href = 'http://localhost:4000/auth/google';
    }
    
    useEffect(() => {
        const fetchData = async () => {
            const token = Cookies.get("token")? Cookies.get("token") : localStorage.getItem('token');
            if (token) {
            try {
              await axios.post(
                "http://localhost:4000/users/tokenvalidate", { token });
              navigate("/home");
            } catch (error) {
              console.error("Error in post request", error.response.data.error);
            }
          }
        };
    
        fetchData();
      },[]);

    const onSubmit = (data) => {
        const { email, password } = data;
        axios.post('http://localhost:4000/users/login', { email, password }, {withCredentials: true})
            .then(response => {
                const { email, name, token, userID, profileID } = response.data;
                localStorage.setItem('token', token);
                Cookies.set('name', name, { httpOnly: false, secure: false });
                Cookies.set('userID', userID, { httpOnly: false, secure: false });
                Cookies.set('profileID', profileID, { httpOnly: false, secure: false });
                setSignupStatus('success');

                setTimeout(() => {
                    navigate('/home');
                }, 200);
            })
            .catch(error => {
                console.log(error)
                setSignupStatus('failure');
                console.log(error.response.data.error);
            });
    };



    return (
        <div className="h-screen w-screen bg flex justify-center items-center" style={{ backgroundImage: `url(${bg})` }}>
            <div className=" hidden  h-screen w-1/2  lg:flex justify-center items-center">
                <img className='logo h-16 pl-10' src={WhiteLogo} alt="" />


            </div>

            <div className="h-screen w-full lg:w-1/2 form-main flex lg:flex-col justify-center items-center ">

                <center>
                    <h1 className="register-head mb-5 text-3xl font-bold text-white">Login to your Account</h1>
                    <form className=" w-[85vw] md:w-[70vw] lg:w-[35vw] text-left rounded-lg bg-white p-8" onSubmit={handleSubmit(onSubmit)}>

                        {signupStatus === 'success' && (
                            <div className="pop p-2 bg-green-500 text-white rounded mb-5"><p className="registered-heading text-sm">Logged in successfully</p></div>
                        )}

                        {signupStatus === 'failure' && (
                            <div className="pop p-2 bg-red-500 text-white  rounded mb-5"><p className="registered-heading text-sm">Login failed</p></div>
                        )}

                        <center>
                            <button className="gsi-material-button mb-5"  onClick={(event) => toLogin(event)}>
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
                                    <span className="gsi-material-button-contents mb">Continue with Google</span>
                                </div>
                            </button>
                            <br />

                            <h2 className="text-gray-400">Or</h2>
                        </center>

                        <label className="text-gray-600" htmlFor="email">Email</label>
                        <br />

                        <input
                            className="form-input mb-2 py-2 px-2 border-b w-full focus:outline-none"
                            {...register('email', {
                                required: 'This Field is required',
                                pattern: { value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: 'Invalid email' },
                                minLength: { value: 4, message: 'Minimum 4 characters are required' },
                                maxLength: { value: 25, message: 'Maximum length is 25 characters' }
                            })}
                            type="email"
                            id="email"
                            autoComplete="email"
                        />

                        <br />
                        {errors.email && <span className="error-span text-red-500 text-sm">{errors.email.message}</span>}

                        <br />
                        <label className="text-gray-600" htmlFor="password">Password</label>

                        <input className="form-input mb-2 py-2 px-2 border-b w-full" {...register('password', {
                            required: 'This Field is required',
                            minLength: { value: 10, message: 'Minimum 10 characters are required' },
                            maxLength: { value: 25, message: 'Maximum length is 25 characters' },
                            pattern: {
                                value: /^(?=.*[!@#$%^&*])/,
                                message: 'Password must contain at least one special character',
                            }
                        })} type="password" autoComplete="current-password" />
                        <br />
                        {errors.password && <span className="error-span text-red-500 text-sm">{errors.password.message}</span>}

                        <br />
                        <button className='login px-8 py-4 mt-4 font-bold text-lg  rounded text-white bg-E49600 hover:bg-gray-600 hover:'>Log in</button>

                    </form>
                </center>
            </div>
        </div>
    )
}

export default Login;
