import React, { useEffect, useRef, useState } from "react";
import { CgClose } from "react-icons/cg";
import { NavLink } from "react-router-dom";
import BurgerMenu from "../../assets/icons/burger-menu.svg";
import menuCrossIcon from "../../assets/icons/menuCross.svg";
import logo from "../../assets/logo.svg";
import { navSections } from "../../helpers/navItems";
import AddNewButton from "../AddNewButton";
import NavLinkItem from "./NavLinkItems";

type AddNewButtonProps = {
  setModalOpen: (isOpen: boolean) => void;
  setNewFolderModalOpen: (isOpen: boolean) => void;
};

const SideBar: React.FC<AddNewButtonProps> = ({
  setModalOpen,
  setNewFolderModalOpen,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="lg:ml-6 md:ml-6 ml-2 w-full">
        <button
          className="text-4xl md:mt-6 mt-2.5 lg:hidden"
          onClick={toggleSidebar}
        >
          {isOpen ? (
            <CgClose />
          ) : (
            <div className="bg-white p-1.5 rounded-lg">
              <img
                src={BurgerMenu}
                alt="Menu Icon"
                className="text-gray-600 z-50"
              />
            </div>
          )}
        </button>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        ></div>
      )}

      <div
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 w-64 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-40 lg:relative lg:translate-x-0`}
      >
        <div className="w-full h-[99vh] bg-white text-gray-600 flex flex-col lg:m-2 rounded-r-2xl border-2 border-gray-200">
          {isOpen && (
            <img
              src={menuCrossIcon}
              className="absolute right-0 mr-2 mt-1 text-gray-500 font-bold lg:hidden cursor-pointer"
              onClick={toggleSidebar}
            />
          )}
          <div className="flex items-center justify-center p-4 border-b">
            <NavLink to="/">
              <img src={logo} alt="Logo" />
            </NavLink>
          </div>
          <div className="p-4 border-b">
            <AddNewButton
              setModalOpen={setModalOpen}
              setNewFolderModalOpen={setNewFolderModalOpen}
            />
          </div>
          <ul className="flex flex-col">
            {navSections.map((section, index) => (
              <React.Fragment key={index}>
                <li className="px-4 py-1 font-semibold">{section.label}</li>
                {section.items.map((item) => (
                  <NavLinkItem key={item.id} item={item} />
                ))}
                {index !== navSections.length - 1 && (
                  <div className="border-b my-2"></div>
                )}
              </React.Fragment>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default SideBar;
