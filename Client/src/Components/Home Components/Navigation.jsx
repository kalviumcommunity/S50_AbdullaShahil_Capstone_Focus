import { Link, useNavigate } from 'react-router-dom';

function Navigation({ type, template, navigateTo, setPostCategory, setArticleCategory }) {
  const navigate = useNavigate();

  const toHome = () => navigate("/home");
  const toSettings = () => navigate("/settings");
  const toLensHub = () => navigate("/lenshub");
  const toChats = () => navigate("/chats");

  const handlePostCategoryClick = (category) => {
    setPostCategory(category);
  };

  const handleArticleCategoryClick = (category) => {
    setArticleCategory(category);
  };

  return (
    <div className="w-fit pl-10 pr-5 pt-10">
      <div className="flex items-center pl-1">
        <Link to={navigateTo}>
          <div className="add-btn gradient1 flex justify-center items-center bg-green-500 w-16 h-16 rounded-full">
            <button
              className="plus pb-1 text-white text-4xl cursor-pointer outline-none hover:rotate-90 duration-300"
              title="Add New"
            >
              +
            </button>
          </div>
        </Link>
        <h1 className="text-gray pl-4 text-lg poppins">{template}</h1>
      </div>

      <div className="category-panel gradient2 mt-10 lg:w-[20vw] border border-gray shadow-md p-8 rounded-lg">
        <ul className="cm-panel category-list text-left">
          <li className="rounded">
            <button className="text-md py-2 pr-[7.2rem] text-white poppins px-4 transition text-left mb-2 hover:bg-black rounded" onClick={toHome}>Home</button>
          </li>
          <li className="rounded">
            <button className="text-md py-2 pr-[2.5rem] px-4 text-white poppins transition text-left mb-2 hover:bg-black rounded" onClick={toLensHub}>Lens Hub</button>
          </li>
          <li className="rounded">
            <button className="text-md py-2 text-white poppins px-4 transition text-left mb-2 hover:bg-black rounded" onClick={toChats}>Chats</button>
          </li>
          <li className="rounded">
            <button className="text-md py-2 text-white poppins px-4 transition text-left hover:bg-black rounded" onClick={toSettings}>Account Settings</button>
          </li>
        </ul>
      </div>

      <div className="category-panel gradient1 mt-10 lg:w-[20vw] border border-gray shadow-md p-8 rounded-lg">
        {type === 'post' ? (
          <ul className="cm-panel category-list text-left">
            <li className="rounded">
              <button className="text-md py-2 pr-[7.2rem] text-white poppins px-4 transition text-left mb-2 hover:bg-black rounded" onClick={() => handlePostCategoryClick('Portraits')}>Portraits</button>
            </li>
            <li className="rounded">
              <button className="text-md py-2 pr-[2.5rem] px-4 text-white poppins transition text-left mb-2 hover:bg-black rounded" onClick={() => handlePostCategoryClick('Landscapes')}>Landscapes</button>
            </li>
            <li className="rounded">
              <button className="text-md py-2 text-white poppins px-4 transition text-left mb-2 hover:bg-black rounded" onClick={() => handlePostCategoryClick('Minimal')}>Minimal</button>
            </li>
            <li className="rounded">
              <button className="text-md py-2 text-white poppins px-4 transition text-left hover:bg-black rounded" onClick={() => handlePostCategoryClick('Grayscales')}>Grayscales</button>
            </li>
          </ul>
        ) : (
          <ul className="cm-panel category-list text-left">
            <li className="rounded">
              <button className="text-md py-2 pr-[7.2rem] text-white poppins px-4 transition text-left mb-2 hover:bg-black rounded" onClick={() => handleArticleCategoryClick('Spotlights')}>Spotlights</button>
            </li>
            <li className="rounded">
              <button className="text-md py-2 pr-[2.5rem] px-4 text-white poppins transition text-left mb-2 hover:bg-black rounded" onClick={() => handleArticleCategoryClick('Tips and Tricks')}>Tips and Tricks</button>
            </li>
            <li className="rounded">
              <button className="text-md py-2 text-white poppins px-4 transition text-left hover:bg-black rounded" onClick={() => handleArticleCategoryClick('News and Trends')}>News and Trends</button>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}

export default Navigation;
