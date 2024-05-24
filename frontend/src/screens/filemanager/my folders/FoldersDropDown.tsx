import React, { useEffect, useRef } from "react";
import { useMediaQuery } from "react-responsive";
import {
  downloadIcon,
  movetobinIcon,
  restoreIcon,
} from "../../../helpers/dropdownIcons";
import { folderColorIcon, renameFolderIcon } from "../../../helpers/icons";
import { Folder } from "../../../Types";

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
  restoreFolderHandler: (folderId: string) => void;
  deleteFolderFromBinHandler: (folderId: string) => void;
  renameHandler: (folderId: string, fileName: string) => void;
  handleDownloadFolder: (folder: Folder, files: any[]) => void;
  changeColorHandler: (folderId: string) => void;
  folderId: string;
  folderName: string | null;
  fromTrash?: boolean;
  folderForDropDown: Folder | undefined;
  filesForDropDown: any[] | undefined;
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
const trashMenuItems: MenuItem[] = [
  {
    key: "delete",
    label: "Delete",
    icon: movetobinIcon,
  },
  {
    key: "restore",
    label: "Restore",
    icon: restoreIcon,
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
  deleteFolderFromBinHandler,
  restoreFolderHandler,
  fromTrash,
  folderForDropDown,
  filesForDropDown,
  handleDownloadFolder,
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

  const onDownloadFolder = () => {
    if (folderForDropDown && filesForDropDown)
      handleDownloadFolder(folderForDropDown, filesForDropDown);
  };
  return (
    <div ref={dropdownRef} className="relative">
      {!isDesktopOrLaptop ? (
        <div
          className={`absolute z-50 ${isOpen ? "block" : "hidden"} divide-y ${
            fromTrash ? "w-20" : "w-36"
          } mb-[-4px] divide-gray-100 rounded-md bg-white border py-2 border-gray-200 shadow-md  `}
          style={{ right: "50px", bottom: "0" }}
        >
          <div className="flex">
            {!fromTrash && (
              <>
                <img
                  src={downloadIcon}
                  className="ml-4"
                  alt="Download"
                  onClick={onDownloadFolder}
                />

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
              </>
            )}
            {fromTrash ? (
              <img
                src={movetobinIcon}
                className="ml-4 cursor-pointer"
                alt="Move to bin"
                onClick={() => deleteFolderFromBinHandler(folderId)}
              />
            ) : (
              <img
                src={movetobinIcon}
                className="ml-4 cursor-pointer"
                alt="Move to bin"
                onClick={() => onDeleteFolder(folderId)}
              />
            )}

            {fromTrash && (
              <img
                src={restoreIcon}
                className="ml-4 cursor-pointer"
                alt="Move to bin"
                onClick={() => restoreFolderHandler(folderId)}
              />
            )}
          </div>
        </div>
      ) : (
        <div
          className={`absolute z-50 ${
            isOpen ? "block" : "hidden"
          } divide-y divide-gray-100 rounded-md bg-white border-2 border-gray-200 shadow w-44  `}
          style={{ top: "2px", right: "30px" }}
        >
          <ul className="py-2 text-sm text-gray-700 text-left ">
            {fromTrash
              ? trashMenuItems.map((menu: MenuItem) => (
                  <li key={menu.key} className="relative">
                    {menu.key === "delete" ? (
                      <button
                        className="w-full text-left flex items-center px-4 py-2 hover:bg-blue-50 "
                        onClick={() => deleteFolderFromBinHandler(folderId)}
                      >
                        <img src={menu.icon} alt="" className="mr-2" />
                        {menu.label}
                      </button>
                    ) : (
                      <button
                        className="w-full text-left flex items-center px-4 py-2 hover:bg-blue-50"
                        onClick={() => restoreFolderHandler(folderId)}
                      >
                        <img src={menu.icon} alt="" className="mr-2" />
                        {menu.label}
                      </button>
                    )}
                    {["download", "foldercolor"].includes(menu.key) && (
                      <li>
                        <div className="border-t border-gray-200"></div>
                      </li>
                    )}
                  </li>
                ))
              : menuItems.map((menu: MenuItem) => (
                  <li key={menu.key} className="relative">
                    <button
                      className="w-full text-left flex items-center px-4 py-2 hover:bg-blue-50 "
                      onClick={() => {
                        switch (menu.key) {
                          case "trash":
                            onDeleteFolder(folderId);
                            break;
                          case "rename":
                            if (!folderName) return;
                            renameHandler(folderId, folderName);
                            break;
                          case "download":
                            if (folderForDropDown && filesForDropDown) {
                              handleDownloadFolder(
                                folderForDropDown,
                                filesForDropDown
                              );
                            }
                            break;
                          case "foldercolor":
                            changeColorHandler(folderId);
                            break;
                          default:
                            // Default case, do nothing
                            break;
                        }
                      }}
                    >
                      <img src={menu.icon} alt="" className="mr-2" />
                      {menu.label}
                    </button>

                    {["download", "foldercolor"].includes(menu.key) && (
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
