import React from "react";
import {
  disableIcon,
  downloadIcon,
  movetobinIcon,
  renameIcon,
  shareIcon,
  starredIcon,
} from "../../../helpers/dropdownIcons";
import { File } from "../../../Types"; // Assuming this is the type definition for your files

interface HoverOptionsProps {
  file: File;
  hoveredItemId: number | null;
  renameHandler: (filename: string) => void;
  deleteHandler: (fileId: string) => void; // Assuming you need the file ID for deletion
  disableHandler: (fileId: number) => void;
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
      className={`flex gap-x-1 md:mr-4 ${
        hoveredItemId === file.id ? "visible" : "invisible"
      }`}
    >
      <img
        src={shareIcon}
        className="ml-6 cursor-pointer"
        alt="Share"
        onClick={() => shareHandler()}
      />
      <img src={downloadIcon} className="ml-4 cursor-pointer" alt="Download" />
      <img
        src={renameIcon}
        className="ml-4 cursor-pointer"
        alt="Rename"
        onClick={() => renameHandler(file.name)}
      />
      <img src={starredIcon} className="ml-4 cursor-pointer" alt="Star" />
      <img
        src={movetobinIcon}
        className="ml-4 cursor-pointer"
        alt="Move to bin"
        onClick={() => deleteHandler(file.id.toString())} // Example of passing the file ID
      />
      <img
        src={disableIcon}
        className="ml-4 cursor-pointer"
        alt="Disable"
        onClick={() => disableHandler(file.id)}
      />
    </div>
  );
};

export default HoverOptions;
