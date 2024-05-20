import React from "react";
import changePasswordImage from "../../../assets/images/changePassword.svg";
import NotificationModal from "../../../components/shared/NotificationModal";

const ChangePasswordSuccessModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <NotificationModal
      imageUrl={changePasswordImage}
      isOpen={isOpen}
      heading="Your password has 
      been changed Successfully."
      headingStyles="text-lg font-bold"
      description="Thank you for taking the time to update your password.
      Your account is now secure."
      descriptionAndHeadingPosition="text-center"
      closeModal={onClose}
      onSubmit={onClose}
      submitButtonText="Continue"
    ></NotificationModal>
  );
};

export default ChangePasswordSuccessModal;
