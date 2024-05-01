import React from "react";
import deleteImage from "../../assets/images/delete-modal.svg"; // Correctly import delete image
import NotificationModal from "./NotificationModal"; // Adjust path if needed

type DeleteModalProps = {
  heading?: string;
  description?: string;
  onSubmit: () => void;
  submitButtonText: string;
  onClose: () => void;
  isOpen: boolean;
};

const DeleteModal: React.FC<DeleteModalProps> = ({
  heading = "Are you Sure?",
  description = "Do you really want to delete this item? This process cannot be undone.",
  onSubmit,
  submitButtonText,
  onClose,
  isOpen,
}) => {
  const handleDismiss = () => {
    console.log("Deletion cancelled");
    onClose();
  };

  return (
    <NotificationModal
      isOpen={isOpen}
      imageUrl={deleteImage}
      heading={heading}
      headingStyles="text-xl text-gray-600 font-extrabold mt-4"
      description={description}
      descriptionAndHeadingPosition="text-center"
      onCancel={handleDismiss}
      onSubmit={onSubmit}
      cancelButtonText="Cancel"
      submitButtonText={submitButtonText}
      cancelButtonStyle="bg-white border border-gray-200 hover:bg-gray-50"
      submitButtonStyle="hover:bg-red-600"
      submitButtonExtraStyle="#FF6B50"
      closeModal={onClose}
    />
  );
};

export default DeleteModal;
