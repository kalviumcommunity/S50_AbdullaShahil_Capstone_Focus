import { useForm } from "react-hook-form";
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Cookies from 'js-cookie';
import { getId } from "../Utils/ApiUtils";
import SetupProfile from "./Account Components/SetupProfile";
import showPass from '../../assets/showpass.png';
import hidePass from '../../assets/hidepass.png';
import Loader from "../Utils/Loaders";
import { DeletePopup } from "../Utils/Popups";

function Account() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const formRef = useRef();
  const navigate = useNavigate();

  const [userData, setUserData] = useState({});
  const [id, setId] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState(null);
  const [profileID, setProfileID] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false); 

  useEffect(() => {
    const fetchProfileID = async () => {
      const profileId = await getId('profileID');
      setProfileID(profileId);

      const userId = await getId('userID');
      setId(userId);
    };

    fetchProfileID();
  }, []);

  useEffect(() => {
    if (profileID) {
      setLoading(true); 
      axios.get(`https://s50-abdullashahil-capstone-focus.onrender.com/users/profile/${profileID}`, { withCredentials: true })
        .then(response => {
          setUserData(response.data);
        })
        .catch(err => {
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [profileID]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = (data) => {
    const { password, newPassword } = data;

    setLoading(true); 

    axios.put(`https://s50-abdullashahil-capstone-focus.onrender.com/users/password/change/${id}`, { password, newPassword })
      .then(response => {
        // const token = response.data.token;
        // Cookies.set('token', token, { expires: 7 });
        setPasswordStatus('success');
        formRef.current.reset();
      })
      .catch(error => {
        console.error(error);
        setPasswordStatus('failure');
      })
      .finally(() => {
        setLoading(false); 
      });
  };

  const handleDelete = () => {
    setShowDeletePopup(true); 
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      await axios.delete(`https://s50-abdullashahil-capstone-focus.onrender.com/users/delete/${id}`, { withCredentials: true });
      Cookies.remove('token'); 
      console.log("success")
      navigate("/");
    } catch (error) {
      console.error('Failed to delete account', error);
    } finally {
      setLoading(false);
      setShowDeletePopup(false);
    }
  };

  const handleNoClick = () => {
    setShowDeletePopup(false); 
  };

  return (
    <div className="col-span-8 overflow-hidden rounded-xl sm:bg-gray-50 sm:px-8 sm:shadow">
      <div className="pt-4 flex justify-between">
        <h1 className="py-2 text-2xl font-semibold">Account settings</h1>
        {loading && <Loader />}
      </div>

      {showDeletePopup && (
        <DeletePopup
          handleDelete={handleDeleteAccount}
          handleNoClick={handleNoClick}
        />
      )}

      <hr className="mt-4 mb-8" />

      <center>
        <SetupProfile setLoading={setLoading} />
      </center>

      <p className="py-2 text-xl font-semibold">Email Address</p>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <p className="text-gray-800">Your email address is <strong className="textgray">{userData.email}</strong></p>
      </div>

      <hr className="mt-4 mb-8" />
      <div className="flex justify-between">
        <p className="py-2 text-xl font-semibold">Password</p>
        {loading && <Loader />}
      </div>

      {passwordStatus === 'success' && (
        <div className="pop p-2 bg-green-500 text-white rounded mb-5">
          <p className="registered-heading text-sm">Password changed successfully</p>
        </div>
      )}

      {passwordStatus === 'failure' && (
        <div className="pop p-2 bg-red-500 text-white rounded mb-5">
          <p className="registered-heading text-sm">Failed</p>
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center">
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
            <label htmlFor="password">
              <span className="text-sm text-gray-500">Current Password</span>
              <div className="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-600">
                <input
                  className="form-input w-full flex-shrink appearance-none border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
                  placeholder="***********"
                  {...register('password', {
                    required: 'This Field is required',
                    minLength: { value: 10, message: 'Minimum 10 characters are required' },
                    maxLength: { value: 25, message: 'Maximum length is 25 characters' },
                    pattern: {
                      value: /^(?=.*[!@#$%^&*])/,
                      message: 'Password must contain at least one special character',
                    }
                  })}
                  type={showPassword ? "text" : "password"}
                />
                {errors.password && <span className="error-span text-red-500 text-sm">{errors.password.message}</span>}
              </div>
            </label>
            <label htmlFor="newPassword">
              <span className="text-sm text-gray-500">New Password</span>
              <div className="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-600">
                <input
                  className="form-input w-full flex-shrink appearance-none border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
                  placeholder="***********"
                  {...register('newPassword', {
                    required: 'This Field is required',
                    minLength: { value: 10, message: 'Minimum 10 characters are required' },
                    maxLength: { value: 25, message: 'Maximum length is 25 characters' },
                    pattern: {
                      value: /^(?=.*[!@#$%^&*])/,
                      message: 'Password must contain at least one special character',
                    }
                  })}
                  type={showPassword ? "text" : "password"}
                />
                {errors.newPassword && <span className="error-span text-red-500 text-sm">{errors.newPassword.message}</span>}
              </div>
            </label>
          </div>

          <img
            onClick={togglePasswordVisibility}
            src={showPassword ? showPass : hidePass}
            alt={showPassword ? "show" : "hide"}
            className="mt-5 ml-2 h-6 w-6 cursor-pointer opacity-60"
          />
        </div>
        <button
          className="mt-4 rounded-lg gradient1 px-4 py-2 text-white hover:opacity-90"
          disabled={loading}
          onClick={handleSubmit(onSubmit)} 
        >
          {loading ? 'Checking' : 'Change Password'}
        </button>
      </form>

      <hr className="mt-8 mb-8 border" />
      <p className="py-2 text-xl font-semibold">Permanent account deletion</p>

      <div className="mt-4 mb-2 w-1/2 p-2 bg-red-50 rounded-lg">
        <h1 className="text-red-600 text-sm">Note: This process is irreversible.</h1>
      </div>
      <button onClick={handleDelete} className="py-3 p-5 rounded-lg text-md text-white font-semibold mb-6 bg-red-600 hover:opacity-90">
        Delete Account
      </button>
    </div>
  );
}

export default Account;
