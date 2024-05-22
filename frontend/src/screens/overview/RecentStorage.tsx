import { jwtDecode } from "jwt-decode";
import React, { useEffect, useMemo, useState } from "react";
import { MdMoreVert } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { selectError, selectFiles } from "../../reducers/file/fileSlice";
import { fetchFiles, toggleFileFavorite } from "../../reducers/file/fileThunks";
import { AppDispatch } from "../../stores/store";
import useIsMobile from "../../utils/IsMobile";
import { formatFilename } from "../../utils/helpers";
import dummyImage from "../../assets/images/dummyDocument.svg";
import dummyVideo from "../../assets/images/dummyVideo.svg";
import dummyCompressed from "../../assets/images/compressedDummy.svg";
import RecentStorageDropdown from "./RecentStorageDropdown";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import { File } from "../../Types";
import RecentFilesModals from "./recentfiles/RecentFilesModals";
import { getFoldersByUserId } from "../../reducers/folder/folderThunk";

const RecentStorage: React.FC = () => {
  const files = useSelector(selectFiles);
  const error = useSelector(selectError);
  const dispatch = useDispatch<AppDispatch>();
  const [userId, setUserId] = useState<string>();
  const token = localStorage.getItem("token");
  const isMobile = useIsMobile();
  const [selectedLink, setSelectedLink] = useState<string | null>(null);
  const [showLinkModal, setShowLinkModal] = useState<boolean>(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [showWarningModal, setShowWarningModal] = useState<boolean>(false);
  const [showEnableModal, setShowEnableModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showDeleteConfrimationModal, setShowDeleteConfrimationModal] =
    useState<boolean>(false);
  const [showRestoreModal, setShowRestoreModal] = useState<boolean>(false);
  const [showFileInformationModal, setShowFileInformationModal] =
    useState<boolean>(false);
  const [showRenameModal, setShowRenameModal] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showMoveToFolderModal, setShowMoveToFolderModal] = useState(false);
  const [showRemoveFromFolderModal, setShowRemoveFromFolderModal] =
    useState(false);
  const [showReplaceModal, setShowReplaceModal] = useState(false);
  const [fileName, setFileName] = useState<string | null>("");
  const [fileSize, setFileSize] = useState<string | null>("");
  const [fileId, setFileId] = useState<string | null>("");
  const [fileLink, setFileLink] = useState<string>("");
  const [selectedFileDetails, setSelectedFileDetails] = useState<
    File | undefined
  >();

  useEffect(() => {
    fetchAllFiles();
  }, [dispatch, userId]);

  const toggleDisableModal = () => {
    setShowWarningModal(!showWarningModal);
  };
  const toggleDeleteModal = () => {
    setShowDeleteModal(!showDeleteModal);
  };
  const toggleDeleteConfrimationModal = () => {
    setShowDeleteConfrimationModal(!showDeleteConfrimationModal);
  };
  const toggleRestoreModal = () => {
    setShowRestoreModal(!showRestoreModal);
  };
  const toggleEnableModal = () => {
    setShowEnableModal(!showEnableModal);
  };
  const toggleRenameModal = () => {
    setShowRenameModal(!showRenameModal);
  };
  const toggleFileInformationModal = () => {
    setShowFileInformationModal(!showFileInformationModal);
  };
  const toggleShareModal = () => {
    setShowShareModal(!showShareModal);
  };

  const toggleReplaceModal = () => {
    setShowReplaceModal(!showReplaceModal);
  };
  const toggleSuccessModal = () => {
    setShowSuccessModal(!showSuccessModal);
  };
  const toggleMoveToFolderModal = () => {
    setShowMoveToFolderModal(!showMoveToFolderModal);
  };
  const toggleRemoveFromFolderModal = () => {
    setShowRemoveFromFolderModal(!showRemoveFromFolderModal);
  };

  const toggleDropdown = (id: string) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const copyToClipboard = (link: string) => {
    navigator.clipboard.writeText(link).then(
      () => {
        showSuccessToast("Link copied to clipboard!");
      },
      () => {
        showErrorToast("Failed to copy the link.");
      }
    );
  };

  const disableHandler = (fileId: string) => {
    toggleDisableModal();
    setFileId(fileId);
  };
  const enableHandler = (fileId: string) => {
    toggleEnableModal();
    setFileId(fileId);
  };

  const deleteHandler = (fileId: string) => {
    toggleDeleteModal();
    setFileId(fileId);
  };
  const deleteConfirmationHandler = (fileId: string) => {
    toggleDeleteConfrimationModal();
    setFileId(fileId);
  };
  const moveToFolderHandler = (fileId: string) => {
    toggleMoveToFolderModal();
    setFileId(fileId);
  };
  const restoreHandler = (
    fileId: string,
    filename: string,
    filesize: string
  ) => {
    toggleRestoreModal();
    setFileId(fileId);
    setFileName(filename);
    setFileSize(filesize);
  };

  const renameHandler = (filename: string, fileId: string) => {
    toggleRenameModal();
    setFileName(filename);
    setFileId(fileId);
  };

  const fileInformationHandler = (fileDetails: File) => {
    setSelectedFileDetails(fileDetails);
    toggleFileInformationModal();
  };

  const shareHandler = (fileLink: string, fileId: string) => {
    toggleShareModal();
    setFileLink(fileLink);
    setFileId(fileId);
  };

  const replaceHandler = (fileDetails: File) => {
    setSelectedFileDetails(fileDetails);
    toggleReplaceModal();
  };
  const removeFromFolderHandler = (fileId: string) => {
    setFileId(fileId);
    toggleRemoveFromFolderModal();
  };

  const shareSubmitClickHandler = () => {
    console.log("shared");
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
      fetchAllFiles();
    } catch (error: any) {
      showErrorToast(error || "An error occurred while toggling favorite.");
    }
  };

  const fetchAllFiles = async () => {
    if (userId) dispatch(fetchFiles(userId));
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

  const fetchFolders = async () => {
    if (userId) {
      try {
        await dispatch(getFoldersByUserId(userId));
      } catch (error) {
        console.error("Error fetching folders:", error);
      }
    }
  };

  const undeletedFiles = files.filter((file) => !file.isDeleted);

  const recentFiles = useMemo(() => {
    return [...undeletedFiles].reverse().slice(0, 4);
  }, [files]);

  const handleWarningAction = () => {
    console.log("Action taken from Test component");
  };

  const handleOkAction = () => {
    console.log(fileName && fileName);
  };

  if (error) return <div>Error loading files: {error}</div>;

  return (
    <div className="md:px-8 px-3 py-3">
      <h2 className="text-2xl font-bold mb-6">Recent Storage</h2>
      {/* {loading && <ImagesCard />} */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 md:gap-8 gap-3">
        {recentFiles.map((file, index) => (
          <React.Fragment key={index}>
            <div
              key={file._id}
              className="bg-white rounded-lg border-2 border-gray-200 flex flex-col justify-between"
            >
              <div className="px-4 pt-4 flex justify-center items-center flex-grow">
                <div className=" flex justify-center items-center flex-grow">
                  {file.type && file.type.startsWith("image/") ? (
                    <img
                      src={file.link}
                      alt={file.originalName}
                      className="xl:max-h-32 max-h-20 w-full object-cover "
                      style={{ margin: "2px 2px 0 2px" }}
                    />
                  ) : file.type && file.type.startsWith("video/") ? (
                    <img
                      src={dummyVideo} // Placeholder thumbnail for video files
                      alt="Video Thumbnail"
                      className="xl:max-h-32 max-h-20 w-full object-cover opacity-80"
                      style={{ margin: "2px 2px 0 2px" }}
                    />
                  ) : file.type &&
                    (file.type === "application/zip" ||
                      file.type === "application/octet-stream") ? (
                    <img
                      src={dummyCompressed} // Placeholder for compressed files
                      alt="Compressed File"
                      className="xl:max-h-32 max-h-20 w-full object-cover opacity-80"
                      style={{ margin: "2px 2px 0 2px" }}
                    />
                  ) : (
                    <img
                      src={dummyImage}
                      alt="Dummy Image"
                      className="xl:max-h-32 max-h-20 w-full object-cover opacity-80"
                      style={{ margin: "2px 2px 0 2px" }}
                    />
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center px-3 py-3 border-t-2 border-gray-200">
                <p className="text-sm text-gray-700 font-medium">
                  {formatFilename(file.originalName, isMobile)}
                </p>
                <button
                  className="text-gray-600 hover:text-gray-800"
                  onClick={() => toggleDropdown(file._id)}
                >
                  <MdMoreVert size={20} />
                  <RecentStorageDropdown
                    file={file}
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
                    deleteConfirmationHandler={deleteConfirmationHandler}
                    restoreHandler={restoreHandler}
                    removeFromFolderHandler={removeFromFolderHandler}
                    moveToFolderHandler={moveToFolderHandler}
                    toggleFavoriteFiles={toggleFavoriteFiles}
                  />
                </button>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
      <RecentFilesModals
        showLinkModal={showLinkModal}
        selectedLink={selectedLink}
        setShowLinkModal={setShowLinkModal}
        showWarningModal={showWarningModal}
        toggleDisableModal={toggleDisableModal}
        handleWarningAction={handleWarningAction}
        showDeleteModal={showDeleteModal}
        toggleDeleteModal={toggleDeleteModal}
        showRenameModal={showRenameModal}
        fileName={fileName}
        fileId={fileId}
        fileSize={fileSize}
        folderId={undefined}
        toggleRenameModal={toggleRenameModal}
        handleOkAction={handleOkAction}
        showFileInformationModal={showFileInformationModal}
        toggleFileInformationModal={toggleFileInformationModal}
        showShareModal={showShareModal}
        toggleShareModal={toggleShareModal}
        shareSubmitClickHandler={shareSubmitClickHandler}
        showReplaceModal={showReplaceModal}
        showSuccessModal={showSuccessModal}
        showEnableModal={showEnableModal}
        toggleReplaceModal={toggleReplaceModal}
        toggleSuccessModal={toggleSuccessModal}
        toggleEnableModal={toggleEnableModal}
        selectedFileDetails={selectedFileDetails}
        fetchAllFiles={fetchAllFiles}
        fileLink={fileLink}
        toggleReplaceSuccessModal={toggleSuccessModal}
        showDeleteConfrimationModal={showDeleteConfrimationModal}
        toggleDeleteConfirmationModal={toggleDeleteConfrimationModal}
        showRestoreModal={showRestoreModal}
        toggleRestoreModal={toggleRestoreModal}
        showMoveToFolderModal={showMoveToFolderModal}
        toggleMovetoFolderModal={toggleMoveToFolderModal}
        showRemoveFromFolderModal={showRemoveFromFolderModal}
        toggleRemoveFromFolderModal={toggleRemoveFromFolderModal}
        fetchFolders={fetchFolders}
      />
    </div>
  );
};

export default RecentStorage;
