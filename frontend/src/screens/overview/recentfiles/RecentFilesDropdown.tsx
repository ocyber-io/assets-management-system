import React, { useEffect, useRef, useState } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
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
} from "../../../helpers/dropdownIcons";

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
  isOpen: boolean;
  toggleDropdown: () => void;
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
  isOpen,
  toggleDropdown,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);

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
      <div
        className={`absolute z-50 ${
          isOpen ? "block" : "hidden"
        } divide-y divide-gray-100 rounded-md bg-white border-2 border-gray-200 shadow w-44 dark:bg-gray-700`}
        style={{
          bottom: "18px",
          right: "10px",
        }}
      >
        <ul className="py-2 text-sm text-gray-700 text-left dark:text-gray-200">
          {subItems.map((menu: MenuItem, index) => (
            <>
              <li className="relative" key={menu.key}>
                <button
                  className={`w-full text-left flex justify-left items-center px-4 py-2 ${
                    openSubMenu === menu.key ? "bg-blue-50" : "hover:bg-blue-50"
                  } dark:hover:bg-gray-600 dark:hover:text-white`}
                  onClick={() => toggleSubMenu(menu.key)}
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
                        <a
                          href="#"
                          className="flex px-4 py-2 hover:bg-blue-50 dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                          <img src={subItem.icon} alt="" className="mr-2" />
                          {subItem.label}
                        </a>
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
            </>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecentFilesDropdown;
