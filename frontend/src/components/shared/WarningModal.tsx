import React from "react";
import warningImage from "../../assets/images/warning-modal.svg";
import NotificationModal from "./NotificationModal"; // Ensure correct path to NotificationModal

type WarningModalProps = {
  heading?: string;
  description?: string;
  onSubmit: () => void;
  submitButtonText: string;
  onClose: () => void;
  isOpen: boolean;
};

const WarningModal: React.FC<WarningModalProps> = ({
  heading = "Warning!",
  description = "There is something that needs your attention. Please take action or dismiss this warning.",
  onSubmit,
  submitButtonText,
  onClose,
  isOpen,
}) => {
  const handleDismiss = () => {
    console.log("Warning dismissed");
    onClose();
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
      closeModal={onClose}
    />
  );
};

export default WarningModal;
