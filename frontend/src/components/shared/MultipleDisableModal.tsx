import React from "react";
import { useDispatch } from "react-redux";
import warningImage from "../../assets/images/warning-modal.svg";
import { disableMultipleFiles } from "../../reducers/file/fileThunks";
import { AppDispatch } from "../../stores/store";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import NotificationModal from "./NotificationModal";

type MultipleDisableModalProps = {
  filesIds: string[] | undefined;
  heading?: string;
  description?: string;
  submitButtonText: string;
  onClose: () => void;
  deselectAll: () => void;
  isOpen: boolean;
  fetchAllFiles: () => void;
};

const MultipleDisableModal: React.FC<MultipleDisableModalProps> = ({
  heading = "Warning!",
  description = "There is something that needs your attention. Please take action or dismiss this warning.",
  submitButtonText,
  onClose,
  isOpen,
  deselectAll,
  fetchAllFiles,
  filesIds,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleDismiss = () => {
    console.log("Warning dismissed");
    onClose();
  };

  const enableHandler = async () => {
    try {
      if (!filesIds) {
        return;
      }
      await dispatch(disableMultipleFiles(filesIds)).unwrap();
      showSuccessToast(
        `${filesIds.length} file${
          filesIds.length > 1 ? "s" : ""
        } disabled successfully`
      );
      deselectAll();
      fetchAllFiles();
      onClose();
    } catch (error: any) {
      showErrorToast("Error disabling multiple files: " + error.message);
    }
  };

  return (
    <NotificationModal
      isOpen={isOpen}
      imageUrl={warningImage}
      heading={heading}
      headingStyles="text-xl text-gray-600 font-extrabold mt-4"
      description={description}
      descriptionAndHeadingPosition="text-center"
      onCancel={handleDismiss}
      onSubmit={enableHandler}
      cancelButtonText="Cancel"
      submitButtonText={submitButtonText}
      cancelButtonStyle="bg-white border border-gray-200 hover:bg-gray-50"
      submitButtonStyle="bg-green-500 hover:bg-green-600"
      closeModal={onClose}
    />
  );
};

export default MultipleDisableModal;
