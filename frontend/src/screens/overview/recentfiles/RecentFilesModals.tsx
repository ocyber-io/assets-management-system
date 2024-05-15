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
import DeleteConfirmationModal from "../../../components/shared/DeleteConfirmationModal";
import RestoreModal from "../../../components/shared/RestoreModal";

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
  showDeleteConfrimationModal: boolean;
  showRestoreModal: boolean;
  shareSubmitClickHandler: () => void;
  showReplaceModal: boolean;
  showSuccessModal: boolean;
  toggleReplaceModal: () => void;
  toggleSuccessModal: () => void;
  toggleDeleteConfirmationModal: () => void;
  toggleRestoreModal: () => void;
  toggleReplaceSuccessModal: () => void;

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
  selectedFileDetails,
  fetchAllFiles,
  showEnableModal,
  toggleEnableModal,
  fileLink,
  toggleReplaceSuccessModal,
  toggleDeleteConfirmationModal,
  toggleRestoreModal,
  showDeleteConfrimationModal,
  showRestoreModal,
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
          heading="Move to bin?"
          description="Do you really want to move this item to the bin? You can restore it later if needed."
          submitButtonText="Yes, Move to bin"
          onClose={toggleDeleteModal}
          fileId={fileId}
          isOpen={showDeleteModal}
          fetchAllFiles={fetchAllFiles}
        />
      )}
      {showDeleteConfrimationModal && (
        <DeleteConfirmationModal
          heading="Delete File?"
          description="Are you sure you want to delete this file? This process cannot be undone."
          submitButtonText="Yes, Delete"
          onClose={toggleDeleteConfirmationModal}
          fileId={fileId}
          isOpen={showDeleteConfrimationModal}
          fetchAllFiles={fetchAllFiles}
        />
      )}
      {showRestoreModal && (
        <RestoreModal
          heading="Restore File?"
          description="Do you really want to restore this item from the bin?"
          submitButtonText="Yes, Restore"
          onClose={toggleRestoreModal}
          fileId={fileId}
          isOpen={showRestoreModal}
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
          fileDetails={selectedFileDetails}
          toggleReplaceSuccessModal={toggleReplaceSuccessModal}
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
