import React, { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { RxCross1 } from "react-icons/rx";
import fileIcon from "../../assets/icons/file.svg";
import {
  copylinkIcon,
  disableIcon,
  downloadIcon,
  moreIcon,
  movetobinIcon,
  renameIcon,
  shareIcon,
  starredIcon,
  fullLinkIcon,
} from "../../helpers/dropdownIcons";
import RecentFilesDropdown from "./RecentFilesDropdown";
import Pagination from "./Pagination";
import { File } from "../../Types";
import LinkModal from "../../components/shared/LinkModal";
import WarningModal from "../../components/shared/WarningModal";
import DeleteModal from "../../components/shared/DeleteModal";
import RenameModal from "../../components/shared/RenameModal";

type RecentFilesProps = {
  fullScreenList?: boolean;
  filesPerPage?: number;
  files: File[];
};

const RecentFiles: React.FC<RecentFilesProps> = ({
  fullScreenList = false,
  filesPerPage = 10,
  files,
}) => {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [hoverLinkId, setHoverLinkId] = useState<number | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [hoveredItemId, setHoveredItemId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showLinkModal, setShowLinkModal] = useState<boolean>(false);
  const [showWarningModal, setShowWarningModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showRenameModal, setShowRenameModal] = useState<boolean>(false);
  const [selectedLink, setSelectedLink] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>("");

  const toggleDisableModal = () => {
    setShowWarningModal(!showWarningModal);
  };
  const toggleDeleteModal = () => {
    setShowDeleteModal(!showDeleteModal);
  };
  const toggleRenameModal = () => {
    setShowRenameModal(!showRenameModal);
  };

  useEffect(() => {
    // Reset to first page if filesPerPage changes
    setCurrentPage(1);
  }, [filesPerPage]);

  const lastFileIndex = currentPage * filesPerPage;
  const firstFileIndex = lastFileIndex - filesPerPage;
  const currentFiles = files.slice(firstFileIndex, lastFileIndex);

  const toggleDropdown = (id: string) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const toggleSelection = (id: string) => {
    setSelectedFiles(
      selectedFiles.includes(id)
        ? selectedFiles.filter((selectedId) => selectedId !== id)
        : [...selectedFiles, id]
    );
  };

  const deselectAll = () => {
    setSelectedFiles([]);
  };

  const copyToClipboard = (link: string) => {
    navigator.clipboard.writeText(link).then(
      () => {
        alert("Link copied to clipboard!");
      },
      () => {
        alert("Failed to copy the link.");
      }
    );
  };

  const fullLinkHandler = (link: string) => {
    setSelectedLink(link);
    setShowLinkModal(true);
  };

  const disableHandler = (id: number) => {
    toggleDisableModal();
    console.log(id);
  };

  const deleteHandler = () => {
    toggleDeleteModal();
    console.log(hoveredItemId);
  };

  const renameHandler = (filename: string) => {
    toggleRenameModal();
    setFileName(filename);
  };

  const handleOkAction = () => {
    console.log(fileName && fileName);
  };

  const handleWarningAction = () => {
    console.log("Action taken from Test component");
  };

  return (
    <div className="w-full px-4 pb-6">
      {selectedFiles.length > 0 && (
        <div className="flex bg-blue-50 p-2 rounded">
          <div className="p-1">
            <RxCross1
              onClick={deselectAll}
              className="cursor-pointer ml-2 mr-4 mt-1 md:h-4 h-3 md:w-4 w-3"
            />
          </div>
          <span className="ml-1 md:mt-0.5 mt-1 font-semibold md:text-base text-xs whitespace-nowrap">
            {selectedFiles.length} Selected
          </span>
          <img src={shareIcon} className="ml-6 cursor-pointer" alt="Share" />
          <img
            src={downloadIcon}
            className="ml-4 cursor-pointer"
            alt="Download"
          />
          <img src={renameIcon} className="ml-4 cursor-pointer" alt="Rename" />
          <div className=" md:visible flex invisible">
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
          <img
            src={moreIcon}
            className="md:ml-4 mx-2 cursor-pointer"
            alt="More"
          />
        </div>
      )}
      <div
        className={`overflow-x-auto md:max-w-full max-w-72 ${
          fullScreenList ? "h-screen" : ""
        }`}
      >
        <table className="min-w-full text-left border-collapse">
          {selectedFiles.length === 0 && (
            <thead>
              <tr className="bg-transparent">
                <th className="py-2 px-4 border-b-2 border-gray-300"></th>
                <th className="py-2 px-4 border-b-2 border-gray-300">Name</th>
                <th className="py-2 px-4 border-b-2 border-gray-300">
                  Last Modified
                </th>
                <th className="py-2 px-4 border-b-2 border-gray-300">Link</th>
                <th className="py-2 px-4 border-b-2 border-gray-300">
                  File Size
                </th>
                <th className="py-2 px-4 border-b-2 border-gray-300 text-center"></th>
              </tr>
            </thead>
          )}
          <tbody>
            {currentFiles.map((file: File, index: number) => (
              <>
                <tr
                  key={file.id}
                  onMouseEnter={() => setHoveredItemId(file.id)}
                  onMouseLeave={() => setHoveredItemId(null)}
                  className={`${index % 2 === 0 ? "bg-white" : "bg-blue-50"}`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedFiles.includes(file.id.toString())}
                      onChange={() => toggleSelection(file.id.toString())}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex">
                      <img src={fileIcon} className="mr-2" alt="File Icon" />
                      {file.name}
                    </div>
                  </td>
                  <td className="px-4 py-3">{file.lastModified}</td>
                  <td className="px-4 py-3 relative">
                    <div
                      onMouseEnter={() => setHoverLinkId(file.id)}
                      onMouseLeave={() => setHoverLinkId(null)}
                      className="flex items-center w-2/3 space-x-2"
                    >
                      <a
                        href={file.link}
                        className="text-blue-500 hover:text-blue-600"
                      >
                        {file.link}
                      </a>
                      {hoverLinkId === file.id && (
                        <div className="absolute bottom-9 left-2 flex flex-col bg-white shadow-md rounded">
                          <button
                            onClick={() => copyToClipboard(file.link)}
                            className="flex text-xs  text-gray-600 px-2 py-1  hover:bg-gray-50 "
                            style={{ transition: "all 0.3s" }}
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
                            className=" flex  text-xs bg-white text-gray-600 px-2 py-1  hover:bg-gray-50 "
                            style={{ transition: "all 0.3s" }}
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
                  <td className="px-4 py-3">{file.size}</td>
                  <td className="pr-4 py-3 text-center relative w-1/4">
                    <div className="flex justify-end">
                      <div
                        className={`flex gap-x-1  ${
                          hoveredItemId === file.id ? "visible" : "invisible"
                        }`}
                      >
                        <img
                          src={shareIcon}
                          className="ml-6 cursor-pointer"
                          alt="Share"
                        />
                        <img
                          src={downloadIcon}
                          className="ml-4 cursor-pointer"
                          alt="Download"
                        />
                        <img
                          src={renameIcon}
                          className="ml-4 cursor-pointer"
                          alt="Rename"
                          onClick={() => renameHandler(file.name)}
                        />
                        <img
                          src={starredIcon}
                          className="ml-4 cursor-pointer"
                          alt="Star"
                        />
                        <img
                          src={movetobinIcon}
                          className="ml-4 cursor-pointer"
                          alt="Move to bin"
                          onClick={() => deleteHandler()}
                        />
                        <img
                          src={disableIcon}
                          className="ml-4 cursor-pointer"
                          alt="Disable"
                          onClick={() => disableHandler(file.id)}
                        />
                      </div>
                      <div>
                        <button
                          className="text-gray-500 hover:text-gray-700 ml-4 focus:outline-none"
                          onClick={() => toggleDropdown(file.id.toString())}
                        >
                          <BsThreeDotsVertical />
                        </button>
                      </div>
                    </div>

                    <RecentFilesDropdown
                      isOpen={openDropdownId === file.id.toString()}
                      toggleDropdown={() => toggleDropdown(file.id.toString())}
                    />
                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
        {files.length > 10 && (
          <Pagination
            totalFiles={files.length}
            filesPerPage={filesPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>
      {showLinkModal && selectedLink && (
        <LinkModal
          isOpen={showLinkModal}
          heading="Full Link"
          link={selectedLink}
          closeModal={() => setShowLinkModal(false)}
        />
      )}
      {showWarningModal && (
        <WarningModal
          heading="Disable File?"
          description="Disabling this file will render its link inactive. Any shared links to this file will no longer be accessible to recipients."
          onSubmit={handleWarningAction}
          submitButtonText="Disable"
          onClose={toggleDisableModal}
          isOpen={showWarningModal}
        />
      )}
      {showDeleteModal && (
        <DeleteModal
          heading="Delete File?"
          description="Are you sure you want to delete this file?"
          onSubmit={deleteHandler}
          submitButtonText="Yes, Delete"
          onClose={toggleDeleteModal}
          isOpen={showDeleteModal}
        />
      )}
      {showRenameModal && fileName && (
        <RenameModal
          isOpen={showRenameModal}
          onClose={toggleRenameModal}
          onSubmit={handleOkAction}
          onCancel={toggleRenameModal}
          filename={fileName}
        />
      )}
    </div>
  );
};

export default RecentFiles;
