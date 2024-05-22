import React, { useEffect, useRef, useState } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useMediaQuery } from "react-responsive";
import { File } from "../../Types";
import {
  copylinkIcon,
  downloadIcon,
  fileinformationIcon,
  lockIcon,
  moveIcon,
  movetobinIcon,
  organizeIcon,
  renameIcon,
  replaceIcon,
  shareIcon,
  starredIcon,
  unstarIcon,
} from "../../helpers/dropdownIcons";

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
interface RecentStorageDropdownProps {
  file: File;
  isOpen: boolean;
  toggleDropdown: () => void;
  fileInformationHandler: (fileDetails: File) => void;
  shareHandler: (fileLink: string, fileId: string) => void;
  replaceHandler: (fileDetails: File) => void;
  deleteHandler: (fileId: string) => void;
  renameHandler: (filename: string, fileId: string) => void;
  disableHandler: (fileId: string) => void;
  moveToFolderHandler: (fileId: string) => void;
  enableHandler: (fileId: string) => void;
  removeFromFolderHandler: (fileId: string) => void;
  copyToClipboard: (link: string) => void;
  deleteConfirmationHandler: (fileId: string) => void;
  restoreHandler: (fileId: string, filename: string, filesize: string) => void;
  toggleFavoriteFiles: (
    fileId: string,
    isFavorite: boolean | undefined
  ) => void;
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
    icon: shareIcon,
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
      { label: "Add to Favorites", icon: starredIcon },
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

const RecentStorageDropdown: React.FC<RecentStorageDropdownProps> = ({
  file,
  isOpen,
  toggleDropdown,
  fileInformationHandler,
  shareHandler,
  replaceHandler,
  deleteHandler,
  renameHandler,
  moveToFolderHandler,
  copyToClipboard,
  deleteConfirmationHandler,
  toggleFavoriteFiles,
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

  const downloadHandler = () => {
    if (file.link) {
      const link = document.createElement("a");
      link.href = file.link; // Assuming `file.link` is the URL to download the file
      link.setAttribute("download", file.originalName); // This suggests a filename to save as
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div ref={dropdownRef} className="relative">
      {!isDesktopOrLaptop ? (
        <div
          className={`absolute z-50 ${
            isOpen ? "block" : "hidden"
          } divide-y divide-gray-100 rounded-md bg-white border py-2 border-gray-200 shadow-md w-40`}
          style={{ right: "16px", bottom: "-5px" }}
        >
          <div className="flex">
            <img
              src={shareIcon}
              className={`ml-6  ${
                file.isDisabled ? "opacity-30" : "cursor-pointer"
              }`}
              alt="Share"
              onClick={() => {
                if (!file.isDisabled) shareHandler(file.link, file._id);
              }}
            />

            <img
              src={downloadIcon}
              className={`ml-4 ${
                file.isDisabled ? "opacity-30" : "cursor-pointer"
              }`}
              alt="Download"
              onClick={() => {
                if (!file.isDisabled) downloadHandler();
              }}
            />
            {!file.isFavorite ? (
              <img
                src={starredIcon}
                className={`ml-4 ${
                  file.isDisabled ? "opacity-30" : "cursor-pointer"
                }`}
                alt="Star"
                onClick={() => toggleFavoriteFiles(file._id, file.isFavorite)}
              />
            ) : (
              <img
                src={unstarIcon}
                className={`ml-4 ${
                  file.isDisabled ? "opacity-30" : "cursor-pointer"
                }`}
                alt="Star"
                onClick={() => toggleFavoriteFiles(file._id, file.isFavorite)}
              />
            )}
            <img
              src={movetobinIcon}
              className="ml-4 cursor-pointer"
              alt="Move to bin"
              onClick={() => {
                deleteConfirmationHandler(file._id);
              }}
            />
          </div>
        </div>
      ) : (
        <div
          className={`absolute z-50 ${
            isOpen ? "block" : "hidden"
          } divide-y divide-gray-100 rounded-md bg-white border-2 border-gray-200 shadow w-44 dark:bg-gray-700`}
          style={{ bottom: "24px", right: "16px" }}
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
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent the event from propagating to the outside click handler
                      if (menu.subItems.length !== 0) {
                        toggleSubMenu(menu.key);
                      } else {
                        if (menu.key === "replace") {
                          replaceHandler(file);
                          toggleDropdown();
                        } else if (menu.key === "trash") {
                          deleteHandler(file._id);
                          toggleDropdown();
                        } else if (menu.key === "download") {
                          downloadHandler();
                          toggleDropdown();
                        } else if (menu.key === "rename") {
                          renameHandler(file.originalName, file._id);
                          toggleDropdown();
                        }
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
                    <ul className="absolute right-full top-0 mt-0 mr-1 bg-white rounded-md shadow-lg w-48 z-20">
                      {menu.subItems.map((subItem: SubMenuItem) => (
                        <li key={subItem.label}>
                          <button
                            className="flex w-full p-2 hover:bg-blue-50 dark:hover:bg-gray-600 dark:hover:text-white"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent the event from propagating to the outside click handler
                              if (subItem.label === "Details") {
                                fileInformationHandler(file);
                                toggleDropdown();
                              } else if (subItem.label === "Share") {
                                shareHandler(file.link, file._id);
                                toggleDropdown();
                              } else if (subItem.label === "Copy Link") {
                                copyToClipboard(file.link);
                                toggleDropdown();
                              } else if (subItem.label === "Add to Favorites") {
                                toggleFavoriteFiles(file._id, file.isFavorite);
                                toggleDropdown();
                              } else if (subItem.label === "Move") {
                                moveToFolderHandler(file._id);
                                toggleDropdown();
                              } else if (
                                subItem.label === "Remove from Favorites"
                              ) {
                                toggleFavoriteFiles(file._id, file.isFavorite);
                                toggleDropdown();
                              }
                              // Add conditions for other subItems here if needed
                            }}
                          >
                            <img
                              src={
                                subItem.label === "Add to Favorites" &&
                                file.isFavorite
                                  ? unstarIcon
                                  : subItem.icon
                              }
                              alt=""
                              className="mr-2 mt-1"
                            />
                            {subItem.label === "Add to Favorites" &&
                            file.isFavorite
                              ? "Remove from Favorites"
                              : subItem.label}
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

export default RecentStorageDropdown;