import React, { useState } from "react";
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

type RecentFilesModalsProps = {
  showLinkModal: boolean;
  selectedLink: string | null;
  setShowLinkModal: (show: boolean) => void;
  showWarningModal: boolean;
  toggleDisableModal: () => void;
  handleWarningAction: () => void;
  showDeleteModal: boolean;
  toggleDeleteModal: () => void;
  deleteHandler: () => void;
  showRenameModal: boolean;
  fileName: string | null;
  toggleRenameModal: () => void;
  handleOkAction: () => void;
  toggleFileInformationModal: () => void;
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
  selectedFileDetails: File | undefined;
};

const RecentFilesModals: React.FC<RecentFilesModalsProps> = ({
  showLinkModal,
  selectedLink,
  setShowLinkModal,
  showWarningModal,
  toggleDisableModal,
  handleWarningAction,
  showDeleteModal,
  toggleDeleteModal,
  deleteHandler,
  showRenameModal,
  fileName,
  toggleRenameModal,
  handleOkAction,
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
      {showShareModal && (
        <ShareModal
          isOpen={showShareModal}
          onClose={toggleShareModal}
          onSubmit={shareSubmitClickHandler}
          onCancel={toggleShareModal}
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
