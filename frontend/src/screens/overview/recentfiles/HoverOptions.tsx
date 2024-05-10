import React from "react";
import {
  disableIcon,
  downloadIcon,
  movetobinIcon,
  renameIcon,
  shareIcon,
  starredIcon,
  EnableIcon,
} from "../../../helpers/dropdownIcons";
import { File } from "../../../Types"; // Assuming this is the type definition for your files

interface HoverOptionsProps {
  file: File;
  hoveredItemId: string | null;
  renameHandler: (filename: string, fileId: string) => void;
  deleteHandler: (fileId: string) => void; // Assuming you need the file ID for deletion
  disableHandler: (fileId: string) => void;
  shareHandler: () => void;
}

const HoverOptions: React.FC<HoverOptionsProps> = ({
  file,
  hoveredItemId,
  renameHandler,
  deleteHandler,
  disableHandler,
  shareHandler,
}) => {
  return (
    <div
      className={`flex gap-x-1 xl:mt-2 md:mr-8 ${
        hoveredItemId === file._id ? "visible" : "invisible"
      }`}
    >
      <img
        src={shareIcon}
        className={`ml-6  ${file.isDisabled ? "opacity-30" : "cursor-pointer"}`}
        alt="Share"
        onClick={() => {
          if (!file.isDisabled) shareHandler();
        }}
      />
      <img
        src={downloadIcon}
        className={`ml-4 ${file.isDisabled ? "opacity-30" : "cursor-pointer"}`}
        alt="Download"
      />
      <img
        src={renameIcon}
        className={`ml-4 ${file.isDisabled ? "opacity-30" : "cursor-pointer"}`}
        alt="Rename"
        onClick={() => {
          if (!file.isDisabled) renameHandler(file.originalName, file._id);
        }}
      />
      <img
        src={starredIcon}
        className={`ml-4 ${file.isDisabled ? "opacity-30" : "cursor-pointer"}`}
        alt="Star"
      />
      <img
        src={movetobinIcon}
        className={`ml-4 ${file.isDisabled ? "opacity-30" : "cursor-pointer"}`}
        alt="Move to bin"
        onClick={() => {
          if (!file.isDisabled) deleteHandler(file._id);
        }}
      />
      {file.isDisabled ? (
        <>
          <img
            src={EnableIcon}
            className="ml-4 cursor-pointer"
            alt="Enable"
            onClick={() => {
              disableHandler(file._id);
            }}
          />
        </>
      ) : (
        <>
          <img
            src={disableIcon}
            className="ml-4 cursor-pointer"
            alt="Disable"
            onClick={() => {
              if (!file.isDisabled) disableHandler(file._id);
            }}
          />
        </>
      )}
    </div>
  );
};

export default HoverOptions;
