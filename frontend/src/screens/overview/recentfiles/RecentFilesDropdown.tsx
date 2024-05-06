import React, { useEffect, useRef, useState } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useMediaQuery } from "react-responsive";
import {
  fileinformationIcon,
  lockIcon,
  moveIcon,
  organizeIcon,
  replaceIcon,
  starredIcon,
  shareIcon,
  movetobinIcon,
  copylinkIcon,
  downloadIcon,
  renameIcon,
  disableIcon,
} from "../../../helpers/dropdownIcons";
import { File } from "../../../Types";

// Define an interface for submenu items
type SubMenuItem = {
  label: string;
  icon: string;
};

// Define an interface for main menu items
type MenuItem = {
  key: string;
  label: string;
  icon: string;
  subItems: SubMenuItem[];
};

// Define props for the RecentDropdown component
interface RecentDropdownProps {
  file: File;
  hoveredItemId: number | null;
  isOpen: boolean;
  toggleDropdown: () => void;
  fileInformationHandler: (fileDetails: File) => void;
  shareHandler: () => void;
  replaceHandler: (fileDetails: File) => void;
  deleteHandler: () => void;
  renameHandler: (filename: string) => void;
  disableHandler: (fileId: number) => void;
}

const subItems: MenuItem[] = [
  {
    key: "replace",
    label: "Replace",
    icon: replaceIcon,
    subItems: [],
  },
  {
    key: "download",
    label: "Download",
    icon: downloadIcon,
    subItems: [],
  },
  {
    key: "rename",
    label: "Rename",
    icon: renameIcon,
    subItems: [],
  },
  {
    key: "share",
    label: "Share",
    icon: organizeIcon,
    subItems: [
      { label: "Share", icon: shareIcon },
      { label: "Copy Link", icon: copylinkIcon },
    ],
  },
  {
    key: "organize",
    label: "Organize",
    icon: organizeIcon,
    subItems: [
      { label: "Move", icon: moveIcon },
      { label: "Add to Starred", icon: starredIcon },
    ],
  },
  {
    key: "fileInfo",
    label: "File information",
    icon: fileinformationIcon,
    subItems: [
      { label: "Details", icon: fileinformationIcon },
      { label: "Lock", icon: lockIcon },
    ],
  },
  {
    key: "trash",
    label: "Move to bin",
    icon: movetobinIcon,
    subItems: [],
  },
];

const RecentFilesDropdown: React.FC<RecentDropdownProps> = ({
  file,
  isOpen,
  toggleDropdown,
  fileInformationHandler,
  shareHandler,
  replaceHandler,
  deleteHandler,
  renameHandler,
  disableHandler,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const isDesktopOrLaptop = useMediaQuery({ query: "(min-width: 1024px)" });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        toggleDropdown();
        setOpenSubMenu(null);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, toggleDropdown]);

  const toggleSubMenu = (menuKey: string) => {
    setOpenSubMenu(openSubMenu === menuKey ? null : menuKey);
  };

  return (
    <div ref={dropdownRef} className="relative">
      {!isDesktopOrLaptop ? (
        <div
          className={`absolute z-50 ${
            isOpen ? "block" : "hidden"
          } divide-y divide-gray-100 rounded-md bg-white border py-2 border-gray-200 shadow-md w-44 dark:bg-gray-700`}
          style={{ right: "34px", bottom: "0" }}
        >
          <div className="flex">
            <img
              src={shareIcon}
              className="ml-2 cursor-pointer"
              alt="Share"
              onClick={() => shareHandler()}
            />
            <img
              src={downloadIcon}
              className="ml-2.5 cursor-pointer"
              alt="Download"
            />
            <img
              src={renameIcon}
              className="ml-2.5 cursor-pointer"
              alt="Rename"
              onClick={() => renameHandler(file.name)}
            />
            <img src={starredIcon} className="ml-4 cursor-pointer" alt="Star" />
            <img
              src={movetobinIcon}
              className="ml-2.5 cursor-pointer"
              alt="Move to bin"
              onClick={() => deleteHandler()} // Example of passing the file ID
            />
            <img
              src={disableIcon}
              className="ml-2.5 cursor-pointer"
              alt="Disable"
              onClick={() => disableHandler(file.id)}
            />
          </div>
        </div>
      ) : (
        <div
          className={`absolute z-50 ${
            isOpen ? "block" : "hidden"
          } divide-y divide-gray-100 rounded-md bg-white border-2 border-gray-200 shadow w-44 dark:bg-gray-700`}
          style={{ bottom: "18px", right: "10px" }}
        >
          <ul className="py-2 text-sm text-gray-700 text-left dark:text-gray-200">
            {subItems.map((menu: MenuItem, index) => (
              <React.Fragment key={index}>
                <li className="relative">
                  <button
                    className={`w-full text-left flex items-center px-4 py-2 ${
                      openSubMenu === menu.key
                        ? "bg-blue-50"
                        : "hover:bg-blue-50"
                    } dark:hover:bg-gray-600 dark:hover:text-white`}
                    onClick={() => {
                      if (menu.subItems.length !== 0) {
                        toggleSubMenu(menu.key);
                      }
                      if (menu.key === "replace") {
                        replaceHandler(file);
                        toggleDropdown();
                      }
                      if (menu.key === "trash") {
                        deleteHandler();
                        toggleDropdown();
                      }
                      if (menu.key === "rename") {
                        renameHandler(file.name);
                        toggleDropdown();
                      }
                    }}
                  >
                    <img src={menu.icon} alt="" className="mr-2" />
                    {menu.label}

                    {menu.subItems.length > 0 && (
                      <MdKeyboardArrowRight className="ml-auto h-6 w-4 mt-0.5" />
                    )}
                  </button>
                  {openSubMenu === menu.key && (
                    <ul className="absolute right-full top-0 mt-0 mr-1 bg-white rounded-md shadow-lg w-40 z-20">
                      {menu.subItems.map((subItem: SubMenuItem) => (
                        <li key={subItem.label}>
                          <button
                            className="flex w-full p-2 hover:bg-blue-50 dark:hover:bg-gray-600 dark:hover:text-white"
                            onClick={() => {
                              // Trigger the handler when "Details" is clicked under "File information"
                              if (subItem.label === "Details") {
                                fileInformationHandler(file);
                                toggleDropdown();
                              }
                              if (subItem.label === "Share") {
                                shareHandler();
                                toggleDropdown();
                              }
                            }}
                          >
                            <img
                              src={subItem.icon}
                              alt=""
                              className="mr-2 mt-"
                            />
                            {subItem.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
                {["replace", "rename", "fileInfo"].includes(menu.key) && (
                  <li>
                    <div className="border-t border-gray-200"></div>
                  </li>
                )}
              </React.Fragment>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RecentFilesDropdown;
