import { useState } from "react";
import bg from '../assets/blurleaf-bg.png';
import WhiteLogo from '../assets/focus-white.png';

import SignUpForm from "./Signup Components/SignUpForm";
import SetupProfile from "./Signup Components/SetupProfile";

function Signup() {
    const [signupStatus, setSignupStatus] = useState(null);

    const handleSignupSuccess = () => {
        setSignupStatus('success');
    };

    return (
        <div className="h-screen w-screen bg flex justify-center items-center" style={{ backgroundImage: `url(${bg})` }}>
            <div className="hidden h-screen w-1/2 lg:flex justify-center items-center">
                <img className='logo h-16' src={WhiteLogo} alt="" />
            </div>

            <div className="h-screen w-full lg:w-1/2 form-main flex lg:flex-col justify-center items-center">
                <center>
                    <h1 className="register-head mb-5 text-3xl font-bold text-white">{signupStatus === 'success' ? ("Setup your profile") : ("Create an Account")}</h1>
                    {signupStatus === 'success' ? (
                        <SignUpForm onSignupSuccess={handleSignupSuccess} />
                        ) : (
                        <SetupProfile />
                    )}
                </center>
            </div>
        </div>
    );
}

export default Signup;
