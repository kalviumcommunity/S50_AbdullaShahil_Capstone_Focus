import Header from "./Home Components/Header";
import Navigation from "./Home Components/Navigation";
import Posts from "./Home Components/Posts";
import Profile from "./Home Components/Profile";

function Home() {
  return (
    <div>
      <Header />
      <div className="flex">
        <Navigation />
        <Posts />
        <Profile />
      </div>

    </div>
  );
}

export default Home;
