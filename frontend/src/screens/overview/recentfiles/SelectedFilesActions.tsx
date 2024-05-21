import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { useDispatch } from "react-redux";
import { SelectedFile } from "../../../Types";
import MultipleDeleteModal from "../../../components/shared/MultipleDeleteModal";
import {
  disableIcon,
  downloadIcon,
  moreIcon,
  movetobinIcon,
  renameIcon,
  restoreIcon,
  selectAllIcon,
  shareIcon,
  starredIcon,
  unstarIcon,
} from "../../../helpers/dropdownIcons";
import {
  fetchFiles,
  toggleMultipleFilesFavorite,
} from "../../../reducers/file/fileThunks";
import { AppDispatch } from "../../../stores/store";
import { showErrorToast, showSuccessToast } from "../../../utils/toast";
import MultipleDeleteConfirmationModal from "../../../components/shared/MultipleDeleteConfirmationModa";
import MultipleRestoreModal from "../../../components/shared/MultipleRestoreModal";
import MultipleDisableModal from "../../../components/shared/MultipleDisableModal";

interface SelectedFilesActionsProps {
  selectedFilesCount: number;
  deselectAll: () => void;
  selectAll: () => void;
  selectedFiles: SelectedFile[];
  fromFavorites?: boolean;
  fromTrash?: boolean;
  fetchAllFiles: () => void;
}

const SelectedFilesActions: React.FC<SelectedFilesActionsProps> = ({
  selectedFilesCount,
  deselectAll,
  selectAll,
  selectedFiles,
  fromFavorites,
  fetchAllFiles,
  fromTrash,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const token = localStorage.getItem("token");
  const [userId, setUserId] = useState<string>();
  const [filesIds, setFileIds] = useState<string[]>();
  const [showMultipleDeleteModal, setShowMultipleDeleteModal] =
    useState<boolean>(false);
  const [
    showMultipleDeleteConfirmationModal,
    setShowMultipleDeleteConfirmationModal,
  ] = useState<boolean>(false);
  const [showMultipleRestoreModal, setShowMultipleRestoreModal] =
    useState<boolean>(false);
  const [showMultipleDisableModal, setShowMultipleDisableModal] =
    useState<boolean>(false);

  const toggleMultipleDeleteModal = () => {
    setShowMultipleDeleteModal(!showMultipleDeleteModal);
  };
  const toggleMultipleDeleteConfirmationModal = () => {
    setShowMultipleDeleteConfirmationModal(
      !showMultipleDeleteConfirmationModal
    );
  };
  const toggleMultipleRestoreModal = () => {
    setShowMultipleRestoreModal(!showMultipleRestoreModal);
  };
  const toggleMultipleDisableModal = () => {
    setShowMultipleDisableModal(!showMultipleDisableModal);
  };
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

  const fetchFileDetails = () => {
    if (userId) dispatch(fetchFiles(userId));
  };

  if (selectedFilesCount === 0) {
    return null;
  }

  const downloadHandler = (files: SelectedFile[]) => {
    console.log(files);

    if (files.length === 0) {
      return;
    } else {
      files.forEach((file) => {
        const link = document.createElement("a");
        link.href = file.id;
        link.setAttribute("download", file.originalName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    }
  };

  const handleMultipleFavorites = async (files: SelectedFile[]) => {
    try {
      // Filter files where isFavorite is not already true, then extract their IDs
      const fileIds = files
        .filter((file) => !file.isFavorite) // Filter out files where isFavorite is already true
        .map((file) => file.id); // Extract the IDs of remaining files

      if (fileIds.length === 0 && files.length === 0) {
        showErrorToast("No Files were selcted");
        return;
      } else if (files.length > 0 && fileIds.length === 0) {
        showErrorToast("Files already added to favorites");
        return;
      }
      await dispatch(toggleMultipleFilesFavorite(fileIds)).unwrap();
      showSuccessToast(
        `${fileIds.length} file${
          fileIds.length > 1 ? "s" : ""
        } marked as favorite`
      );
      fetchFileDetails();
      deselectAll();
    } catch (error: any) {
      showErrorToast("Error handling multiple favorites");
    }
  };

  const handleRemoveMultipleFavorites = async (files: SelectedFile[]) => {
    try {
      const fileIds = files.map((file) => file.id);
      await dispatch(toggleMultipleFilesFavorite(fileIds)).unwrap();
      showSuccessToast(
        `${fileIds.length} file${
          fileIds.length > 1 ? "s" : ""
        } removed from favorites`
      );
      fetchFileDetails();
      deselectAll();
    } catch (error: any) {
      showErrorToast("Error handling multiple favorites");
    }
  };

  const handleDeleteModal = (files: SelectedFile[]) => {
    const fileIds = files.map((file) => file.id);
    setFileIds(fileIds);
    toggleMultipleDeleteModal();
  };
  const handleDeleteConfirmationModal = (files: SelectedFile[]) => {
    const fileIds = files.map((file) => file.id);
    setFileIds(fileIds);
    toggleMultipleDeleteConfirmationModal();
  };
  const handleMultipleRestoreModal = (files: SelectedFile[]) => {
    const fileIds = files.map((file) => file.id);
    setFileIds(fileIds);
    toggleMultipleRestoreModal();
  };
  const handleDisableModal = (files: SelectedFile[]) => {
    const fileIds = files.map((file) => file.id);
    setFileIds(fileIds);
    toggleMultipleDisableModal();
  };

  return (
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
            {selectedFilesCount} Selected
          </span>
          {!fromTrash && (
            <>
              <img
                src={shareIcon}
                className={`ml-6  ${
                  selectedFilesCount > 1 ? "hidden" : "cursor-pointer"
                }`}
                alt="Share"
                onClick={
                  selectedFilesCount === 1
                    ? () => console.log("Share")
                    : undefined
                }
              />
              <img
                src={downloadIcon}
                className="ml-4 cursor-pointer"
                alt="Download"
                onClick={() => {
                  downloadHandler(selectedFiles);
                }}
              />
              <img
                src={renameIcon}
                className={`ml-4  ${
                  selectedFilesCount > 1 ? "hidden" : "cursor-pointer"
                }`}
                alt="Rename"
                onClick={
                  selectedFilesCount === 1
                    ? () => console.log("Rename")
                    : undefined
                }
              />
            </>
          )}

          <div className="md:visible flex invisible">
            {!fromTrash && (
              <>
                {fromFavorites ? (
                  <img
                    src={unstarIcon}
                    className="ml-4 cursor-pointer"
                    alt="Star"
                    onClick={() => handleRemoveMultipleFavorites(selectedFiles)}
                  />
                ) : (
                  <img
                    src={starredIcon}
                    className="ml-4 cursor-pointer"
                    alt="Star"
                    onClick={() => handleMultipleFavorites(selectedFiles)}
                  />
                )}
              </>
            )}

            {fromTrash && (
              <img
                src={restoreIcon}
                className="ml-4 cursor-pointer"
                alt="Restore"
                onClick={() => {
                  handleMultipleRestoreModal(selectedFiles);
                }}
              />
            )}
            {fromTrash ? (
              <img
                src={movetobinIcon}
                className="ml-4 cursor-pointer"
                alt="Move to bin"
                onClick={() => handleDeleteConfirmationModal(selectedFiles)}
              />
            ) : (
              <img
                src={movetobinIcon}
                className="ml-4 cursor-pointer"
                alt="Move to bin"
                onClick={() => handleDeleteModal(selectedFiles)}
              />
            )}
            {!fromTrash && (
              <img
                src={disableIcon}
                className="ml-4 cursor-pointer"
                alt="Disable"
                onClick={() => handleDisableModal(selectedFiles)}
              />
            )}
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
      {showMultipleDeleteModal && (
        <MultipleDeleteModal
          heading="Move to bin?"
          description={`Do you really want to move these ${filesIds?.length} files to the bin? You can restore them later if needed.`}
          submitButtonText="Yes, Move to bin"
          onClose={toggleMultipleDeleteModal}
          isOpen={showMultipleDeleteModal}
          fetchAllFiles={fetchAllFiles}
          filesIds={filesIds}
          deselectAll={deselectAll}
        />
      )}
      {showMultipleDeleteConfirmationModal && (
        <MultipleDeleteConfirmationModal
          heading="Delete files?"
          description={`Do you really want to delete these ${filesIds?.length} files? This process cannot be undone.`}
          submitButtonText="Yes, Move to bin"
          onClose={toggleMultipleDeleteConfirmationModal}
          isOpen={showMultipleDeleteConfirmationModal}
          fetchAllFiles={fetchAllFiles}
          filesIds={filesIds}
          deselectAll={deselectAll}
        />
      )}
      {showMultipleRestoreModal && (
        <MultipleRestoreModal
          heading="Restore files?"
          description={`Do you really want to restore these ${filesIds?.length} item(s) from the bin?`}
          submitButtonText="Yes, Restore"
          onClose={toggleMultipleRestoreModal}
          isOpen={showMultipleRestoreModal}
          fetchAllFiles={fetchAllFiles}
          filesIds={filesIds}
          deselectAll={deselectAll}
        />
      )}
      {showMultipleDisableModal && (
        <MultipleDisableModal
          heading="Disable files?"
          description={`Do you really want to disable ${
            filesIds && filesIds?.length > 1 ? "these" : "this"
          } ${filesIds?.length} file(s)?`}
          submitButtonText="Yes, Disbale"
          onClose={toggleMultipleDisableModal}
          isOpen={showMultipleDisableModal}
          fetchAllFiles={fetchAllFiles}
          filesIds={filesIds}
          deselectAll={deselectAll}
        />
      )}
    </>
  );
};

export default SelectedFilesActions;
