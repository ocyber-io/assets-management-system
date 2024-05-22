import { saveAs } from "file-saver";
import JSZip from "jszip";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { BsFillFolderFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Folder } from "../../../Types";
import DeleteFolderModal from "../../../components/shared/DeleteFolderModal";
import ChangeColorModal from "../../../components/shared/folder-modals/ChangeColorModal";
import DeleteFolderFromBinModal from "../../../components/shared/folder-modals/DeleteFolderFromBinModal";
import RenameFolderModal from "../../../components/shared/folder-modals/RenameFolder";
import RestoreFolderModal from "../../../components/shared/folder-modals/RestoreFolderModal";
import {
  downloadIcon,
  moreIcon,
  movetobinIcon,
  restoreIcon,
} from "../../../helpers/dropdownIcons";
import { folderColorIcon, renameFolderIcon } from "../../../helpers/icons";
import { fetchFiles } from "../../../reducers/file/fileThunks";
import { selectFolders } from "../../../reducers/folder/folderSlice";
import {
  getFolderById,
  getFoldersByUserId,
} from "../../../reducers/folder/folderThunk";
import { AppDispatch } from "../../../stores/store";
import { formatDate } from "../../../utils/helpers";
import FoldersDropdown from "./FoldersDropDown";
import SelectedFolderActions from "./SelectedFolderActions";
import DeleteMultipleFoldersModal from "../../../components/shared/folder-modals/DeleteMultipleFoldersModal";
import DeleteMultipleFoldersConfirmationModal from "../../../components/shared/folder-modals/DeleteMultipleFoldersConfirmationModal";
import RestoreMultipleFoldersModal from "../../../components/shared/folder-modals/RestoreMultipleFoldersModal";

type MyFoldersProps = {
  deletedFolders: Folder[];
  fromTrash?: boolean;
};

const MyFolders: React.FC<MyFoldersProps> = ({ deletedFolders, fromTrash }) => {
  const navigate = useNavigate();
  const folders = useSelector(selectFolders);
  const token = localStorage.getItem("token");
  const dispatch = useDispatch<AppDispatch>();
  const [folderId, setFolderId] = useState<string | null>(null);
  const [folderName, setFolderName] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>();
  const [showDeleteFolderModal, setShowDeleteFolderModal] =
    useState<boolean>(false);
  const [showDeleteMultipleFoldersModal, setShowDeleteMultipleFoldersModal] =
    useState<boolean>(false);
  const [
    showDeleteMultipleFoldersConfirmationModal,
    setShowDeleteMultipleFoldersConfirmationModal,
  ] = useState<boolean>(false);
  const [showRestoreFolderModal, setShowRestoreFolderModal] =
    useState<boolean>(false);
  const [showMultipleRestoreFoldersModal, setShowMultipleRestoreFoldersModal] =
    useState<boolean>(false);
  const [showDeleteFolderFromBinModal, setShowDeleteFolderFromBinModal] =
    useState<boolean>(false);
  const [showRenameFolderModal, setShowRenameFolderModal] =
    useState<boolean>(false);
  const [showChangeFolderColorModal, setShowChangeFolderColorModal] =
    useState<boolean>(false);
  const [selectedFolders, setSelectedFolders] = useState<string[]>([]);
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const toggleDeleteFolderModal = () => {
    setShowDeleteFolderModal(!showDeleteFolderModal);
  };
  const toggleDeleteMultipleFoldersModal = () => {
    setShowDeleteMultipleFoldersModal(!showDeleteMultipleFoldersModal);
  };
  const toggleDeleteMultipleFoldersConfirmationModal = () => {
    setShowDeleteMultipleFoldersConfirmationModal(
      !showDeleteMultipleFoldersConfirmationModal
    );
  };
  const toggleRestoreFolderModal = () => {
    setShowRestoreFolderModal(!showRestoreFolderModal);
  };
  const toggleMultipleRestoreFoldersModal = () => {
    setShowMultipleRestoreFoldersModal(!showMultipleRestoreFoldersModal);
  };
  const toggleDeleteFolderFromBinModal = () => {
    setShowDeleteFolderFromBinModal(!showDeleteFolderFromBinModal);
  };
  const toggleRenameFolderModal = () => {
    setShowRenameFolderModal(!showRenameFolderModal);
  };
  const toggleChangeFolderColorModal = () => {
    setShowChangeFolderColorModal(!showChangeFolderColorModal);
  };

  const deleteHandler = (folderId: string) => {
    toggleDeleteFolderModal();
    setFolderId(folderId);
  };
  const deleteMultipleFoldersHandler = () => {
    toggleDeleteMultipleFoldersModal();
  };
  const deleteMultipleFoldersConfirmationHandler = () => {
    toggleDeleteMultipleFoldersConfirmationModal();
  };

  const restoreFolderHandler = (folderId: string) => {
    toggleRestoreFolderModal();
    setFolderId(folderId);
  };
  const restoreMultipleFoldersHandler = () => {
    toggleMultipleRestoreFoldersModal();
  };
  const deleteFolderFromBinHandler = (folderId: string) => {
    toggleDeleteFolderFromBinModal();
    setFolderId(folderId);
  };

  const RenameHandler = (folderId: string, folderName: string) => {
    toggleRenameFolderModal();
    setFolderId(folderId);
    setFolderName(folderName);
  };
  const changeColorHandler = (folderId: string) => {
    toggleChangeFolderColorModal();
    setFolderId(folderId);
  };

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<{ id: string }>(token);
        if (decoded) {
          setUserId(decoded.id);
        }
      } catch (error) {
        console.error("Failed to decode JWT:", error);
      }
    }
  }, [token]);

  const fetchFolders = async () => {
    if (userId) {
      try {
        await dispatch(getFoldersByUserId(userId));
      } catch (error) {
        console.error("Error fetching folders:", error);
      }
    }
  };

  const fetchAllFiles = async () => {
    if (userId) {
      try {
        await dispatch(fetchFiles(userId));
      } catch (error) {
        console.error("Error fetching folders:", error);
      }
    }
  };

  const folderHandler = (folderId: string) => {
    navigate(`/folders/${folderId}`);
  };

  const toggleFolderSelection = (folderId: string) => {
    setSelectedFolders((prevSelectedFolders) => {
      if (prevSelectedFolders.includes(folderId)) {
        return prevSelectedFolders.filter((id) => id !== folderId);
      } else {
        return [...prevSelectedFolders, folderId];
      }
    });
  };

  const isSelected = (folderId: string) => {
    return selectedFolders.includes(folderId);
  };

  const deselectAll = () => {
    setSelectedFolders([]);
  };

  const selectAll = () => {
    let filteredFolderIds;
    if (fromTrash) {
      // Select only folders from trash whose isDeleted is true
      filteredFolderIds = folders
        .filter((folder) => folder.isDeleted)
        .map((folder) => folder._id);
    } else {
      // Select only folders not from trash whose isDeleted is false
      filteredFolderIds = folders
        .filter((folder) => !folder.isDeleted)
        .map((folder) => folder._id);
    }
    setSelectedFolders(filteredFolderIds);
  };
  const handleItemHover = (folderId: string) => {
    setHoveredItemId(folderId);
  };

  const handleItemLeave = () => {
    setHoveredItemId(null);
  };

  const toggleDropdown = (folderId: string) => {
    setOpenDropdownId(openDropdownId === folderId ? null : folderId);
  };

  const fetchFolder = async () => {
    if (!folderId) return;
    await dispatch(getFolderById(folderId));
  };

  useEffect(() => {
    fetchFolder();
  }, []);

  const handleDownloadFolder = async (folder: Folder, files: any[]) => {
    const zip = new JSZip();
    const folderZip = zip.folder(folder.folderName);

    const fetchFileContent = async (fileUrl: string) => {
      const response = await fetch(fileUrl);
      return await response.blob();
    };

    const filePromises = files.map(async (file) => {
      const fileContent = await fetchFileContent(file.fullLink);
      folderZip?.file(file.originalName, fileContent);
    });

    await Promise.all(filePromises);

    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, `${folder.folderName}.zip`);
    });
  };

  return (
    <div className="">
      <h1
        className={`${
          fromTrash
            ? "text-md font-medium text-gray-600"
            : "text-lg font-bold text-gray-800"
        }  px-6 pt-4  mb-6 `}
      >
        {fromTrash ? "Deleted Folders" : "My Folders"}
      </h1>
      <SelectedFolderActions
        selectedFoldersCount={selectedFolders.length}
        deselectAll={deselectAll}
        selectAll={selectAll}
        selectedFolders={selectedFolders}
        fromTrash={fromTrash}
        deleteMultipleFoldersHandler={deleteMultipleFoldersHandler}
        deleteMultipleFoldersConfirmationHandler={
          deleteMultipleFoldersConfirmationHandler
        }
        restoreMultipleFoldersHandler={restoreMultipleFoldersHandler}
      />
      <div className="">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="">
            <tr>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2 pl-4 ml-4"></th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider xl:w-1/4">
                Folder Name
              </th>
              <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider xl:w-1/6">
                Last Modified
              </th>
              <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider xl:w-1/4">
                Created At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider xl:w-1/6">
                Files
              </th>
              <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider xl:w-1/5"></th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider xl:w-1/6"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {deletedFolders
              ? deletedFolders.map((folder, index) => (
                  <tr
                    key={folder._id}
                    onMouseEnter={() => handleItemHover(folder._id)}
                    onMouseLeave={handleItemLeave}
                    className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}
                  >
                    <td className="w-2 pl-4 ml-4">
                      <input
                        type="checkbox"
                        checked={isSelected(folder._id)}
                        onChange={() => toggleFolderSelection(folder._id)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap ">
                      <div className="flex items-center">
                        <div className="">
                          <BsFillFolderFill
                            size={24}
                            color={folder.folderColor}
                            className="opacity-85"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-lg font-semibold text-gray-700">
                            {folder.folderName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(folder.updatedAt)}
                    </td>
                    <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(folder.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {folder.files.length}
                    </td>
                    <td className="hidden lg:table-cell">
                      {hoveredItemId === folder._id && (
                        <div className="flex justify-end">
                          <button
                            aria-label="Delete folder"
                            className="mr-3"
                            onClick={() =>
                              deleteFolderFromBinHandler(folder._id)
                            }
                          >
                            <img
                              src={movetobinIcon}
                              className="ml-2"
                              alt="Move to bin"
                            />
                          </button>
                          <button
                            aria-label="Restore folder"
                            className="mr-3"
                            onClick={() => restoreFolderHandler(folder._id)}
                          >
                            <img
                              src={restoreIcon}
                              className="ml-2"
                              alt="Restore folder"
                            />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="whitespace-nowrap text-right text-sm font-medium relative">
                      <img
                        src={moreIcon}
                        className="mr-4 pr-2 mx-2 cursor-pointer"
                        alt="More"
                        onClick={() => toggleDropdown(folder._id)}
                      />
                      {openDropdownId === folder._id && (
                        <FoldersDropdown
                          isOpen={true}
                          toggleDropdown={() => toggleDropdown(folder._id)}
                          hoveredItemId={hoveredItemId}
                          onDeleteFolder={deleteHandler}
                          deleteFolderFromBinHandler={
                            deleteFolderFromBinHandler
                          }
                          folderId={folder._id}
                          folderName={folder.folderName}
                          renameHandler={RenameHandler}
                          changeColorHandler={changeColorHandler}
                          fromTrash={fromTrash}
                          restoreFolderHandler={restoreFolderHandler}
                          folderForDropDown={folder}
                          filesForDropDown={folder.files}
                          handleDownloadFolder={handleDownloadFolder}
                        />
                      )}
                    </td>
                  </tr>
                ))
              : folders
                  .filter((folder) => folder.isDeleted === false)
                  .map((folder, index) => (
                    <tr
                      key={folder._id}
                      onMouseEnter={() => handleItemHover(folder._id)}
                      onMouseLeave={handleItemLeave}
                      className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}
                    >
                      <td className="w-2 pl-4 ml-4">
                        <input
                          type="checkbox"
                          checked={isSelected(folder._id)}
                          onChange={() => toggleFolderSelection(folder._id)}
                        />
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap cursor-pointer"
                        onClick={() => folderHandler(folder._id)}
                      >
                        <div className="flex items-center">
                          <div className="">
                            <BsFillFolderFill
                              size={24}
                              color={folder.folderColor}
                              className="opacity-85"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-lg font-semibold text-gray-700">
                              {folder.folderName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(folder.updatedAt)}
                      </td>
                      <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(folder.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {folder.files.length}
                      </td>
                      <td className="hidden lg:table-cell">
                        {hoveredItemId === folder._id && (
                          <div className="flex justify-end">
                            <button
                              aria-label="Download folder"
                              className="mr-2"
                              onClick={() =>
                                handleDownloadFolder(folder, folder.files)
                              }
                            >
                              <img
                                src={downloadIcon}
                                className="ml-2"
                                alt="Download"
                              />
                            </button>
                            <button
                              aria-label="Rename folder"
                              className="mr-2"
                              onClick={() =>
                                RenameHandler(folder._id, folder.folderName)
                              }
                            >
                              <img
                                src={renameFolderIcon}
                                className="ml-2"
                                alt="Rename"
                              />
                            </button>

                            <button
                              aria-label="Change folder color"
                              className="mr-2"
                              onClick={() => changeColorHandler(folder._id)}
                            >
                              <img
                                src={folderColorIcon}
                                className="ml-2"
                                alt="Change color"
                              />
                            </button>
                            <button
                              aria-label="Move to bin folder"
                              className="mr-3"
                              onClick={() => deleteHandler(folder._id)}
                            >
                              <img
                                src={movetobinIcon}
                                className="ml-2"
                                alt="Move to bin"
                              />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="whitespace-nowrap text-right text-sm font-medium relative">
                        <img
                          src={moreIcon}
                          className="mr-4 pr-2 mx-2 cursor-pointer"
                          alt="More"
                          onClick={() => toggleDropdown(folder._id)}
                        />
                        {openDropdownId === folder._id && (
                          <FoldersDropdown
                            isOpen={true}
                            toggleDropdown={() => toggleDropdown(folder._id)}
                            hoveredItemId={hoveredItemId}
                            onDeleteFolder={deleteHandler}
                            deleteFolderFromBinHandler={
                              deleteFolderFromBinHandler
                            }
                            folderId={folder._id}
                            folderName={folder.folderName}
                            renameHandler={RenameHandler}
                            restoreFolderHandler={restoreFolderHandler}
                            changeColorHandler={changeColorHandler}
                            folderForDropDown={folder}
                            filesForDropDown={folder.files}
                            handleDownloadFolder={handleDownloadFolder}
                          />
                        )}
                      </td>
                    </tr>
                  ))}
          </tbody>
        </table>
      </div>
      {showDeleteFolderModal && (
        <DeleteFolderModal
          heading="Move Folder to bin?"
          description="Do you really want to move this folder to bin? You can restore it later if needed."
          submitButtonText="Yes, Move to bin"
          onClose={toggleDeleteFolderModal}
          folderId={folderId}
          isOpen={showDeleteFolderModal}
          fetchFolders={fetchFolders}
          fetchAllFiles={fetchAllFiles}
        />
      )}
      {showDeleteMultipleFoldersModal && (
        <DeleteMultipleFoldersModal
          heading={`Move ${selectedFolders.length} Folder${
            selectedFolders.length !== 1 ? "s" : ""
          } to bin?`}
          description={`Do you really want to move ${
            selectedFolders.length !== 1 ? "these folders" : "this folder"
          } to bin? You can restore ${
            selectedFolders.length !== 1 ? "them" : "it"
          } later if needed.`}
          submitButtonText="Yes, Move to bin"
          onClose={toggleDeleteMultipleFoldersModal}
          folderIds={selectedFolders}
          isOpen={showDeleteMultipleFoldersModal}
          fetchFolders={fetchFolders}
          fetchAllFiles={fetchAllFiles}
        />
      )}
      {showDeleteMultipleFoldersConfirmationModal && (
        <DeleteMultipleFoldersConfirmationModal
          heading={`Delete ${selectedFolders.length} Folder${
            selectedFolders.length !== 1 ? "s" : ""
          }?`}
          description={`Do you really want to delete ${
            selectedFolders.length !== 1 ? "these folders" : "this folder"
          }? All data inside ${
            selectedFolders.length !== 1 ? "these folders" : "this folder"
          }  will be lost.`}
          submitButtonText="Yes, Delete"
          onClose={toggleDeleteMultipleFoldersConfirmationModal}
          folderIds={selectedFolders}
          isOpen={showDeleteMultipleFoldersConfirmationModal}
          fetchFolders={fetchFolders}
          fetchAllFiles={fetchAllFiles}
        />
      )}

      {showDeleteFolderFromBinModal && (
        <DeleteFolderFromBinModal
          heading="Delete Folder?"
          description="Do you really want to delete this folder? All data inside this folder will be deleted."
          submitButtonText="Yes, Delete"
          onClose={toggleDeleteFolderFromBinModal}
          folderId={folderId}
          isOpen={showDeleteFolderFromBinModal}
          fetchFolders={fetchFolders}
          fetchAllFiles={fetchAllFiles}
        />
      )}
      {showRenameFolderModal && folderName && (
        <RenameFolderModal
          isOpen={showRenameFolderModal}
          onClose={toggleRenameFolderModal}
          folderId={folderId}
          initialFoldername={folderName}
        />
      )}
      {showChangeFolderColorModal && (
        <ChangeColorModal
          isOpen={showChangeFolderColorModal}
          onClose={toggleChangeFolderColorModal}
          onCancel={toggleChangeFolderColorModal}
          folderId={folderId}
        />
      )}
      {showRestoreFolderModal && (
        <RestoreFolderModal
          isOpen={showRestoreFolderModal}
          onClose={toggleRestoreFolderModal}
          folderId={folderId}
          fetchFolders={fetchFolders}
          heading="Restore Folder"
          submitButtonText="Yes, Restore"
          description="Are you sure you want to restore the folder?"
          fetchAllFiles={fetchAllFiles}
        />
      )}
      {showMultipleRestoreFoldersModal && (
        <RestoreMultipleFoldersModal
          isOpen={showMultipleRestoreFoldersModal}
          onClose={toggleMultipleRestoreFoldersModal}
          folderIds={selectedFolders}
          fetchFolders={fetchFolders}
          heading={`Restore ${selectedFolders.length} Folder${
            selectedFolders.length !== 1 ? "s" : ""
          }?`}
          description={`Do you really want to restore ${
            selectedFolders.length !== 1 ? "these folders" : "this folder"
          }? `}
          submitButtonText="Yes, Restore"
          fetchAllFiles={fetchAllFiles}
        />
      )}
    </div>
  );
};

export default MyFolders;
