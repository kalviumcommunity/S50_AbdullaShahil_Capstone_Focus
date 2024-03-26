import ProfileIMG2 from '../../assets/review2.jpeg'
import ProfileIMG3 from '../../assets/review3.jpeg'
import Cookies from 'js-cookie';

function Profile() {
    const username = Cookies.get("name");

    return (
        <div className='pl-5 pr-5 pt-10'>

            <div className="gradient2 p-2 pl-3 flex items-center border w-[18vw] h-[10vh] rounded-full shadow-[0px_0px_10px_rgba(0,0,0,0.08)]">
                <img className='h-16 w-16 rounded-full overflow-hidden' src={ProfileIMG2} alt="" />
                <h3 className='post-username pl-4  poppins text-white'>{username}</h3>

            </div>

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

export default Profile