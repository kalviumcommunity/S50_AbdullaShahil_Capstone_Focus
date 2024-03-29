import Header from "./Home Components/Header";
import Navigation from "./Home Components/Navigation";
import Posts from "./Home Components/Posts";
import UserPanel from "./Home Components/UserPanel";

function Home() {
  return (
    <div>
      <Header />
      <div className="flex justify-around">
        <Navigation />
        <Posts />
        <UserPanel />
      </div>

    </div>
  );
}

export default Home;
