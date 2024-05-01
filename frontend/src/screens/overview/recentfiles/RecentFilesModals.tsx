import React from "react";
import LinkModal from "../../../components/shared/LinkModal";
import WarningModal from "../../../components/shared/WarningModal";
import DeleteModal from "../../../components/shared/DeleteModal";
import RenameModal from "../../../components/shared/RenameModal";

// Define an interface for the props
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
    </>
  );
};

export default RecentFilesModals;
