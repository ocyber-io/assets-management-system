import React, { useState } from "react";
import { nameFilterIcon } from "../../../helpers/icons";

type NameFilterProps = {
  toggleSort: (direction: "asc" | "desc" | null) => void; // Adjusted to handle direction
};

const NameFilter: React.FC<NameFilterProps> = ({ toggleSort }) => {
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(
    null
  );

  const handleToggleSort = () => {
    const newDirection = sortDirection === "asc" ? "desc" : "asc";
    setSortDirection(newDirection);
    toggleSort(newDirection);
  };

  const Icon = () => {
    if (sortDirection === "asc") {
      return (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.99988 3.33325L7.99988 13.3333"
            stroke="#03111E"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11.3333 10L8.70707 12.6262C8.37373 12.9596 8.20707 13.1262 7.99996 13.1262C7.79285 13.1262 7.62619 12.9596 7.29285 12.6262L4.66663 10"
            stroke="#03111E"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    } else if (sortDirection === "desc") {
      return (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.99988 3.33325L7.99988 13.3333"
            stroke="#03111E"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4.66663 6L7.29285 3.37377C7.62619 3.04044 7.79285 2.87377 7.99996 2.87377C8.20707 2.87377 8.37373 3.04044 8.70707 3.37377L11.3333 6"
            stroke="#03111E"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    } else {
      return <img src={nameFilterIcon} alt="filter" />;
    }
  };

  return (
    <div
      className="p-2 hover:bg-gray-50 mt-[-4px] rounded-full ml-1 cursor-pointer"
      onClick={handleToggleSort}
    >
      <Icon />
    </div>
  );
};

export default NameFilter;
