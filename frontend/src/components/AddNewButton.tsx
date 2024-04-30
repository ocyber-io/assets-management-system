import React, { MouseEvent, useEffect, useRef, useState } from "react";
import plusIcon from "../assets/icons/plus.svg";
import plusHoverIcon from "../assets/icons/plusHover.svg";
import {
  folderAddIcon,
  folderUploadIcon,
  fileUploadIcon,
} from "../helpers/icons";

type AddNewButtonProps = {
  setModalOpen: (isOpen: boolean) => void;
  setNewFolderModalOpen: (isOpen: boolean) => void;
};

const AddNewButton: React.FC<AddNewButtonProps> = ({
  setModalOpen,
  setNewFolderModalOpen,
}) => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  // Effect for handling outside clicks
  useEffect(() => {
    const checkIfClickedOutside = (e: MouseEvent) => {
      if (
        showDropdown &&
        ref.current &&
        !ref.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    // Properly type the event listener
    document.addEventListener("mousedown", checkIfClickedOutside as any);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside as any);
    };
  }, [showDropdown]);

  return (
    <>
      <div ref={ref} className="">
        <button
          onClick={toggleDropdown}
          className={`border-2 w-full border-gray-300 hover:border-blue-500 ${
            showDropdown
              ? "bg-blue-500 text-white"
              : "text-gray-600 bg-transparent"
          } font-semibold py-2 px-4 rounded flex items-center`}
        >
          <img
            className="mr-2"
            src={showDropdown ? plusHoverIcon : plusIcon}
            alt="Add New"
          />
          Add New
        </button>

        {showDropdown && (
          <div className="origin-top-right absolute left-6 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <button
              className="flex w-full px-4 py-2 my-2 text-sm font-semibold text-gray-700 hover:bg-blue-100"
              onClick={() => {
                setNewFolderModalOpen(true);
                setShowDropdown(false);
              }}
            >
              <img src={folderAddIcon} className="mr-2 mt-0.5" />
              Folder
            </button>
            <div className="border-b"></div>
            <button
              className="px-4 py-2 my-2 text-sm flex text-gray-700 font-semibold hover:bg-blue-100 w-full text-left"
              onClick={() => {
                setModalOpen(true);
                setShowDropdown(false);
              }}
            >
              <img src={fileUploadIcon} className="mr-2 mt-0.5" /> Files Upload
            </button>
            <a
              href="#"
              className="flex px-4 py-2 my-2 text-sm font-semibold text-gray-700 hover:bg-blue-100"
            >
              <img src={folderUploadIcon} className="mr-2" />
              Folder Upload
            </a>
          </div>
        )}
      </div>
    </>
  );
};

export default AddNewButton;
