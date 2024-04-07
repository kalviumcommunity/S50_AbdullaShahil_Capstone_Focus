import { Link, useNavigate } from 'react-router-dom';

function Navigation() {
const navigate = useNavigate()

  const toSettings = () => {
    navigate("/settings")
  }
    return (
        <div className="w-fit pl-10 pr-5 pt-10 ">

            <div className="flex  items-center pl-1">
                <div className="add-btn gradient1 flex justify-center items-center bg-green-500 w-16 h-16 rounded-full">
                <Link to='/post'><button
                        className="plus pb-1 text-white text-4xl cursor-pointer outline-none hover:rotate-90 duration-300"
                        title="Add New"
                    >+</button></Link>
                </div>
                <h1 className="textgray pl-4 text-lg poppins">Create a Post</h1>
            </div>

            <div className="category-panel gradient2 mt-10 lg:w-[20vw] border border-grey shadow-md p-8 rounded-lg">
            <ul className='cm-panel category-list  text-left '>
              <li className='rounded'><button className='text-md py-2 pr-[7.2rem] text-white poppins px-4 transition text-left  mb-2 hover:bg-black rounded'>Home</button></li>
              <li className='rounded'><button className='text-md py-2 pr-[2.5rem] px-4 text-white poppins transition text-left  mb-2 hover:bg-black rounded'>Lens Hub</button></li>
              <li className='rounded'><button className='text-md py-2 text-white poppins px-4 transition text-left  mb-2 hover:bg-black rounded'>Chats</button></li>
              <li className='rounded'><button className='text-md py-2 text-white poppins px-4 transition text-left  hover:bg-black rounded' onClick={toSettings}>Account Settings</button></li>
            </ul>
          </div>


          <div className="category-panel gradient1 mt-10 lg:w-[20vw] border border-grey shadow-md p-8 rounded-lg">
            <ul className='cm-panel category-list  text-left '>
              <li className='rounded'><button className='text-md py-2 pr-[7.2rem] text-white poppins px-4 transition text-left  mb-2 hover:bg-black rounded'>Portraits</button></li>
              <li className='rounded'><button className='text-md py-2 pr-[2.5rem] px-4 text-white poppins transition text-left  mb-2 hover:bg-black rounded'>Architecture</button></li>
              <li className='rounded'><button className='text-md py-2 text-white poppins px-4 transition text-left  hover:bg-black rounded'>Black and White</button></li>
            </ul>
          </div>


        </div>

    )
}

export default Navigation