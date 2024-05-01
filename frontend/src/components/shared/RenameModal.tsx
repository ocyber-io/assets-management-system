import React from "react";
import NotificationModal from "./NotificationModal";

type RenameProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onCancel: () => void;
  filename: string;
};

const RenameModal: React.FC<RenameProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onCancel,
  filename,
}) => {
  return (
    <div>
      <NotificationModal
        heading="Rename"
        headingStyles="font-semibold text-xl"
        closeModal={onClose}
        submitButtonText="OK"
        submitButtonStyle="bg-blue-500 hover:bg-blue-600"
        cancelButtonStyle=" bg-transparent border-2 border-gray-200 hover:bg-blue-50"
        cancelButtonText="Cancel"
        isOpen={isOpen}
        onSubmit={onSubmit}
        onCancel={onCancel}
      >
        <div className="w-full mt-4 relative">
          <input
            value={filename}
            className="resize-none rounded border-2 border-gray-200 w-full focus:outline-blue-500 pl-2 p-2"
            placeholder="Add a message"
          ></input>
        </div>
      </NotificationModal>
    </div>
  );
};

export default RenameModal;
