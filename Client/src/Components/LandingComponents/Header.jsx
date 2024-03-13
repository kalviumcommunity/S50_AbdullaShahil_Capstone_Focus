import { Link } from 'react-router-dom';
import WhiteLogo from '../../assets/focus-white.png'
import bg from '../../assets/leaf-bg.jpeg'
function Header() {
  return (
        <div className="head h-screen w-screen flex flex-col justify-between" style={{ backgroundImage: `url(${bg})` }}>
                    <nav className="nav h-20 pt-10 flex justify-between items-center">
                        <img className='logo h-10 pl-10' src={WhiteLogo} alt="" />
                        <div className="nav-link  w-2/5 text-white flex justify-around items-center">
                            <Link>Contact</Link>
                            <Link>About</Link>
                            <Link to='/login'><button className='login border px-10 py-5 rounded'>Log in</button></Link>
                        </div>
                    </nav>

                    <div className='pl-10 pb-20 mb-10'>
                        <h1 className='landing-title text-white font-bold'>Build Your <span className='E49600 font-bold'>Lens</span> <br />Community.</h1>
                        <h1 className='landing-slogan text-white  font-extralight'>Capture. Connect. Collaborate.</h1>
                        <Link to='/signup'><button className='login px-10 py-5 mt-10 font-bold text-xl rounded text-white bg-E49600'>Join now</button></Link>
                    </div>
                </div>
  )
}

export default Header