import { useForm } from "react-hook-form";
import { useState, useEffect, useRef } from 'react'; 
import axios from "axios";
import Cookies from 'js-cookie';

import showPass from '../../assets/showpass.png';
import hidePass from '../../assets/hidepass.png';

function Account() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const formRef = useRef();
  const [userData, setUserData] = useState({});
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [id, setId] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState(null);
  const token = Cookies.get("token");

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
    
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
    
  const onSubmit = (data) => {
    const { password, newPassword } = data;
    console.log(password, newPassword)

    setLoading(true);

    axios.put(`http://localhost:4000/users/change/${id}`, { password, newPassword })
      .then(response => {
        console.log(response)
        const token = response.data.token;
        Cookies.set('token', token, { expires: 7 });
        setLoading(false);
        setPasswordStatus('success'); 
        formRef.current.reset(); // Reset the form
      })
      .catch(error => {
        console.error(error)
        console.log(error.response.data);
        setLoading(false);
        setPasswordStatus('failure');
      });
  };

  return (
    <div className="col-span-8 overflow-hidden rounded-xl sm:bg-gray-50 sm:px-8 sm:shadow">
      <div className="pt-4">
        <h1 className="py-2 text-2xl font-semibold">Account settings</h1>
      </div>

      <hr className="mt-4 mb-8" />

      <p className="py-2 text-xl font-semibold">Email Address</p>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <p className="text-gray-600">Your email address is <strong>{email}</strong></p>
        <button className="inline-flex text-sm font-semibold text-blue-600 underline decoration-2">Change</button>
      </div>

      <hr className="mt-4 mb-8" />
      <p className="py-2 text-xl font-semibold">Password</p>

      {passwordStatus === 'success' && (
        <div className="pop p-2 bg-green-500 text-white rounded mb-5"><p className="registered-heading text-sm">Password changed successfully</p></div>
      )}

      {passwordStatus === 'failure' && (
        <div className="pop p-2 bg-red-500 text-white  rounded mb-5"><p className="registered-heading text-sm">Failed</p></div>
      )}

      <form ref={formRef}> {/* Add ref to the form */}
        <div className="flex items-center">
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
            <label htmlFor="password">
              <span className="text-sm text-gray-500">Current Password</span>
              <div className="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-600">
                <input className="form-input w-full flex-shrink appearance-none border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none" placeholder="***********" {...register('password', {
                  required: 'This Field is required',
                  minLength: { value: 10, message: 'Minimum 10 characters are required' },
                  maxLength: { value: 25, message: 'Maximum length is 25 characters' },
                  pattern: {
                    value: /^(?=.*[!@#$%^&*])/,
                    message: 'Password must contain at least one special character',
                  }
                })} type={showPassword ? "text" : "password"} />
                <br />
                {errors.password && <span className="error-span text-red-500 text-sm">{errors.password.message}</span>}
              </div>
            </label>
            <label htmlFor="newPassword">
              <span className="text-sm text-gray-500">New Password</span>
              <div className="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-600">
                <input className="form-input w-full flex-shrink appearance-none border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none" placeholder="***********" {...register('newPassword', {
                  required: 'This Field is required',
                  minLength: { value: 10, message: 'Minimum 10 characters are required' },
                  maxLength: { value: 25, message: 'Maximum length is 25 characters' },
                  pattern: {
                    value: /^(?=.*[!@#$%^&*])/,
                    message: 'Password must contain at least one special character',
                  }
                })} type={showPassword ? "text" : "password"} />
                <br />
                {errors.newPassword && <span className="error-span text-red-500 text-sm">{errors.newPassword.message}</span>}
              </div>
            </label>
          </div>

          {showPassword ? (
            <img onClick={togglePasswordVisibility} src={showPass} alt="show" className="mt-5 ml-2 h-6 w-6 cursor-pointer opacity-60 " />
          ) : (
            <img onClick={togglePasswordVisibility} src={hidePass} alt="hide" className="mt-5 ml-2 h-6 w-6 cursor-pointer opacity-60 " />
          )}
        </div>
        <button className="mt-4 rounded-lg gradient1 px-4 py-2 text-white" onClick={handleSubmit(onSubmit)} disabled={loading}>
          {loading ? 'Changing...' : 'Change Password'}
        </button>
      </form>
      <hr className="mt-4 mb-8" />
      <div className="mb-10">
        <p className="py-2 text-xl font-semibold">Delete Account</p>
      </div>
    </div>
  );
}

export default Account;
