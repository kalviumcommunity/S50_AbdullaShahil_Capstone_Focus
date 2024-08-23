import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Header from "./Home Components/Header";
import Account from "./Settings Components/Account";
import General from "./Settings Components/General";
import Back from "../assets/back.png"

function Settings() {
  const [activeComponent, setActiveComponent] = useState("general");

  const handleItemClick = (item) => {
    setActiveComponent(item);
  };

  const navigate = useNavigate();
  const navigateHome = () => {
    navigate('/home');
  };


  return (
    <div>
      <Header />

        <div onClick={navigateHome} className='text-left ml-4 mt-4 flex justify-between items-center hover:bg-blue-gray-50 hover:cursor-pointer rounded-md transition w-[6vw] p-1 '>
          <img className='h-5' src={Back} alt="" />
          <h1 className='poppins textgray text-lg'>Home</h1>
        </div>
      <div className="mx-4 min-h-[80vh] max-w-screen-xl sm:mx-8 xl:mx-auto">
        <h1 className="border-b py-6 text-4xl font-medium poppins">Settings</h1>
        <div className="grid grid-cols-8  pt-3 sm:grid-cols-10">
          <div className="relative my-4 w-56 sm:hidden">
            <input
              className="peer hidden"
              type="checkbox"
              name="select-1"
              id="select-1"
            />
            <label
              htmlFor="select-1"
              className="flex w-full cursor-pointer select-none rounded-lg border p-2 px-3 text-sm text-gray-700 ring-blue-700 peer-checked:ring"
            >
              Accounts{" "}
            </label>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="pointer-events-none absolute right-0 top-3 ml-auto mr-5 h-4 text-slate-700 transition peer-checked:rotate-180"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
            <ul className="max-h-0 select-none flex-col overflow-hidden rounded-b-lg shadow-md transition-all duration-300 peer-checked:max-h-56 peer-checked:py-3">
              <li
                className={`poppins cursor-pointer px-3 py-2 text-sm text-slate-600 hover:bg-blue-700 hover:text-white ${activeComponent === "account" ? "font-medium" : ""
                  }`}
                onClick={() => handleItemClick("account")}
              >
                Account
              </li>
              <li
                className={`poppins cursor-pointer px-3 py-2 text-sm text-slate-600 hover:bg-blue-700 hover:text-white ${activeComponent === "general" ? "font-medium" : ""
                  }`}
                onClick={() => handleItemClick("general")}
              >
                General
              </li>
            </ul>
          </div>

          <div className="col-span-2 hidden sm:block">
            <ul>

              <li
                className={`mt-5 poppins textgray cursor-pointer border-l-2 border-transparent px-2 py-2 transition hover:border-1-gradient1 hover:text-blue-700 ${activeComponent === "general" ? "font-semibold border-l-blue-700 text-blue-700" : ""
                  }`}
                onClick={() => handleItemClick("general")}
              >
                General
              </li>
              <li
                className={`mt-5 poppins textgray cursor-pointer border-l-2 border-transparent px-2 py-2 transition hover:gradient1 hover:text-blue-700 ${activeComponent === "account" ? "font-semibold border-l-blue-700 text-blue-700" : ""
                  }`}
                onClick={() => handleItemClick("account")}
              >
                Account
              </li>
            </ul>
          </div>
          {activeComponent === "general" && <General />}
          {activeComponent === "account" && <Account />}
        </div>
      </div>

    </div>
  );
}

export default Settings;
