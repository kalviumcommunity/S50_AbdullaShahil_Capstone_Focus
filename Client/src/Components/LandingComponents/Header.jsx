import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import WhiteLogo from '../../assets/focus-white.png';
import bg from '../../assets/leaf-bg.jpeg';
import { Link as ScrollLink } from 'react-scroll';

function Header() {
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        return () => {
            setShowMenu(false);
        };
    }, []);

    return (
        <div className="head h-screen w-screen flex flex-col justify-between " style={{ backgroundImage: `url(${bg})` }}>
            <nav className="nav h-20 pt-10 flex justify-between items-center">
                <img className='logo h-14 pl-14 lg:h-10 lg:pl-10 ' src={WhiteLogo} alt="" />

                <div className='hamburgdiv flex flex-col'>
                    <label className="burger mr-5 z-10  lg:hidden" htmlFor="burger">
                        <input type="checkbox" id="burger" checked={showMenu} onChange={() => setShowMenu(!showMenu)} />
                        <span className='bg-white'></span>
                        <span className='bg-white'></span>
                        <span className='bg-white'></span>
                    </label>


                    <div className={`nav-link ${showMenu ? 'flex' : 'hidden'} nav-links flex-col w-[60vw] justify-normal md:w-[40vw] lg:w-[40vw]  lg:flex lg:flex-row  lg:justify-around items-center`}>
                        <ScrollLink onClick={() => setShowMenu(false)} className="mt-[7rem] mb-4 lg:mt-0 text-white hover:text-gray-300 cursor-pointer" to='reviews' smooth duration={1000}>Reviews</ScrollLink>
                        <ScrollLink onClick={() => setShowMenu(false)} className="mt-2 mb-4 lg:mt-0 text-white hover:text-gray-300 cursor-pointer" to='about' smooth duration={850}>About</ScrollLink>

                        <Link onClick={() => setShowMenu(false)} to='/login'><button className='login navlogin border py-4 px-12 lg:px-10  lg:py-5 rounded text-white '>Log in</button></Link>
                    </div>
                </div>
            </nav>

            <div className='pl-10 pb-20 mb-10'>
                <h1 className='landing-title text-white font-bold text-6xl md:text-7xl lg:text-8xl'>Build Your <span className='E49600 font-bold'>Lens</span> <br />Community.</h1>
                <h1 className='landing-slogan text-white  font-extralight mt-6 text-2xl md:text-3xl lg:text-3xl'>Capture. Connect. Collaborate.</h1>
                <Link to='/signup'><button className='login px-10 py-5 mt-10 font-bold text-xl rounded text-white bg-E49600'>Join now</button></Link>
            </div>
        </div>
    )
}

export default Header;
