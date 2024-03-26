import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import WhiteLogo from '../../assets/focus-white.png';
import bg from '../../assets/beachBg.png';

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
            <nav className="nav h-[15vh] justify-between flex lg:justify-center items-center">
                <div className='hamburgdiv flex flex-col'>
                    <label className="burger ml-5 z-10  lg:hidden" htmlFor="burger">
                        <input type="checkbox" id="burger" checked={showMenu} onChange={() => setShowMenu(!showMenu)} />
                        <span className='bg-white'></span>
                        <span className='bg-white'></span>
                        <span className='bg-white'></span>
                    </label>


                    <div className={`nav-link ${showMenu ? 'flex' : 'hidden'} nav-links flex-col w-[60vw] justify-normal md:w-[40vw] lg:hidde items-center`}>
                        <Link onClick={() => setShowMenu(false)} className="mt-[7rem] mb-4 lg:mt-0 text-white hover:text-gray-300 cursor-pointer" to='reviews' smooth duration={1000}>Reviews</Link>
                        <Link onClick={() => setShowMenu(false)} className="mt-2 mb-4 lg:mt-0 text-white hover:text-gray-300 cursor-pointer" to='about' smooth duration={850}>About</Link>

                    </div>


                </div>
                <img className='logo h-14 pr-14 lg:h-10 lg:pl-10 ' src={WhiteLogo} alt="" />

            </nav>

            </div>


        </div>
    )
}

export default Header;
