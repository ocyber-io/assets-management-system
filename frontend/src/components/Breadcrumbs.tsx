import React from "react";
import { Link, useLocation } from "react-router-dom";
import settingsIcon from "../assets/icons/settings.svg";
import profileIcon from "../assets/icons/settings/profile.svg";
import documentLinksIcon from "../assets/icons/settings/documentLink.svg";
import arrowLeftIcon from "../assets/icons/arrow-left.svg";

type IconMap = {
  [key: string]: string;
};

type BreadcrumbPropTypes = {
  fromDocumentLinks?: boolean;
};

const Breadcrumbs: React.FC<BreadcrumbPropTypes> = ({
  fromDocumentLinks = false,
}: BreadcrumbPropTypes) => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const icons: IconMap = {
    settings: settingsIcon,
    profile: profileIcon,
    "document-links": documentLinksIcon,
  };

  const formatPart = (part: string) => {
    return part
      .replace(/-/g, " ")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l: string) => l.toUpperCase());
  };

  return (
    <nav
      aria-label="breadcrumb"
      className={`${
        fromDocumentLinks ? " mt-4" : "my-4"
      } mt-6 ml-4 bg-blue-50 p-2 rounded-lg`}
    >
      <ol className="list-none p-0 inline-flex items-center md:px-3">
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const formattedValue = formatPart(value);
          const icon = icons[value];

          const isSettings = value === "settings";
          const linkClass = isSettings
            ? "text-gray-600 opacity-50"
            : "text-blue-600 hover:text-blue-800 underline";

          return (
            <li key={to} className="flex items-center">
              {icon && (
                <img
                  src={icon}
                  alt={`${formattedValue} icon`}
                  className={`mr-2 h-4 mt-0.5 w-4 ${
                    isSettings ? "opacity-50" : "opacity-100"
                  }`}
                />
              )}
              {last ? (
                <span className={`text-black ${!isSettings && "underline"}`}>
                  {formattedValue}
                </span>
              ) : (
                <>
                  <Link to={to} className={linkClass}>
                    {formattedValue}
                  </Link>
                  <img src={arrowLeftIcon} className="mx-2" alt="Arrow Icon" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
