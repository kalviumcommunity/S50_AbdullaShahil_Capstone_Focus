import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import WhiteLogo from '../../assets/focus-white.png';
import bg from '../../assets/beachBg.png';
import { Link as ScrollLink } from 'react-scroll';

function Header() {
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        return () => {
            setShowMenu(false);
        };
    }, []);

    return (
        <div className="head w-screen  " >
            <div className='flex flex-col justify-between bg' style={{ backgroundImage: `url(${bg})` }}>
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

                    </div>
                </div>
            </nav>

            <center className='p-8 '>
            <h1 className='hidden sm:block text-4xl poppins text-white font-semibold'>Feed</h1>
            </center>
            </div>


        </div>
    )
}

export default Header;
