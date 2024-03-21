import ProfileIMG2 from '../../assets/review2.jpeg'

function Profile() {
    return (
        <div>

            <div className="gradient2 px-11 py-8 border border-100 w-[20vw] rounded-full shadow-[0px_0px_10px_rgba(0,0,0,0.08)]">
                <div className="flex flex-col w-[26%] max-md:ml-0 max-md:w-full">
                    <img src={ProfileIMG2} alt="Profile Image" />
                </div> 
                </div>


        </div>
    )
}

export default Profile