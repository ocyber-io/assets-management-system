// Import statements
import dashboardIcon from "../assets/icons/dashboard.svg";
import dashboardHoverIcon from "../assets/icons/dashboardHover.svg";
import recentIcon from "../assets/icons/recent.svg";
import recentHoverIcon from "../assets/icons/recentHover.svg";
import settingsIcon from "../assets/icons/settings.svg";
import settingsHoverIcon from "../assets/icons/settingsHover.svg";
import tagsIcon from "../assets/icons/tags.svg";
import tagsHoverIcon from "../assets/icons/tagsHover.svg";
import trashIcon from "../assets/icons/trash.svg";
import trashHoverIcon from "../assets/icons/trashHover.svg";
import profileIcon from "../assets/icons/settings/profile.svg";
import profileHoverIcon from "../assets/icons/settings/profileHover.svg";
import documentLinkIcon from "../assets/icons/settings/documentLink.svg";
import documentLinkHoverIcon from "../assets/icons/settings/documentLinkHover.svg";

// Interface definitions
type NavItem = {
  id: string;
  path: string;
  label: string;
  icon: string;
  hoverIcon: string;
  count?: number;
  subItems?: NavItem[];
  countKey?: string;
};

type NavSection = {
  label: string;
  items: NavItem[];
};

// Navigation sections data with type annotation
export const navSections: NavSection[] = [
  {
    label: "Overview",
    items: [
      {
        id: "dashboard",
        path: "/",
        label: "Dashboard",
        icon: dashboardIcon,
        hoverIcon: dashboardHoverIcon,
      },
    ],
  },
  {
    label: "File Manager",
    items: [
      {
        id: "recent",
        path: "/recent",
        label: "Recent",
        icon: recentIcon,
        hoverIcon: recentHoverIcon,
        countKey: "recentFiles",
        count: 34,
      },
      {
        id: "tags",
        path: "/tags",
        label: "Tags",
        icon: tagsIcon,
        hoverIcon: tagsHoverIcon,
      },
    ],
  },
  {
    label: "Shared Files",
    items: [
      {
        id: "trash",
        path: "/trash",
        label: "Trash",
        icon: trashIcon,
        hoverIcon: trashHoverIcon,
        countKey: "trash",
        count: 5,
      },
    ],
  },
  {
    label: "Settings",
    items: [
      {
        id: "settings",
        label: "Settings",
        path: "/settings",
        icon: settingsIcon,
        hoverIcon: settingsHoverIcon,
        subItems: [
          {
            id: "profile",
            label: "Profile",
            path: "/settings/profile",
            icon: profileIcon,
            hoverIcon: profileHoverIcon,
          },
          {
            id: "documents",
            label: "Document Links",
            path: "/settings/document-links",
            icon: documentLinkIcon,
            hoverIcon: documentLinkHoverIcon,
          },
        ],
      },
    ],
  },
];
