import Aboutimg from '../../assets/aboutImg.png';
import { Link } from 'react-router-dom';

function About() {
    return (
        <div name='about' className="text-center">
            <h1 className="grayclr font-bold text-5xl pt-12 pb-24">About</h1>

            <div className="flex lg:flex-row items-center flex-col md:justify-center">
                <img className=" w-[50vw] md:w-[50vw] lg:w-[40vw] lg:pl-12 lg:ml-8" src={Aboutimg} alt="About" />

                <div className=" flex flex-col items-center lg:text-left  w-full ">
                    <p className="pt-10 w-[60vw] lg:w-[40vw] text-center text-xl leading-relaxed poppins font-light ">
                        Focus, your ultimate online platform for photographers. Showcase your creativity, connect with peers, and elevate your craft. Upload your best shots and collaborate seamlessly. Whether you're a beginner or a pro, Click Sphere is your go-to destination for all things in photography.
                    </p>
                    <p className="poppins font text-xl  mt-6">Capture. Connect. Collaborate.</p>
                    <Link to='/signup'><button className='login px-10 py-5 mt-10 font-bold text-xl rounded text-white bg-E49600'>Join now</button></Link>
                </div>
            </div>
        </div>
    );
}

export default About;
