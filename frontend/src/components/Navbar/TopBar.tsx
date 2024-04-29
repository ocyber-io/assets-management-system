import React from "react";
import bellIcon from "../../assets/icons/bell.svg";
import searchIcon from "../../assets/icons/search.svg";

const TopBar: React.FC = () => {
  return (
    <div className="bg-white md:h-16 h-12 flex items-center justify-between md:shadow-md md:px-4 px-2 rounded-lg ml-8 md:ml-0">
      {/* Left Side - Search Bar, Bell Icon, and Profile Button */}
      <div className="flex items-center md:justify-end justify-around space-x-2 flex-grow">
        {/* Search Bar */}
        <div className="flex items-center rounded-lg md:w-1/4 w-1/2 border-2 md:mr-4">
          <img src={searchIcon} alt="Search" className="mx-2 hidden sm:block" />{" "}
          {/* Hide icon on xs screens to save space */}
          <input
            type="text"
            placeholder="Search..."
            className="md:py-2 ml-1 py-1 text-sm text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent"
            style={{ minWidth: "50px" }} // Reduced minimum width on mobile
          />
        </div>

        {/* Bell Icon */}
        <div className="p-2 bg-gray-100 rounded-lg cursor-pointer">
          <img src={bellIcon} alt="Notifications" />
        </div>

        {/* Profile Button */}
        <button className="bg-yellow-400 text-white md:p-2 p-1 rounded-full text-sm">
          SM
        </button>
      </div>
    </div>
  );
};

export default TopBar;
