import React from "react";
import LinkModal from "../../../components/shared/LinkModal";
import WarningModal from "../../../components/shared/WarningModal";
import DeleteModal from "../../../components/shared/DeleteModal";
import RenameModal from "../../../components/shared/RenameModal";
import FileDetailsModal from "../../../components/shared/file-details-modal/FileDetailsModal";
import { sampleFileDetailsData } from "../../../helpers/sampleFileDetailsData";
import ShareModal from "../../../components/shared/ShareModal";
import ReplaceFileModal from "../../../components/shared/ReplaceFileModal";
import ReplaceSuccessfullModal from "../../../components/shared/ReplaceSuccessfullModal";
import { File } from "../../../Types";
import EnableModal from "../../../components/shared/EnableModal";

type RecentFilesModalsProps = {
  fileId: string | null;
  showLinkModal: boolean;
  selectedLink: string | null;
  setShowLinkModal: (show: boolean) => void;
  showWarningModal: boolean;
  showEnableModal: boolean;
  toggleDisableModal: () => void;
  handleWarningAction: () => void;
  showDeleteModal: boolean;
  toggleDeleteModal: () => void;
  showRenameModal: boolean;
  fileName: string | null;
  fileLink: string;
  toggleRenameModal: () => void;
  handleOkAction: () => void;
  toggleFileInformationModal: () => void;
  toggleEnableModal: () => void;
  showFileInformationModal: boolean;
  toggleShareModal: () => void;
  showShareModal: boolean;
  shareSubmitClickHandler: () => void;
  showReplaceModal: boolean;
  showSuccessModal: boolean;
  toggleReplaceModal: () => void;
  toggleSuccessModal: () => void;
  handleReplaceSubmit: () => void;
  handleCancelReplace: () => void;

  fetchAllFiles: () => void;
  selectedFileDetails: File | undefined;
};

const RecentFilesModals: React.FC<RecentFilesModalsProps> = ({
  fileId,
  showLinkModal,
  selectedLink,
  setShowLinkModal,
  showWarningModal,
  toggleDisableModal,
  showDeleteModal,
  toggleDeleteModal,
  showRenameModal,
  fileName,
  toggleRenameModal,
  toggleFileInformationModal,
  showFileInformationModal,
  toggleShareModal,
  showShareModal,
  shareSubmitClickHandler,
  showReplaceModal,
  showSuccessModal,
  toggleReplaceModal,
  toggleSuccessModal,
  handleReplaceSubmit,
  handleCancelReplace,
  selectedFileDetails,
  fetchAllFiles,
  showEnableModal,
  toggleEnableModal,
  fileLink,
}) => {
  return (
    <>
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
          fileId={fileId}
          description="Disabling this file will render its link inactive. Any shared links to this file will no longer be accessible to recipients."
          submitButtonText="Disable"
          onClose={toggleDisableModal}
          isOpen={showWarningModal}
          fetchAllFiles={fetchAllFiles}
        />
      )}
      {showEnableModal && (
        <EnableModal
          heading="Enable File?"
          description="Enabling this file will reactivate its link. Any previously shared links to this file will once again be accessible to recipients."
          submitButtonText="Enable"
          fileId={fileId}
          onClose={toggleEnableModal}
          isOpen={showEnableModal}
          fetchAllFiles={fetchAllFiles}
        />
      )}
      {showDeleteModal && (
        <DeleteModal
          heading="Delete File?"
          description="Are you sure you want to delete this file?"
          submitButtonText="Yes, Delete"
          onClose={toggleDeleteModal}
          fileId={fileId}
          isOpen={showDeleteModal}
          fetchAllFiles={fetchAllFiles}
        />
      )}
      {showRenameModal && fileName && (
        <RenameModal
          isOpen={showRenameModal}
          onClose={toggleRenameModal}
          fileId={fileId}
          initialFilename={fileName}
          fetchAllFiles={fetchAllFiles}
        />
      )}
      {showShareModal && (
        <ShareModal
          isOpen={showShareModal}
          onClose={toggleShareModal}
          onSubmit={shareSubmitClickHandler}
          fileLink={fileLink}
        />
      )}
      {showFileInformationModal && sampleFileDetailsData && (
        <FileDetailsModal
          closeModal={toggleFileInformationModal}
          file={selectedFileDetails}
        />
      )}
      {showReplaceModal && (
        <ReplaceFileModal
          isOpen={showReplaceModal}
          onClose={toggleReplaceModal}
          onSubmit={handleReplaceSubmit}
          onCancel={handleCancelReplace}
          fileDetails={selectedFileDetails}
        />
      )}
      {showSuccessModal && (
        <ReplaceSuccessfullModal
          isOpen={showSuccessModal}
          onClose={toggleSuccessModal}
          onSubmit={() => console.log("Continue after success")}
          fileDetails={selectedFileDetails}
        />
      )}
    </>
  );
};

export default RecentFilesModals;
