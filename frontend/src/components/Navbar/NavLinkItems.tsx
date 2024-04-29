import { useState } from "react";
import { NavLink } from "react-router-dom";
import { MdKeyboardArrowRight, MdKeyboardArrowDown } from "react-icons/md";

type SubItem = {
  id: string;
  path: string;
  icon: string;
  hoverIcon: string;
  label: string;
  count?: number;
  subItems?: SubItem[];
};

type NavLinkProps = {
  isActive: boolean;
};

interface Item extends SubItem {}

interface NavLinkItemProps {
  item: Item;
}

const NavLinkItem: React.FC<NavLinkItemProps> = ({ item }) => {
  const [hovered, setHovered] = useState<boolean>(false);
  const [showSubItems, setShowSubItems] = useState<boolean>(false);

  const getNavLinkClass = ({ isActive }: NavLinkProps) => {
    let baseClass =
      "flex items-center pl-4 py-2 font-semibold mx-2 rounded-md my-2 text-sm cursor-pointer";
    if (isActive) {
      return `${baseClass} bg-blue-600 text-white`;
    } else if (hovered) {
      return `${baseClass} bg-blue-50 text-gray-600`;
    } else {
      return `${baseClass} text-gray-600`;
    }
  };

  const toggleSubItems = () => setShowSubItems(!showSubItems);

  return (
    <div>
      <NavLink
        to={item.path}
        className={({ isActive }) => getNavLinkClass({ isActive })}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={
          item.subItems
            ? (e) => {
                e.preventDefault();
                toggleSubItems();
              }
            : undefined
        }
      >
        {({ isActive }) => (
          <>
            <img
              src={isActive ? item.hoverIcon : item.icon}
              alt={item.label}
              className="mr-2"
            />
            {item.label}
            {item.subItems &&
              (showSubItems ? (
                <MdKeyboardArrowDown className="ml-auto h-6 w-6 mr-2" />
              ) : (
                <MdKeyboardArrowRight className="ml-auto h-6 w-6 mr-2" />
              ))}
            {item.count !== undefined && (
              <span
                className={`px-2 py-1 ml-auto mr-2 text-xs font-semibold rounded-md ${
                  isActive ? "bg-white text-blue-500" : "bg-blue-500 text-white"
                }`}
              >
                {item.count}
              </span>
            )}
          </>
        )}
      </NavLink>
      {showSubItems && item.subItems && (
        <div className="pl-2">
          {item.subItems.map((subItem) => (
            <NavLinkItem key={subItem.id} item={subItem} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NavLinkItem;
