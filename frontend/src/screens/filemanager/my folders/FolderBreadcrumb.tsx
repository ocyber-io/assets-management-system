import React from "react";
import { Link } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";

interface BreadcrumbProps {
  items: { name: string; path: string }[];
}

const FolderBreadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex text-gray-700 text-sm my-4 pl-6 font-medium">
      {items.map((item, index) => (
        <span key={index} className="flex items-center">
          <Link to={item.path} className="hover:underline hover:text-blue-500">
            {item.name}
          </Link>
          {index < items.length - 1 && (
            <span className="mx-2">
              <FiChevronRight className="mt-1" />
            </span>
          )}
        </span>
      ))}
    </nav>
  );
};

export default FolderBreadcrumb;
