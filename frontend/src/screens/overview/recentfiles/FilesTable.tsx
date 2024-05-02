import React from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import fileIcon from "../../../assets/icons/file.svg";
import { copylinkIcon, fullLinkIcon } from "../../../helpers/dropdownIcons";
import HoverOptions from "./HoverOptions";
import RecentFilesDropdown from "./RecentFilesDropdown";
import { File } from "../../../Types";

type FilesTableProps = {
  files: File[];
  selectedFiles: string[];
  toggleSelection: (id: string) => void;
  hoveredItemId: number | null;
  setHoveredItemId: (id: number | null) => void;
  hoverLinkId: number | null;
  setHoverLinkId: (id: number | null) => void;
  openDropdownId: string | null;
  toggleDropdown: (id: string) => void;
  copyToClipboard: (link: string) => void;
  fullLinkHandler: (link: string) => void;
  renameHandler: (filename: string) => void;
  deleteHandler: () => void;
  fileInformationHandler: (fileDetails: File) => void;
  shareHandler: () => void;
  replaceHandler: (fileDetails: File) => void;
  disableHandler: (id: number) => void;
};

const FilesTable: React.FC<FilesTableProps> = ({
  files,
  selectedFiles,
  toggleSelection,
  hoveredItemId,
  setHoveredItemId,
  hoverLinkId,
  setHoverLinkId,
  openDropdownId,
  toggleDropdown,
  copyToClipboard,
  fullLinkHandler,
  renameHandler,
  deleteHandler,
  disableHandler,
  fileInformationHandler,
  shareHandler,
  replaceHandler,
}) => {
  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-transparent border-b-2">
          <th className="py-2 md:px-4 px-1   border-gray-300"></th>
          <th className="py-2 md:px-4 px-1 md:w-48 w-32 border-gray-300">
            Name
          </th>
          <th className="py-2 md:px-4 px-1   border-gray-300 md:block hidden">
            Last Modified
          </th>
          <th className="py-2 md:px-4 px-1 md:w-48 w-32 ml-4 border-gray-300">
            Link
          </th>
          <th className="py-2 md:px-4 px-1   border-gray-300 md:block hidden">
            File Size
          </th>
          <th className="py-2 md:px-4 px-1   border-gray-300 text-center"></th>
        </tr>
      </thead>
      <tbody>
        {files.map((file, index) => (
          <tr
            key={file.id}
            onMouseEnter={() => setHoveredItemId(file.id)}
            onMouseLeave={() => setHoveredItemId(null)}
            className={`${index % 2 === 0 ? "bg-white" : "bg-blue-50"}`}
          >
            <td className="md:px-4 px-1 py-3">
              <input
                type="checkbox"
                checked={selectedFiles.includes(file.id.toString())}
                onChange={() => toggleSelection(file.id.toString())}
              />
            </td>
            <td className="md:px-4 px-1 py-3 md:w-48 w-24 overflow-hidden">
              <div className="flex items-center break-words max-w-xs">
                <div className="flex">
                  <img src={fileIcon} className="mr-2" alt="File Icon" />
                  <div>
                    <p className="md:text-md text-sm md:font-medium">
                      {file.name}
                    </p>
                    <p className="text-xs md:hidden  text-gray-400">
                      {file.lastModified}
                    </p>
                  </div>
                </div>
              </div>
            </td>
            <td className="md:px-4 px-1 py-3 md:block hidden">
              {file.lastModified}
            </td>
            <td className="md:px-4 px-1 py-3 relative">
              <div
                className="flex flex-col items-center"
                onMouseEnter={() => setHoverLinkId(file.id)}
                onMouseLeave={() => setHoverLinkId(null)}
                onClick={() => setHoverLinkId(file.id)}
              >
                <a className="text-blue-500 hover:text-blue-600 cursor-pointer max-w-xs break-words md:w-full w-32">
                  {file.link}
                </a>
                {hoverLinkId === file.id && (
                  <div className="absolute md:bottom-10 md:left-6 flex flex-col bg-white shadow-md rounded">
                    <button
                      onClick={() => copyToClipboard(file.link)}
                      className="flex items-center text-xs text-gray-600 px-2 py-1 hover:bg-gray-50"
                    >
                      <img
                        src={copylinkIcon}
                        className="mr-2"
                        alt="Copy Link"
                      />
                      Copy Link
                    </button>
                    <button
                      onClick={() => fullLinkHandler(file.link)}
                      className="flex items-center text-xs text-gray-600 px-2 py-1 hover:bg-gray-50"
                    >
                      <img
                        src={fullLinkIcon}
                        className="mr-2"
                        alt="Full Link"
                      />
                      Full Link
                    </button>
                  </div>
                )}
              </div>
            </td>
            <td className="md:px-4 px-1 py-3 md:block hidden">{file.size}</td>
            <td className="md:pr-4 pr-1 py-3 text-center relative">
              <div className="flex justify-end">
                <div className="hidden md:block">
                  <HoverOptions
                    file={file}
                    hoveredItemId={hoveredItemId}
                    renameHandler={renameHandler}
                    deleteHandler={deleteHandler}
                    disableHandler={disableHandler}
                    shareHandler={shareHandler}
                  />
                </div>
                <button
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  onClick={() => toggleDropdown(file.id.toString())}
                >
                  <BsThreeDotsVertical />
                </button>
              </div>
              <RecentFilesDropdown
                file={file}
                hoveredItemId={hoveredItemId}
                isOpen={openDropdownId === file.id.toString()}
                toggleDropdown={() => toggleDropdown(file.id.toString())}
                fileInformationHandler={fileInformationHandler}
                shareHandler={shareHandler}
                replaceHandler={replaceHandler}
                deleteHandler={deleteHandler}
                renameHandler={renameHandler}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default FilesTable;
