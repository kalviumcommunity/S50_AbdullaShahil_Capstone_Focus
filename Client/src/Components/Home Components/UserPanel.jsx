import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import ProfileIMG2 from '../../assets/review2.jpeg'
import ProfileIMG3 from '../../assets/review3.jpeg'
import Cookies from 'js-cookie';

function UserPanel() {
    const username = Cookies.get("name").replace(/\"/g, '');
    const [isLogoutPopupOpen, setIsLogoutPopupOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        axios.get('http://localhost:4000/logout', {
            withCredentials: true
        })
            .then(response => {
                if (response.status === 200) {
                    console.log('Logged out successfully');
                } else {
                    console.error('Logout failed');
                }
            })
            .catch(error => {
                console.error('Error during logout:', error);
            });

        Cookies.remove('userData');
        Cookies.remove('email');
        Cookies.remove('name');
        Cookies.remove('token');
        Cookies.remove('data');
        navigate('/');
        setIsLogoutPopupOpen(false);
    }

    const handleNoClick = () => {
        setIsLogoutPopupOpen(false);
    };


    return (
        <div className='pl-5 pr-5 pt-10'>

            <div className="gradient2 p-2 pl-3 flex items-center justify-between border w-[18vw] h-[10vh] rounded-full shadow-[0px_0px_10px_rgba(0,0,0,0.08)] overflow-hidden">
                <div className='flex items-center'>
                    <img className='h-16 w-16 rounded-full overflow-hidden' src={ProfileIMG2} alt="" />
                    <Link to='/profile'>
                    <h3 className='post-username pl-4  poppins text-white'>{username}</h3>
                    </Link>
                </div>

                <div className="toggle-switch mr-5">
                    <input onClick={() => setIsLogoutPopupOpen(prevState => !prevState)} checked={isLogoutPopupOpen} className="toggle-input" id="toggle" type="checkbox" />
                    <label className="toggle-label" htmlFor="toggle"></label>
                </div>

            </div>

            {isLogoutPopupOpen && (
                <div>
                    <div className="overlay"></div>
                    <div className="border logout-popup p-5 rounded flex flex-col justify-around ">
                        <h2>Are you sure you want to logout?</h2>
                        <div>
                            <button onClick={handleLogout} className='py-3 px-5 mr-5 rounded bg-red-500 text-white font-bold hover:bg-red-400'>Yes</button>
                            <button onClick={handleNoClick} className='py-3 px-5 ml-5 border rounded  text-black font-bold'>No</button>
                        </div>
                    </div>
                </div>
            )}

            <center className='pt-12'>
                <h1 className='suggestion-title mb-6'>Other users</h1>
            </center>

            <div className='border border-gray-400 suggestion-scroll h-[42vh] overflow-scroll p-2 shadow-[0px_0px_10px_rgba(0,0,0,0.08)] rounded-lg  '>
                <div className=" cm-panel profile-panel bg-white rounded-md flex items-center p-5  h-20">
                    <div className="profile-img w-14 h-14 rounded-full flex justify-center items-center overflow-hidden">
                        <img src={ProfileIMG3} alt="Img" />
                    </div>
                    <h1 className='profile-name p-4'>Bilson</h1>

                </div>

                <div className=" cm-panel profile-panel bg-white rounded-md flex items-center p-5  h-20">
                    <div className="profile-img w-14 h-14 rounded-full flex justify-center items-center overflow-hidden">
                        <img src={ProfileIMG3} alt="Img" />
                    </div>
                    <h1 className='profile-name p-4'>Samirjangha</h1>

                </div>

                <div className=" cm-panel profile-panel bg-white rounded-md flex items-center p-5  h-20">
                    <div className="profile-img w-14 h-14 rounded-full flex justify-center items-center overflow-hidden">
                        <img src={ProfileIMG3} alt="Img" />
                    </div>
                    <h1 className='profile-name p-4'>jack clicks</h1>

                </div>

                <div className=" cm-panel profile-panel bg-white rounded-md flex items-center p-5  h-20">
                    <div className="profile-img w-14 h-14 rounded-full flex justify-center items-center overflow-hidden">
                        <img src={ProfileIMG3} alt="Img" />
                    </div>
                    <h1 className='profile-name p-4'>himmayash</h1>

                </div>


                <div className=" cm-panel profile-panel bg-white rounded-md flex items-center p-5  h-20">
                    <div className="profile-img w-14 h-14 rounded-full flex justify-center items-center overflow-hidden">
                        <img src={ProfileIMG3} alt="Img" />
                    </div>
                    <h1 className='profile-name p-4'>himmayash</h1>

                </div>
            </div>


        </div>
    )
}

export default UserPanel