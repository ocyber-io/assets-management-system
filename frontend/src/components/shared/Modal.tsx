import React, { ReactNode } from "react";

// Define a type for the props
type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  image?: string;
  heading?: string;
  subheading?: string;
  children?: ReactNode;
  buttonText?: string;
  onButtonClick?: () => void;
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  image,
  heading,
  subheading,
  children,
  buttonText,
  onButtonClick,
}) => {
  // Return null if the modal should not be open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-5 rounded-lg max-w-lg w-full mx-4">
        <div className="text-right">
          <button onClick={onClose} className="text-lg font-semibold">
            ✕
          </button>
        </div>
        {image && <img src={image} alt="Modal Visual" className="mx-auto" />}
        <div className="text-left my-4">
          {heading && <h2 className="text-xl font-extrabold">{heading}</h2>}
          {subheading && <p className=" mt-2">{subheading}</p>}
        </div>
        <div>{children}</div>
        {buttonText &&
          onButtonClick && ( // Ensure onButtonClick is also defined
            <button
              onClick={onButtonClick}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 mt-4 rounded"
            >
              {buttonText}
            </button>
          )}
      </div>
    </div>
  );
};

export default Modal;
