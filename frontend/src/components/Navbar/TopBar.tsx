import React from "react";
import bellIcon from "../../assets/icons/bell.svg";
import searchIcon from "../../assets/icons/search.svg";
import downArrowIcon from "../../assets/icons/arrow-down-profile.svg";

const TopBar: React.FC = () => {
  return (
    <div className="bg-white h-28 md:h-16 fixed top-0 left-0 right-0 z-20 p-4 md:relative flex md:items-center flex-col md:flex-row justify-between md:shadow-md md:px-4 rounded-lg">
      {/* Top Row - Profile Button only on mobile */}
      <div className="w-full md:w-auto flex justify-end md:hidden">
        <button className="bg-yellow-400 text-white p-2 rounded-full text-sm">
          SM
        </button>
      </div>

      {/* Bottom Row - Search Bar and Bell Icon, includes Profile Button on desktop */}
      <div className="flex items-center md:justify-end justify-between md:space-x-4 space-x-1 flex-grow w-full mt-2 md:mt-0">
        {/* Search Bar */}
        <div className="flex items-center rounded-lg w-10/12 md:w-1/4 border-2 md:mr-4">
          <img src={searchIcon} alt="Search" className="mx-2 hidden sm:block" />
          <input
            type="text"
            placeholder="Search..."
            className="py-2 ml-1 text-sm text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent w-full"
          />
        </div>

        {/* Bell Icon */}
        <div className="flex">
          <div className="p-2 bg-gray-100 rounded-lg cursor-pointer">
            <img src={bellIcon} alt="Notifications" />
          </div>
        </div>

        {/* Profile Button - Visible in desktop view */}
        <div className="hidden md:flex md:w-auto md:static md:mr-0">
          <div className="flex gap-x-2">
            <button className="bg-yellow-400 text-white p-2 rounded-full text-sm">
              SM
            </button>
            <img
              className="cursor-pointer"
              src={downArrowIcon}
              alt="Profile Menu"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
