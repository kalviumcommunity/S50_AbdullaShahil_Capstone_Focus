import React, { useState } from "react";
import Header from "./Home Components/Header";
import Account from "./Settings Components/Account";
import General from "./Settings Components/General";

function Settings() {
  const [activeComponent, setActiveComponent] = useState("general");

  const handleItemClick = (item) => {
    setActiveComponent(item);
  };

  return (
    <div>
      <Header />
      <div className="mx-4 min-h-[80vh] max-w-screen-xl sm:mx-8 xl:mx-auto">
        <h1 className="border-b py-6 text-4xl font-semibold">Settings</h1>
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
                className={`cursor-pointer px-3 py-2 text-sm text-slate-600 hover:bg-blue-700 hover:text-white ${
                  activeComponent === "account" ? "font-semibold" : ""
                }`}
                onClick={() => handleItemClick("account")}
              >
                Account
              </li>
              <li
                className={`cursor-pointer px-3 py-2 text-sm text-slate-600 hover:bg-blue-700 hover:text-white ${
                  activeComponent === "general" ? "font-semibold" : ""
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
                className={`mt-5 cursor-pointer border-l-2 border-transparent px-2 py-2 font-semibold transition hover:border-1-gradient1 hover:text-blue-700 ${
                  activeComponent === "general" ? "font-semibold" : ""
                }`}
                onClick={() => handleItemClick("general")}
              >
                General
              </li>
              <li
                className={`mt-5 cursor-pointer border-l-2 border-l-blue-700 px-2 py-2 font-semibold text-blue-700 transition hover:gradient1 ${
                  activeComponent === "account" ? "font-semibold" : ""
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
