import React, { useState } from "react";
import NotificationModal from "./NotificationModal"; // Adjust path if needed
import deleteImage from "../../assets/images/delete-modal.svg"; // Correctly import delete image

type DeleteModalProps = {
  heading?: string;
  description?: string;
  onSubmit: () => void;
  submitButtonText: string;
};

const DeleteModal: React.FC<DeleteModalProps> = ({
  heading = "Are you Sure?",
  description = "Do you really want to delete this item? This process cannot be undone.",
  onSubmit,
  submitButtonText,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleDismiss = () => {
    console.log("Deletion cancelled");
    closeModal();
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
      closeModal={closeModal}
    />
  );
};

export default DeleteModal;
