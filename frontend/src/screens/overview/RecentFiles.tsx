import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { File, SelectedFile } from "../../Types";
import { selectError } from "../../reducers/file/fileSlice";
import { fetchFiles } from "../../reducers/file/fileThunks";
import { AppDispatch } from "../../stores/store";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import FilesTable from "./recentfiles/FilesTable";
import Pagination from "./recentfiles/Pagination";
import RecentFilesModals from "./recentfiles/RecentFilesModals";
import SelectedFilesActions from "./recentfiles/SelectedFilesActions";

type RecentFilesProps = {
  files?: File[] | undefined;
  tagFiles?: File[];
  fullScreenList?: boolean;
  filesPerPage?: number;
  showFullLink?: boolean;
  fromTrash?: boolean;
  fromDashboard?: boolean;
  fromFavorites?: boolean;
  fromFolders?: boolean;
  folderId?: string;
  fetchFolders?: () => void;
};

const RecentFiles: React.FC<RecentFilesProps> = ({
  fullScreenList = false,
  filesPerPage = 10,
  showFullLink,
  tagFiles,
  files,
  fromTrash,
  fromFavorites,
  fromFolders,
  folderId,
  fetchFolders,
  fromDashboard
}) => {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [hoverLinkId, setHoverLinkId] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showLinkModal, setShowLinkModal] = useState<boolean>(false);
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
  const [selectedLink, setSelectedLink] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>("");
  const [fileSize, setFileSize] = useState<string | null>("");
  const [fileId, setFileId] = useState<string | null>("");
  const [fileLink, setFileLink] = useState<string>("");
  const [selectedFileDetails, setSelectedFileDetails] = useState<
    File | undefined
  >();
  const [base64ImagePreview, setBase64ImagePreview] = useState<string | null>(null);  // State for Base64 image

  const error = useSelector(selectError);
  const dispatch = useDispatch<AppDispatch>();
  const [userId, setUserId] = useState<string>();
  const token = localStorage.getItem("token");

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

  const fetchAllFiles = async () => {
    if (userId) dispatch(fetchFiles(userId));
  };

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
  const toggleSuccessModal = (base64Image: string | null) => {
    setBase64ImagePreview(base64Image);
    setShowSuccessModal(!showSuccessModal);
  };
  const toggleMoveToFolderModal = () => {
    setShowMoveToFolderModal(!showMoveToFolderModal);
  };
  const toggleRemoveFromFolderModal = () => {
    setShowRemoveFromFolderModal(!showRemoveFromFolderModal);
  };

  useEffect(() => {
    // Reset to first page if filesPerPage changes
    setCurrentPage(1);
  }, [filesPerPage]);

  const lastFileIndex = currentPage * filesPerPage;
  const firstFileIndex = lastFileIndex - filesPerPage;

  const toggleDropdown = (id: string) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const toggleSelection = (
    id: string,
    fileName: string,
    fileLink: string,
    isFavorite: boolean | undefined
  ) => {
    // Create an array to represent the selected file
    const selectedFile: SelectedFile = {
      id,
      originalName: fileName,
      link: fileLink,
      isFavorite: isFavorite,
    };

    setSelectedFiles((prevSelectedFiles) => {
      // Check if the selected file is already in the selectedFiles array
      const isSelected = prevSelectedFiles.some((file) => file.id === id);

      if (isSelected) {
        // If the file is already selected, remove it from selectedFiles
        return prevSelectedFiles.filter((file) => file.id !== id);
      } else {
        // If the file is not selected, add it to selectedFiles
        return [...prevSelectedFiles, selectedFile];
      }
    });
  };
  const deselectAll = () => {
    setSelectedFiles([]);
  };

  const selectAll = () => {
    console.log("I got click to select all files");
    const lastFileIndex = currentPage * filesPerPage;
    console.log({ lastFileIndex });
    const firstFileIndex = lastFileIndex - filesPerPage;
    console.log({ firstFileIndex });

    if (!files) {
      return;
    }

    // Map each file to a SelectedFile object
    const selectedFilesData: SelectedFile[] = files
      .slice(firstFileIndex, lastFileIndex)
      .map((file) => ({
        id: file._id,
        originalName: file.originalName,
        link: file.link,
        isFavorite: file.isFavorite,
      }));

    console.log({ selectedFilesData });
    // Update the selectedFiles state with the new array of SelectedFile objects
    setSelectedFiles(selectedFilesData);
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

  const fullLinkHandler = (link: string) => {
    setSelectedLink(link);
    setShowLinkModal(true);
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

  const handleOkAction = () => {
    console.log(fileName && fileName);
  };

  const handleWarningAction = () => {
    console.log("Action taken from Test component");
  };

  if (error) return <div>Error loading files: {error}</div>;

  return (
    <div className="w-full md:px-4 pb-6">
      {selectedFiles.length > 0 && (
        <SelectedFilesActions
          selectedFilesCount={selectedFiles.length}
          selectedFiles={selectedFiles}
          deselectAll={deselectAll}
          selectAll={selectAll}
          fromFavorites={fromFavorites}
          fromTrash={fromTrash}
          fetchAllFiles={fetchAllFiles}
        />
      )}
      <div className={`mx-2 ${fullScreenList ? "h-screen" : ""}`}>
        <FilesTable
          files={
            tagFiles
              ? tagFiles.slice(firstFileIndex, lastFileIndex)
              : files?.slice(firstFileIndex, lastFileIndex)
          }
          selectedFiles={selectedFiles}
          toggleSelection={toggleSelection}
          hoveredItemId={hoveredItemId}
          setHoveredItemId={setHoveredItemId}
          hoverLinkId={hoverLinkId}
          setHoverLinkId={setHoverLinkId}
          openDropdownId={openDropdownId}
          toggleDropdown={toggleDropdown}
          copyToClipboard={copyToClipboard}
          fullLinkHandler={fullLinkHandler}
          renameHandler={renameHandler}
          deleteHandler={deleteHandler}
          deleteConfirmationHandler={deleteConfirmationHandler}
          restoreHandler={restoreHandler}
          enableHandler={enableHandler}
          disableHandler={disableHandler}
          fileInformationHandler={fileInformationHandler}
          shareHandler={shareHandler}
          replaceHandler={replaceHandler}
          moveToFolderHandler={moveToFolderHandler}
          removeFromFolderHandler={removeFromFolderHandler}
          showFullLink={showFullLink}
          fromTrash={fromTrash}
          fromFavorites={fromFavorites}
          fromFolders={fromFolders}
          fromDashboard={fromDashboard}
        />
        {files && files.length > filesPerPage && (
          <Pagination
            totalFiles={tagFiles ? tagFiles.length : files.length}
            filesPerPage={filesPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        )}
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
        folderId={folderId}
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
        setShowSuccessModal={()=>setShowSuccessModal(false)}
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
        newBase64ImageUrl={base64ImagePreview}
      />
    </div>
  );
};

export default RecentFiles;
