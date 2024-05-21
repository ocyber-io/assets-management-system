import React from "react";
import { RxCross1 } from "react-icons/rx";
import {
  disableIcon,
  downloadIcon,
  moreIcon,
  movetobinIcon,
  renameIcon,
  //   restoreIcon,
  selectAllIcon,
} from "../../../helpers/dropdownIcons";

interface SelectedFolderActionsProps {
  selectedFoldersCount: number;
  deselectAll: () => void;
  selectAll: () => void;
  selectedFolders: string[];
}

const SelectedFolderActions: React.FC<SelectedFolderActionsProps> = ({
  selectedFoldersCount,
  deselectAll,
  selectAll,
}) => {
  return (
    <>
      {selectedFoldersCount > 0 && (
        <>
          <div className="flex bg-blue-50 p-2 rounded w-full">
            <div className="flex w-full">
              <div className="p-1">
                <RxCross1
                  onClick={deselectAll}
                  className="cursor-pointer ml-2 mr-4 mt-1 md:h-4 h-3 md:w-4 w-3"
                />
              </div>
              <span className="ml-1 md:mt-0.5 mt-1 font-semibold md:text-base text-xs whitespace-nowrap">
                {selectedFoldersCount} Selected
              </span>
              <div className="flex bg-blue-50 p-2 rounded w-full">
                <img
                  src={downloadIcon}
                  className="ml-4 cursor-pointer"
                  alt="Download"
                />
                <img
                  src={renameIcon}
                  className={`ml-4 ${
                    selectedFoldersCount > 1 ? "hidden" : "cursor-pointer"
                  }`}
                  alt="Rename"
                  onClick={
                    selectedFoldersCount === 1
                      ? () => console.log("Rename")
                      : undefined
                  }
                />
                {/* <img
                  src={restoreIcon}
                  className="ml-4 cursor-pointer"
                  alt="Restore"
                  onClick={() => {
                    // Handle Restore action
                  }}
                /> */}
                <img
                  src={movetobinIcon}
                  className="ml-4 cursor-pointer"
                  alt="Move to bin"
                  onClick={() => {
                    // Handle Move to bin action
                  }}
                />
                <img
                  src={disableIcon}
                  className="ml-4 cursor-pointer"
                  alt="Disable"
                  onClick={() => {
                    // Handle Disable action
                  }}
                />
              </div>
            </div>

            <div className="flex">
              <img
                src={selectAllIcon}
                className="md:ml-4 mx-2 cursor-pointer"
                alt="Select All"
                onClick={selectAll}
              />
              <img
                src={moreIcon}
                className="md:ml-4 mx-2 cursor-pointer"
                alt="More"
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SelectedFolderActions;
