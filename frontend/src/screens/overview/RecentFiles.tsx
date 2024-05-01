import React, { useEffect, useState } from "react";
import { File } from "../../Types";
import FilesTable from "./recentfiles/FilesTable";
import Pagination from "./recentfiles/Pagination";
import RecentFilesModals from "./recentfiles/RecentFilesModals";
import SelectedFilesActions from "./recentfiles/SelectedFilesActions";

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

    // Map only the files that are currently visible based on pagination
    setSelectedFiles(
      files
        .slice(firstFileIndex, lastFileIndex)
        .map((file) => file.id.toString())
    );
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
          files={files.slice(firstFileIndex, lastFileIndex)}
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
          disableHandler={disableHandler}
        />
        {files.length > 10 && (
          <Pagination
            totalFiles={files.length}
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
        deleteHandler={deleteHandler}
        showRenameModal={showRenameModal}
        fileName={fileName}
        toggleRenameModal={toggleRenameModal}
        handleOkAction={handleOkAction}
      />
    </div>
  );
};

export default RecentFiles;
