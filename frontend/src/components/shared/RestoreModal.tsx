import React from "react";
import { useDispatch } from "react-redux";
import restoreImage from "../../assets/images/restore-modal.svg"; // Correctly import delete image
import { restoreFile } from "../../reducers/file/fileThunks";
import { AppDispatch } from "../../stores/store";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import NotificationModal from "./NotificationModal"; // Adjust path if needed

type RestoreModalProps = {
  heading?: string;
  description?: string;
  fetchAllFiles: () => void;
  fileId: string | null;
  fileName: string | null;
  fileSize: string | null;
  submitButtonText: string;
  onClose: () => void;
  isOpen: boolean;
};

const formatDate = () => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date().toLocaleDateString(undefined, options);
};

const RestoreModal: React.FC<RestoreModalProps> = ({
  heading = "Restore File?",
  description = "Do you really want to restore this item from the bin?",
  submitButtonText,
  onClose,
  isOpen,
  fileId,
  fetchAllFiles,
  fileName,
  fileSize,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const deleteDate = formatDate();
  const handleDismiss = () => {
    onClose();
  };

  const handleSubmit = async () => {
    if (!fileId) {
      showErrorToast("Invalid file identifier.");
      return;
    }

    try {
      await dispatch(restoreFile(fileId)).unwrap();
      showSuccessToast("File restored successfully");
      fetchAllFiles();
      onClose();
    } catch (error: any) {
      showErrorToast(error || "An error occurred while restoring the file.");
    }
  };

  return (
    <NotificationModal
      isOpen={isOpen}
      imageUrl={restoreImage}
      heading={heading}
      headingStyles="text-xl text-gray-600 font-extrabold mt-4"
      description={description}
      descriptionAndHeadingPosition="text-center"
      onCancel={handleDismiss}
      onSubmit={handleSubmit}
      cancelButtonText="Cancel"
      submitButtonText={submitButtonText}
      cancelButtonStyle="bg-white border border-gray-200 hover:bg-gray-50"
      submitButtonStyle="hover:bg-blue-600"
      submitButtonExtraStyle="#3b82f6"
      closeModal={onClose}
    >
      <div className="flex flex-col items-center justify-center mt-6">
        <table className="table-auto  w-full items-center flex justify-center">
          <tbody>
            <tr>
              <td
                className="text-gray-600 text-sm font-semibold text-right pr-2 pb-2"
                style={{ width: "100px" }}
              >
                File Name:
              </td>
              <td
                className="text-gray-600 text-sm pb-2 w-1/2"
                style={{ wordWrap: "break-word" }}
              >
                {fileName}
              </td>
            </tr>
            <tr>
              <td
                className="text-gray-600 text-sm font-semibold text-right pr-2 pb-2"
                style={{ width: "100px" }}
              >
                Delete Date:
              </td>
              <td className="text-gray-600 text-sm pb-2">{deleteDate}</td>
            </tr>
            <tr>
              <td
                className="text-gray-600 text-sm font-semibold text-right pr-2"
                style={{ width: "100px" }}
              >
                File Size:
              </td>
              <td className="text-gray-600 text-sm">{fileSize}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </NotificationModal>
  );
};

export default RestoreModal;
