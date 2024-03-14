import bg from '../../assets/reviewBG.jpeg'
import ProfileIMG from '../../assets/reviewProfile.jpeg'
import ProfileIMG2 from '../../assets/review2.jpeg'
import ProfileIMG3 from '../../assets/review3.jpeg'

function UserReviews() {
    return (
        <div className="p-10 pt-10 ">

            <div className='bg ' style={{ backgroundImage: `url(${bg})` }}>

                <center className='h-full bgblur p-10'>
                    <h1 className='text-white font-bold text-5xl pt-10 pb-10 text-shadow'>Recent Reviews</h1>

                    <div className='pt-5 mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14'>

                        <div className='bg-white  pb-20 p-10 text-left li rounded '>
                            <div className='flex items-center'>
                                <img className='h-16 w-16 rounded-full overflow-hidden' src={ProfileIMG2} alt="" />
                                <h2 className='poppins grayclr font-medium pl-5 text-lg'>Abhishek</h2>
                            </div>

                            <p className='pt-10 leading-relaxed font-light text-left'>
                                "This website nails both concept and user experience. It's a hub for photographers to learn, connect, and showcase their work."
                            </p>
                        </div>

                        <div className='bg-white   pb-20 p-10 text-left li rounded '>
                            <div className='flex items-center'>
                                <img className='h-16 w-16 rounded-full overflow-hidden' src={ProfileIMG} alt="" />
                                <h2 className='poppins grayclr font-medium pl-5 text-lg'>Shabs</h2>
                            </div>

                            <p className='pt-10 leading-relaxed font-light text-left'>
                                "Seamlessly blending concept and user interface, this website is a haven for photographers to explore, learn, and engage."                            </p>
                        </div>

                        <div className='bg-white  pb-20 p-10 text-left li rounded '>
                            <div className='flex items-center'>
                                <img className='h-16 w-16 rounded-full overflow-hidden' src={ProfileIMG3} alt="" />
                                <h2 className='poppins grayclr font-medium pl-5 text-lg'>Adithyan</h2>
                            </div>

                            <p className='pt-10 leading-relaxed font-light text-left'>
                                "Impressive concept, seamless user experience. Perfect for photographers at any skill level to grow and connect."                            </p>
                        </div>


                    </div>
                </center>


            </div>

        </div>
    )
}

export default UserReviews