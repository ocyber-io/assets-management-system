import React, { useState } from "react";
import NotificationModal from "./NotificationModal";
import { useDispatch } from "react-redux";
import { renameFile } from "../../reducers/file/fileThunks";
import { AppDispatch } from "../../stores/store";
import { showErrorToast, showSuccessToast } from "../../utils/toast";

type RenameProps = {
  isOpen: boolean;
  onClose: () => void;
  fetchAllFiles: () => void;
  fileId: string | null;
  initialFilename: string;
};

const RenameModal: React.FC<RenameProps> = ({
  isOpen,
  onClose,
  fileId,
  initialFilename,
  fetchAllFiles,
}) => {
  const [newFilename, setNewFilename] = useState(initialFilename);
  const dispatch = useDispatch<AppDispatch>();

  const handleFilenameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewFilename(event.target.value);
  };

  const handleSubmit = async () => {
    if (!fileId) {
      showErrorToast("Invalid file identifier.");
      return;
    }

    if (newFilename === "") {
      showErrorToast("Filename cannot be empty");
      return;
    }

    try {
      await dispatch(
        renameFile({ fileId, newOriginalName: newFilename })
      ).unwrap();
      showSuccessToast("File successfully renamed");
      fetchAllFiles();
    } catch (error: any) {
      showErrorToast(error || "An error occurred while renaming the file.");
    }
  };

  return (
    <NotificationModal
      heading="Rename"
      headingStyles="font-semibold text-xl"
      closeModal={onClose}
      submitButtonText="OK"
      submitButtonStyle="bg-blue-500 hover:bg-blue-600"
      cancelButtonStyle="bg-transparent border-2 border-gray-200 hover:bg-blue-50"
      cancelButtonText="Cancel"
      isOpen={isOpen}
      onSubmit={handleSubmit}
      onCancel={onClose}
    >
      <div className="w-full mt-4 relative">
        <input
          type="text"
          value={newFilename}
          onChange={handleFilenameChange}
          className="resize-none rounded border-2 border-gray-200 w-full focus:outline-blue-500 pl-2 p-2"
          placeholder="Enter new filename"
        />
      </div>
    </NotificationModal>
  );
};

export default RenameModal;
