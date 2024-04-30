import React, { useEffect, useRef, useState } from "react";
import { CgClose, CgMenuRight } from "react-icons/cg";
import { RxCross2 } from "react-icons/rx";
import { NavLink } from "react-router-dom";
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
  }, [sidebarRef]);

  return (
    <>
      <button
        className="text-4xl md:mt-6 mt-2.5 px-1 md:hidden"
        onClick={toggleSidebar}
      >
        {isOpen ? (
          <CgClose />
        ) : (
          <div className="bg-white ml-3 p-1.5 rounded-lg">
            <CgMenuRight className="text-gray-600 z-50 " />
          </div>
        )}
      </button>
      <div
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 w-64 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-40 md:relative md:translate-x-0`}
      >
        <div className="w-full h-[99vh] bg-white text-gray-600 flex flex-col lg:m-2 rounded-2xl border-2 border-gray-200">
          {isOpen && (
            <RxCross2
              className="absolute right-0 mr-2 mt-1 text-gray-500 font-bold md:hidden cursor-pointer"
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
            {/* <TestAddNew setModalOpen={setModalOpen} /> */}
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
