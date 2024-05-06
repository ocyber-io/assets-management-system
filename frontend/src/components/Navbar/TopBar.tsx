import { jwtDecode } from "jwt-decode";
import React, { useEffect, useRef, useState } from "react";
import downArrowIcon from "../../assets/icons/arrow-down-profile.svg";
import bellIcon from "../../assets/icons/bell.svg";
import searchIcon from "../../assets/icons/search.svg";
import { useUserStore } from "../../stores/userStore";

const TopBar: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [userInitials, setUserInitials] = useState("SM");
  const { logout } = useUserStore();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<{ firstname: string; lastname: string }>(
          token
        );
        const initials = `${decoded.firstname[0]}${decoded.lastname[0]}`;
        setUserInitials(initials.toUpperCase());
      } catch (error) {
        console.error("Failed to decode JWT:", error);
      }
    }
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const logoutHandler = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    event.stopPropagation();
    logout();
  };

  return (
    <div className="bg-white h-28 md:h-16 fixed top-0 left-0 right-0 z-20 p-4 md:relative flex md:items-center flex-col md:flex-row justify-between md:shadow-md md:px-4 rounded-lg">
      <div className="w-full md:w-auto flex justify-end md:hidden  pr-2.5">
        <button
          className="bg-yellow-400 text-white h-10 w-10 rounded-full text-sm"
          onClick={toggleDropdown}
        >
          {userInitials}
        </button>
      </div>
      <div className="flex items-center md:justify-end justify-between md:space-x-4 space-x-1 flex-grow w-full mt-2 md:mt-0">
        <div className="flex items-center rounded-lg w-10/12 md:w-1/4 border-2 md:mr-4">
          <img src={searchIcon} alt="Search" className="mx-2 hidden sm:block" />
          <input
            type="text"
            placeholder="Search..."
            className="py-2 ml-1 text-sm text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent w-full"
          />
        </div>
        <div className="flex">
          <div className="p-2 bg-gray-100 rounded-lg cursor-pointer">
            <img src={bellIcon} alt="Notifications" />
          </div>
        </div>
        <div ref={dropdownRef} className="md:w-auto md:static md:mr-0 ">
          <div className="md:block hidden">
            <div className="flex gap-x-2 items-center">
              <button
                className="bg-yellow-400 h-10 w-10 text-white rounded-full text-sm"
                onClick={toggleDropdown}
              >
                {userInitials}
              </button>
              <img
                className="cursor-pointer"
                onClick={toggleDropdown}
                src={downArrowIcon}
                alt="Profile Menu"
              />
            </div>
          </div>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 top-12 bg-white shadow-lg rounded">
              <button
                className="block px-7 py-2 text-sm text-red-500 hover:bg-blue-50 font-semibold"
                onClick={logoutHandler}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
