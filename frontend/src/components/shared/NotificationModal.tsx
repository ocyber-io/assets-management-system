import React from "react";
import { FaTimes } from "react-icons/fa"; // Ensure you have react-icons installed

type NotificationModalProps = {
  isOpen: boolean;
  imageUrl?: string;
  heading?: string;
  description?: string;
  onCancel?: () => void;
  onSubmit: () => void;
  cancelButtonText: string;
  submitButtonText: string;
  cancelButtonStyle?: string;
  submitButtonStyle?: string;
  submitButtonExtraStyle?: string;
  closeModal: () => void;
};

const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  imageUrl,
  heading,
  description,
  onCancel,
  onSubmit,
  cancelButtonText,
  submitButtonText,
  cancelButtonStyle,
  submitButtonStyle,
  closeModal,
  submitButtonExtraStyle,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={closeModal}
        >
          <FaTimes size={20} />
        </button>

        <div className="text-center">
          {imageUrl && (
            <img src={imageUrl} alt="Notification" className="mx-auto" />
          )}
          {heading && (
            <h3 className="text-xl text-gray-600 font-extrabold mt-4">
              {heading}
            </h3>
          )}
          {description && (
            <p className="text-gray-600 mt-2 text-sm">{description}</p>
          )}
        </div>
        <div className="flex w-full gap-x-3 mt-6">
          {onCancel && (
            <button
              className={`w-full py-2 rounded ${
                cancelButtonStyle || "bg-gray-300 hover:bg-gray-400"
              } text-gray-600`}
              onClick={onCancel}
            >
              {cancelButtonText}
            </button>
          )}
          <button
            className={`w-full py-2 rounded ${
              submitButtonStyle || "bg-blue-500 hover:bg-blue-600"
            } text-white font-bold`}
            onClick={onSubmit}
            style={{ backgroundColor: submitButtonExtraStyle }}
          >
            {submitButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
