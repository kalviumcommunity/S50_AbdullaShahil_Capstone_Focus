import Aboutimg from '../../assets/aboutImg.png';

function About() {
    return (
        <div className="text-center">
            <h1 className="grayclr font-bold text-5xl pt-12 pb-24">About</h1>

            <div className=" grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 ">
                <img className="w-full md:w-2/3 pl-12 ml-8" src={Aboutimg} alt="About" />

                <div className="text-left  w-full md:w-2/2 pr-12 mr-10">
                    <p className="pt-10 w-[40vw] text-xl leading-relaxed poppins font-light text-left">
                        Focus, your ultimate online platform for photographers. Showcase your creativity, connect with peers, and elevate your craft. Upload your best shots and collaborate seamlessly. Whether you're a beginner or a pro, Click Sphere is your go-to destination for all things in photography.
                    </p>
                    <p className="poppins font-light text-xl text-left mt-6">Capture. Connect. Collaborate.</p>
                    <button className="text-left login px-10 py-5 mt-10 font-bold text-xl rounded text-white bg-E49600">Join now</button>
                </div>
            </div>
        </div>
    );
}

export default About;
