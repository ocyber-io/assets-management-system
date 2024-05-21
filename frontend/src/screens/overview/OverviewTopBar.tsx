import React from "react";
import viewIcon from "../../assets/icons/dashboardSquare.svg";
import sortIcon from "../../assets/icons/sortArrow.svg";

// Define a type for the props
type OverviewTopBarProps = {
  heading?: string;
  isSorted?: boolean;
  sortHandler?: () => void;
};

// Use the type for the component props
const OverviewTopBar: React.FC<OverviewTopBarProps> = ({
  heading,
  isSorted,
  sortHandler,
}) => {
  return (
    <div className="mt-2 px-6 py-4 flex justify-between flex-col md:flex-row items-center w-full">
      {heading && (
        <h1 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 md:mb-0 md:block hidden">
          {heading}
        </h1>
      )}

      <div className="flex gap-x-2">
        <button
          onClick={sortHandler}
          className={`text-gray-600 ${
            isSorted ? "bg-blue-100" : "bg-gray-100"
          }  hover:bg-blue-100 flex items-center font-semibold px-3 py-1.5 rounded-md mr-2`}
        >
          <img src={sortIcon} alt="Sort" className="mr-2" />
          <span className="text-xs md:text-sm">Sort</span>
        </button>
        <button className="text-gray-600 bg-gray-100 hover:bg-gray-200 flex items-center font-semibold px-3 py-1.5 rounded-md">
          <img src={viewIcon} alt="View" className="mr-2" />
          <span className="text-xs md:text-sm">View</span>
        </button>
      </div>
    </div>
  );
};

export default OverviewTopBar;
