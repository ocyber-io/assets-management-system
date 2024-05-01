import React from "react";
import { RxCross1 } from "react-icons/rx";
import {
  downloadIcon,
  renameIcon,
  shareIcon,
  starredIcon,
  movetobinIcon,
  disableIcon,
  moreIcon,
  selectAllIcon,
} from "../../../helpers/dropdownIcons";

interface SelectedFilesActionsProps {
  selectedFilesCount: number;
  deselectAll: () => void;
  selectAll: () => void;
}

const SelectedFilesActions: React.FC<SelectedFilesActionsProps> = ({
  selectedFilesCount,
  deselectAll,
  selectAll,
}) => {
  if (selectedFilesCount === 0) {
    return null;
  }

  return (
    <div className="flex bg-blue-50 p-2 rounded w-full">
      <div className="flex w-full">
        <div className="p-1">
          <RxCross1
            onClick={deselectAll}
            className="cursor-pointer ml-2 mr-4 mt-1 md:h-4 h-3 md:w-4 w-3"
          />
        </div>
        <span className="ml-1 md:mt-0.5 mt-1 font-semibold md:text-base text-xs whitespace-nowrap">
          {selectedFilesCount} Selected
        </span>
        <img
          src={shareIcon}
          className={`ml-6  ${
            selectedFilesCount > 1 ? "hidden" : "cursor-pointer"
          }`}
          alt="Share"
          onClick={
            selectedFilesCount === 1 ? () => console.log("Share") : undefined
          }
        />
        <img
          src={downloadIcon}
          className="ml-4 cursor-pointer"
          alt="Download"
        />
        <img
          src={renameIcon}
          className={`ml-4  ${
            selectedFilesCount > 1 ? "hidden" : "cursor-pointer"
          }`}
          alt="Rename"
          onClick={
            selectedFilesCount === 1 ? () => console.log("Rename") : undefined
          }
        />
        <div className="md:visible flex invisible">
          <img src={starredIcon} className="ml-4 cursor-pointer" alt="Star" />
          <img
            src={movetobinIcon}
            className="ml-4 cursor-pointer"
            alt="Move to bin"
          />
          <img
            src={disableIcon}
            className="ml-4 cursor-pointer"
            alt="Disable"
          />
        </div>
      </div>
      <div className="flex">
        <img
          src={selectAllIcon}
          className="md:ml-4 mx-2 cursor-pointer"
          alt="Select All"
          onClick={selectAll} // Add onClick handler here
        />
        <img
          src={moreIcon}
          className="md:ml-4 mx-2 cursor-pointer"
          alt="More"
        />
      </div>
    </div>
  );
};

export default SelectedFilesActions;
