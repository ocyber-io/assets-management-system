import React, { useEffect, useMemo, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { File, SelectedFile } from "../../../Types";
import fileIcon from "../../../assets/icons/file.svg";
import { copylinkIcon, fullLinkIcon } from "../../../helpers/dropdownIcons";
import { formatDate } from "../../../utils/helpers";
import HoverOptions from "./HoverOptions";
import RecentFilesDropdown from "./RecentFilesDropdown";
import NameFilter from "./NameFilter";
import {
  fetchFiles,
  toggleFileFavorite,
} from "../../../reducers/file/fileThunks";
import { jwtDecode } from "jwt-decode";
import { AppDispatch } from "../../../stores/store";
import { useDispatch } from "react-redux";
import { showErrorToast, showSuccessToast } from "../../../utils/toast";

type FilesTableProps = {
  files: File[] | undefined;
  selectedFiles: SelectedFile[];
  toggleSelection: (
    id: string,
    fileName: string,
    fileLink: string,
    isFavorite: boolean | undefined
  ) => void;
  hoveredItemId: string | null;
  setHoveredItemId: (id: string | null) => void;
  hoverLinkId: string | null;
  setHoverLinkId: (id: string | null) => void;
  openDropdownId: string | null;
  toggleDropdown: (id: string) => void;
  copyToClipboard: (link: string) => void;
  fullLinkHandler: (link: string) => void;
  renameHandler: (filename: string, fileId: string) => void;
  deleteHandler: (fileId: string) => void;
  deleteConfirmationHandler: (fileId: string) => void;
  restoreHandler: (fileId: string, filename: string, filesize: string) => void;
  enableHandler: (fileId: string) => void;
  removeFromFolderHandler: (fileId: string) => void;
  fileInformationHandler: (fileDetails: File) => void;
  shareHandler: (fileLink: string, fileId: string) => void;
  moveToFolderHandler: (fileLink: string) => void;
  replaceHandler: (fileDetails: File) => void;
  disableHandler: (id: string) => void;
  showFullLink?: boolean;
  fromTrash?: boolean;
  fromFavorites?: boolean;
  fromFolders?: boolean;
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
  showFullLink,
  enableHandler,
  fromTrash,
  fromFavorites,
  deleteConfirmationHandler,
  restoreHandler,
  moveToFolderHandler,
  fromFolders,
  removeFromFolderHandler,
}) => {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const token = localStorage.getItem("token");
  const dispatch = useDispatch<AppDispatch>();
  const [userId, setUserId] = useState<string>();

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<{
          id: string;
        }>(token);
        if (decoded) {
          setUserId(decoded.id);
        }
      } catch (error) {
        console.error("Failed to decode JWT:", error);
      }
    }
  }, [token]);

  const fetchFileDetails = async () => {
    if (userId) await dispatch(fetchFiles(userId));
  };
  const toggleFavoriteFiles = async (
    fileId: string,
    isFavorite: boolean | undefined
  ) => {
    try {
      if (isFavorite) {
        await dispatch(toggleFileFavorite(fileId)).unwrap();
        showSuccessToast("File removed from Favorites successfully");
      } else {
        await dispatch(toggleFileFavorite(fileId)).unwrap();
        showSuccessToast("File added to Favorites successfully");
      }
      fetchFileDetails();
    } catch (error: any) {
      showErrorToast(error || "An error occurred while toggling favorite.");
    }
  };
  const toggleSort = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const sortedFiles = useMemo(() => {
    if (!files) {
      return;
    }
    if (sortOrder === "asc") {
      return [...files].sort((a, b) =>
        a.originalName.localeCompare(b.originalName)
      );
    } else if (sortOrder === "desc") {
      return [...files].sort((a, b) =>
        b.originalName.localeCompare(a.originalName)
      );
    }
    return files; // No sorting applied
  }, [files, sortOrder]);
  return (
    <>
      <table className="w-full text-left border-collapse text-gray-600">
        <thead>
          <tr className="bg-transparent border-b-2">
            <th className="py-2 md:px-4 px-1   border-gray-300"></th>
            <th className="py-2 flex md:px-4 px-1 xl:w-72 md:w-48 w-32 border-gray-300">
              Name
              <NameFilter toggleSort={toggleSort} />
            </th>
            <th className="py-2 md:px-4 px-1 md:whitespace-nowrap border-gray-300 ">
              <div className="md:block hidden">Last Modified</div>
            </th>
            <th className="py-2 md:px-4 px-1 xl:w-72 md:w-56 w-32 ml-4 border-gray-300">
              Link
            </th>
            <th className="py-2 md:px-4 px-1 md:whitespace-nowrap  border-gray-300 ">
              <div className="md:block hidden">File Size</div>
            </th>
            <th className="py-2 md:px-4 px-1   border-gray-300 text-center"></th>
          </tr>
        </thead>

        <tbody>
          {sortedFiles &&
            sortedFiles.map((file, index) => (
              <React.Fragment key={index}>
                <tr
                  key={file._id}
                  onMouseEnter={() => setHoveredItemId(file._id)}
                  onMouseLeave={() => setHoveredItemId(null)}
                  className={`${index % 2 === 0 ? "bg-white" : "bg-blue-50"}`}
                >
                  <td className="md:px-4 px-1 py-3">
                    <input
                      type="checkbox"
                      checked={selectedFiles.some(
                        (selectedFile) => selectedFile.id === file._id
                      )}
                      onChange={() =>
                        toggleSelection(
                          file._id,
                          file.originalName,
                          file.link,
                          file.isFavorite
                        )
                      }
                      disabled={file.isDisabled}
                    />
                  </td>
                  <td className="md:px-4 px-1 py-3 md:w-48 w-24 overflow-hidden">
                    <div className="flex items-center break-words max-w-xs">
                      <div className="flex">
                        <img
                          src={fileIcon}
                          className={`mr-2 ${file.isDisabled && "opacity-30"}`}
                          alt="File Icon"
                        />
                        <div>
                          <p
                            className={`md:text-md text-sm md:font-medium ${
                              file.isDisabled && "opacity-30"
                            }`}
                          >
                            {file.originalName}
                          </p>
                          <p
                            className={`text-xs md:hidden  text-gray-400 ${
                              file.isDisabled && "opacity-30"
                            }`}
                          >
                            {formatDate(file.updatedAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="md:px-4 px-1 py-3 md:w-48 w-24 overflow-hidden">
                    <div className="items-center break-words max-w-xs md:block hidden">
                      <p
                        className={`md:text-md text-sm ${
                          file.isDisabled && "opacity-30"
                        }`}
                      >
                        {formatDate(file.updatedAt)}
                      </p>
                    </div>
                  </td>
                  <td
                    className={`md:px-4 px-1 py-3 relative ${
                      file.isDisabled && "opacity-30"
                    }`}
                  >
                    <div
                      className="flex flex-col items-center"
                      onMouseEnter={() => {
                        if (!file.isDisabled) {
                          setHoverLinkId(file._id);
                        }
                      }}
                      onMouseLeave={() => {
                        if (!file.isDisabled) setHoverLinkId(null);
                      }}
                      onClick={() => {
                        if (!file.isDisabled) setHoverLinkId(file._id);
                      }}
                    >
                      <a
                        className={`text-blue-500 hover:text-blue-600 ${
                          file.isDisabled ? "" : "cursor-pointer"
                        } max-w-xs break-words xl:w-72 md:48 w-32`}
                      >
                        {showFullLink ? file.fullLink : file.link}
                      </a>
                      {hoverLinkId === file._id && (
                        <div className="absolute md:bottom-10 md:left-6 flex flex-col bg-white shadow-md rounded">
                          <button
                            onClick={() => copyToClipboard(file.fullLink)}
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
                            onClick={() => fullLinkHandler(file.fullLink)}
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
                  <td
                    className={`md:px-4 px-1 py-3 md:w-48 w-24 overflow-hidden ${
                      file.isDisabled && "opacity-30"
                    }`}
                  >
                    <div
                      className={`items-center break-words max-w-xs md:block hidden ${
                        file.isDisabled && "opacity-30"
                      }`}
                    >
                      <p className="md:text-md text-sm ">{file.size}</p>
                    </div>
                  </td>
                  <td className="py-3 text-center relative md:w-64 w-24">
                    <div className="flex justify-end">
                      <div
                        className={`hidden lg:block ${
                          !fromTrash && "md:mr-16"
                        } `}
                      >
                        {selectedFiles.length === 0 && (
                          <HoverOptions
                            file={file}
                            hoveredItemId={hoveredItemId}
                            renameHandler={renameHandler}
                            deleteHandler={deleteHandler}
                            disableHandler={disableHandler}
                            shareHandler={shareHandler}
                            enableHandler={enableHandler}
                            deleteConfirmationHandler={
                              deleteConfirmationHandler
                            }
                            restoreHandler={restoreHandler}
                            removeFromFolderHandler={removeFromFolderHandler}
                            fromTrash={fromTrash}
                            fromFavorites={fromFavorites}
                            fromFolders={fromFolders}
                            toggleFavoriteFiles={toggleFavoriteFiles}
                          />
                        )}
                      </div>
                      <div className="">
                        <button
                          className={`text-gray-500 hover:text-gray-700 focus:outline-none ${
                            openDropdownId === file._id
                              ? "bg-white rounded-full p-2 shadow "
                              : "p-2 bg-transparent"
                          }`}
                          onClick={() => toggleDropdown(file._id)}
                        >
                          <BsThreeDotsVertical />
                        </button>
                      </div>
                    </div>
                    {selectedFiles.length === 0 && (
                      <RecentFilesDropdown
                        file={file}
                        hoveredItemId={hoveredItemId}
                        isOpen={openDropdownId === file._id}
                        toggleDropdown={() => toggleDropdown(file._id)}
                        fileInformationHandler={fileInformationHandler}
                        shareHandler={shareHandler}
                        replaceHandler={replaceHandler}
                        deleteHandler={deleteHandler}
                        renameHandler={renameHandler}
                        disableHandler={disableHandler}
                        enableHandler={enableHandler}
                        copyToClipboard={copyToClipboard}
                        fromTrash={fromTrash}
                        fromFavorites={fromFavorites}
                        moveToFolderHandler={moveToFolderHandler}
                        deleteConfirmationHandler={deleteConfirmationHandler}
                        restoreHandler={restoreHandler}
                        removeFromFolderHandler={removeFromFolderHandler}
                        toggleFavoriteFiles={toggleFavoriteFiles}
                        fromFolders={fromFolders}
                      />
                    )}
                  </td>
                </tr>
              </React.Fragment>
            ))}
        </tbody>
      </table>
    </>
  );
};

export default FilesTable;
