import React, { useState } from "react";
import CopyLinkIcon from "../../assets/icons/copyLink.svg";
import FullLinkIcon from "../../assets/icons/fullLinkSquare.svg";

type LinkModalProps = {
  isOpen: boolean;
  heading: string;
  link: string;
  closeModal: () => void;
};

const LinkModal: React.FC<LinkModalProps> = ({
  isOpen,
  heading,
  link,
  closeModal,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">{heading}</h3>
        <div className="flex items-center p-3 border border-gray-200 rounded">
          <img src={FullLinkIcon} className="mr-2" />
          <a
            href={link}
            className="text-blue-500 hover:text-blue-700"
            target="_blank"
            rel="noopener noreferrer"
          >
            {link}
          </a>
        </div>
        <div className="flex gap-x-3 mt-6">
          <button
            className="flex w-full items-center px-4 py-2 justify-center bg-white border border-gray-200 hover:bg-gray--50 text-gray-600 rounded font-semibold"
            onClick={handleCopyLink}
          >
            <img src={CopyLinkIcon} className="mr-2" />{" "}
            {copied ? "Copied!" : "Copy Link"}
          </button>
          <button
            className="px-4 w-full py-2  text-white bg-blue-500 hover:bg-blue-600 rounded font-semibold"
            onClick={closeModal}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default LinkModal;
