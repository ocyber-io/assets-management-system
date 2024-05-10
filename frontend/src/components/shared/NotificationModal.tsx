import React from "react";
import { FaTimes } from "react-icons/fa"; // Ensure you have react-icons installed
import { useSelector } from "react-redux";
import { selectLoading } from "../../reducers/file/fileSlice";

type NotificationModalProps = {
  isOpen: boolean;
  imageUrl?: string;
  heading?: string;
  headingStyles?: string;
  descriptionAndHeadingPosition?: string;
  description?: string;
  onCancel?: (fileId: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  cancelButtonText?: string;
  cancelButtonIcon?: string;
  submitButtonText: string;
  cancelButtonStyle?: string;
  submitButtonStyle?: string;
  submitButtonExtraStyle?: string;
  closeModal: () => void;
  children?: React.ReactNode;
};

const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  imageUrl,
  heading,
  headingStyles,
  description,
  descriptionAndHeadingPosition,
  onCancel,
  onSubmit,
  cancelButtonText,
  cancelButtonIcon,
  submitButtonText,
  cancelButtonStyle,
  submitButtonStyle,
  closeModal,
  submitButtonExtraStyle,
  children,
}) => {
  if (!isOpen) return null;
  const loading = useSelector(selectLoading);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50 ">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative max-h-screen overflow-y-scroll no-scrollbar">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={closeModal}
        >
          <FaTimes size={20} />
        </button>

        <div className={`${descriptionAndHeadingPosition}`}>
          {imageUrl && (
            <img src={imageUrl} alt="Notification" className="mx-auto" />
          )}
          {heading && <h3 className={`${headingStyles}`}>{heading}</h3>}
          {description && (
            <p className="text-gray-600 mt-2 text-sm">{description}</p>
          )}

          {/* Children elements rendered here */}
        </div>
        {children}
        <div className="flex w-full gap-x-3 mt-6">
          {onCancel && (
            <button
              className={`w-full py-2 flex justify-center rounded ${
                cancelButtonStyle || "bg-gray-300 hover:bg-gray-400"
              } text-gray-600`}
              onClick={() => onCancel}
            >
              {cancelButtonIcon && (
                <img
                  src={cancelButtonIcon}
                  alt="Cancel"
                  className="mr-2 w-5 h-5 mt-0.5"
                />
              )}

              {cancelButtonText}
            </button>
          )}
          <button
            className={`w-full py-2 rounded flex justify-center ${
              submitButtonStyle || "bg-blue-500 hover:bg-blue-600"
            } text-white font-bold`}
            onClick={(e) => onSubmit(e)}
            style={{ backgroundColor: submitButtonExtraStyle }}
            disabled={loading}
          >
            {submitButtonText}
            {loading && (
              <div className="ml-2 w-4 h-4 border-2 border-t-2 mt-1 border-white rounded-full animate-spin"></div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
