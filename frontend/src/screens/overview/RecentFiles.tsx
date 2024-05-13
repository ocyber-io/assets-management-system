import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { File } from "../../Types";
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
};

const RecentFiles: React.FC<RecentFilesProps> = ({
  fullScreenList = false,
  filesPerPage = 10,
  showFullLink,
  tagFiles,
  files,
}) => {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [hoverLinkId, setHoverLinkId] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showLinkModal, setShowLinkModal] = useState<boolean>(false);
  const [showWarningModal, setShowWarningModal] = useState<boolean>(false);
  const [showEnableModal, setShowEnableModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showFileInformationModal, setShowFileInformationModal] =
    useState<boolean>(false);
  const [showRenameModal, setShowRenameModal] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showReplaceModal, setShowReplaceModal] = useState(false);
  const [selectedLink, setSelectedLink] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>("");
  const [fileId, setFileId] = useState<string | null>("");
  const [fileLink, setFileLink] = useState<string>("");
  const [selectedFileDetails, setSelectedFileDetails] = useState<
    File | undefined
  >();
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

  // useEffect(() => {
  //   fetchAllFiles();
  // }, [dispatch, userId]);

  const toggleDisableModal = () => {
    setShowWarningModal(!showWarningModal);
  };
  const toggleDeleteModal = () => {
    setShowDeleteModal(!showDeleteModal);
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

  useEffect(() => {
    // Reset to first page if filesPerPage changes
    setCurrentPage(1);
  }, [filesPerPage]);

  const lastFileIndex = currentPage * filesPerPage;
  const firstFileIndex = lastFileIndex - filesPerPage;

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

  const selectAll = () => {
    // Calculate the index of the first and last files on the current page
    const lastFileIndex = currentPage * filesPerPage;
    const firstFileIndex = lastFileIndex - filesPerPage;

    if (!files) {
      return;
    }
    setSelectedFiles(
      files.slice(firstFileIndex, lastFileIndex).map((file) => file._id)
    );
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

  const renameHandler = (filename: string, fileId: string) => {
    toggleRenameModal();
    setFileName(filename);
    setFileId(fileId);
  };

  const fileInformationHandler = (fileDetails: File) => {
    setSelectedFileDetails(fileDetails);
    toggleFileInformationModal();
  };

  const shareHandler = (fileLink: string) => {
    toggleShareModal();
    setFileLink(fileLink);
  };

  const replaceHandler = (fileDetails: File) => {
    setSelectedFileDetails(fileDetails);
    toggleReplaceModal();
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

  const handleReplaceSubmit = () => {
    console.log("Submit new file details");
    toggleReplaceModal();
    toggleSuccessModal();
  };

  const handleCancelReplace = () => {
    console.log("Cancelled");
    toggleReplaceModal();
  };

  if (error) return <div>Error loading files: {error}</div>;

  return (
    <div className="w-full md:px-4 pb-6">
      {selectedFiles.length > 0 && (
        <SelectedFilesActions
          selectedFilesCount={selectedFiles.length}
          deselectAll={deselectAll}
          selectAll={selectAll}
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
          enableHandler={enableHandler}
          disableHandler={disableHandler}
          fileInformationHandler={fileInformationHandler}
          shareHandler={shareHandler}
          replaceHandler={replaceHandler}
          showFullLink={showFullLink}
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
        handleReplaceSubmit={handleReplaceSubmit}
        handleCancelReplace={handleCancelReplace}
        selectedFileDetails={selectedFileDetails}
        fetchAllFiles={fetchAllFiles}
        fileLink={fileLink}
      />
    </div>
  );
};

export default RecentFiles;
