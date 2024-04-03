import React from 'react';
import Header from './LandingComponents/Header';
import WhyFocus from './LandingComponents/WhyFocus';
import UserReviews from './LandingComponents/UserReviews';
import About from './LandingComponents/About';
import Footer from './LandingComponents/Footer';

function Landing() {


    return (
        <div>
            <Header/>
            <WhyFocus />
            <UserReviews />
            <About />
            <Footer />
        </div>
    )
}

export default Landing;
