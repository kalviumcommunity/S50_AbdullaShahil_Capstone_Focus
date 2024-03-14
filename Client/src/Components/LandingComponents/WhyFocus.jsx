import chatimg from '../../assets/chat.png'
import networkimg from '../../assets/global-network.png'
import postimg from '../../assets/picture.png'
import chatBg from '../../assets/chatbg.jpeg'
import networkBg from '../../assets/networkbg.jpeg'
import postBg from '../../assets/postbg.jpeg'

function WhyFocus() {
  return (
    <div className=" p-10 pt-12 pb-12">

    <center>
    <h1 className='grayclr font-bold text-5xl pt-10 pb-10'>Why join Focus?</h1>

    <div className=" w-[80vw] p-5 mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="border rounded-lg h-[35vh] join-focus overflow-hidden"  style={{ backgroundImage: `url(${networkBg})` }}>
            <center className='h-full bgblur p-5'>
                <img className='w-1/5 pt-5 ' src={networkimg} alt="" />
                <p className='text-white mt-10 font-light poppins'>
                Join a growing community of photographers to share, collaborate, and inspire each other.
                </p>
            </center>
        </div>
        
        <div className="border rounded-lg h-[35vh] join-focus overflow-hidden"  style={{ backgroundImage: `url(${postBg})` }}>
            <center className='h-full bgblur p-5'>
                <img className='w-1/5 pt-5' src={postimg} alt="" />
                <p className='text-white mt-10 font-light poppins'>Explore diverse photography styles, engage in challenges, and share your work to build your portfolio and showcase your talent.

                </p>
            </center>
        </div>

        <div className="border rounded-lg h-[35vh] join-focus overflow-hidden"  style={{ backgroundImage: `url(${chatBg})` }}>
            <center className='h-full bgblur p-5'>
                <img className='w-1/5 pt-5' src={chatimg} alt="" />
               <p className='text-white mt-10 font-light poppins'>
               "Impressive concept, seamless user experience. Perfect for photographers at any skill level to grow and connect."               </p>
            </center>
        </div>
    </div>
    </center>


    </div>
  )
}

export default WhyFocus