import React, { useEffect, useRef } from "react";
import { useMediaQuery } from "react-responsive";
import {
  disableIcon,
  downloadIcon,
  moveIcon,
  movetobinIcon,
} from "../../../helpers/dropdownIcons";
import { folderColorIcon, renameFolderIcon } from "../../../helpers/icons";

type MenuItem = {
  key: string;
  label: string;
  icon: string;
};

interface FolderDropdownProps {
  hoveredItemId: string | null;
  isOpen: boolean;
  toggleDropdown: () => void;
  onDeleteFolder: (folderId: string) => void;
  renameHandler: (folderId: string, fileName: string) => void;
  changeColorHandler: (folderId: string) => void;
  folderId: string;
  folderName: string | null;
}

const menuItems: MenuItem[] = [
  {
    key: "download",
    label: "Download",
    icon: downloadIcon,
  },
  {
    key: "rename",
    label: "Rename",
    icon: renameFolderIcon,
  },
  {
    key: "move",
    label: "Move to",
    icon: moveIcon,
  },
  {
    key: "foldercolor",
    label: "Folder Color",
    icon: folderColorIcon,
  },
  {
    key: "trash",
    label: "Move to bin",
    icon: movetobinIcon,
  },
];

const FoldersDropdown: React.FC<FolderDropdownProps> = ({
  isOpen,
  toggleDropdown,
  onDeleteFolder,
  folderId,
  folderName,
  renameHandler,
  changeColorHandler,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isDesktopOrLaptop = useMediaQuery({ query: "(min-width: 1024px)" });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        toggleDropdown();
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

  return (
    <div ref={dropdownRef} className="relative">
      {!isDesktopOrLaptop ? (
        <div
          className={`absolute z-50 ${
            isOpen ? "block" : "hidden"
          } divide-y w-44 mb-[-4px] divide-gray-100 rounded-md bg-white border py-2 border-gray-200 shadow-md dark:bg-gray-700`}
          style={{ right: "50px", bottom: "0" }}
        >
          <div className="flex">
            <img src={downloadIcon} className="ml-4" alt="Download" />

            <img
              src={renameFolderIcon}
              className="ml-4"
              alt="Rename"
              onClick={() => {
                if (!folderName) return;
                renameHandler(folderId, folderName);
              }} // Rename handler
            />
            <img
              src={folderColorIcon}
              className="ml-4 cursor-pointer"
              alt="Change folder color"
              onClick={() => changeColorHandler(folderId)}
            />
            <img
              src={movetobinIcon}
              className="ml-4 cursor-pointer"
              alt="Move to bin"
              onClick={() => onDeleteFolder(folderId)}
            />

            <img
              src={disableIcon}
              className="ml-4 cursor-pointer"
              alt="Disable"
            />
          </div>
        </div>
      ) : (
        <div
          className={`absolute z-50 ${
            isOpen ? "block" : "hidden"
          } divide-y divide-gray-100 rounded-md bg-white border-2 border-gray-200 shadow w-44 dark:bg-gray-700`}
          style={{ top: "2px", right: "30px" }}
        >
          <ul className="py-2 text-sm text-gray-700 text-left dark:text-gray-200">
            {menuItems.map((menu: MenuItem) => (
              <li key={menu.key} className="relative">
                {menu.key === "trash" ? (
                  <button
                    className="w-full text-left flex items-center px-4 py-2 hover:bg-blue-50 dark:hover:bg-gray-600 dark:hover:text-white"
                    onClick={() => onDeleteFolder(folderId)}
                  >
                    <img src={menu.icon} alt="" className="mr-2" />
                    {menu.label}
                  </button>
                ) : (
                  <button
                    className="w-full text-left flex items-center px-4 py-2 hover:bg-blue-50 dark:hover:bg-gray-600 dark:hover:text-white"
                    onClick={
                      menu.key === "rename"
                        ? () => {
                            console.log({ folderName });
                            if (!folderName) return;
                            renameHandler(folderId, folderName);
                          } // Rename handler
                        : () => changeColorHandler(folderId) // Change color handler
                    }
                  >
                    <img src={menu.icon} alt="" className="mr-2" />
                    {menu.label}
                  </button>
                )}
                {["replace", "rename", "foldercolor"].includes(menu.key) && (
                  <li>
                    <div className="border-t border-gray-200"></div>
                  </li>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FoldersDropdown;
