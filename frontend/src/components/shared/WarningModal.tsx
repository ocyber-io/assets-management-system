import React, { useState } from "react";
import NotificationModal from "./NotificationModal"; // Ensure correct path to NotificationModal
import warningImage from "../../assets/images/warning-modal.svg";

type WarningModalProps = {
  heading?: string;
  description?: string;
  onSubmit: () => void;
  submitButtonText: string;
};

const WarningModal: React.FC<WarningModalProps> = ({
  heading = "Warning!",
  description = "There is something that needs your attention. Please take action or dismiss this warning.",
  onSubmit,
  submitButtonText,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleDismiss = () => {
    console.log("Warning dismissed");
    closeModal();
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
      onSubmit={onSubmit}
      cancelButtonText="Cancel"
      submitButtonText={submitButtonText}
      cancelButtonStyle="bg-white border border-gray-200 hover:bg-gray-50"
      submitButtonStyle="bg-blue-500 hover:bg-blue-600"
      closeModal={closeModal}
    />
  );
};

export default WarningModal;
