import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  canEditIcon,
  canViewIcon,
  cantEditIcon,
  copylinkIcon,
  downArrowIcon,
  newMessageIcon,
  userIcon,
  viewIcon,
} from "../../helpers/icons";
import { sendFileByEmail } from "../../reducers/file/fileThunks";
import { AppDispatch } from "../../stores/store";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import NotificationModal from "./NotificationModal";

type ShareProps = {
  isOpen: boolean;
  onClose: () => void;
  fileLink: string;
  fileId: string | null;
};

const ShareModal: React.FC<ShareProps> = ({
  isOpen,
  onClose,
  fileLink,
  fileId,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const copyToClipboard = (link: string) => {
    navigator.clipboard.writeText(link).then(
      () => {
        showSuccessToast("Link copied to clipboard!");
      },
      () => {
        showErrorToast("Failed to copy the link.");
      }
    );
  };

  const cancelHandler = () => {
    copyToClipboard(fileLink);
  };

  const [permission, setPermission] = useState<string>("Can edit");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const permissions: { label: string; description: string; icon: string }[] = [
    { label: "Can edit", description: "Make any changes", icon: canEditIcon },
    { label: "Can view", description: "Can't make changes", icon: canViewIcon },
    {
      label: "Can't edit",
      description: "Can view, but not download",
      icon: cantEditIcon,
    },
  ];

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const submitHandler = () => {
    if (!fileId) return;

    if (!isValidEmail(email)) {
      showErrorToast("Please enter a valid email address.");
      return;
    }

    try {
      dispatch(sendFileByEmail({ fileId, email, message }));
      showSuccessToast("File shared successfully");
      onClose();
    } catch (error: any) {
      showErrorToast(error.message);
    }
  };

  return (
    <div>
      <NotificationModal
        heading="Share"
        headingStyles="font-semibold text-xl"
        closeModal={onClose}
        submitButtonText="Send"
        submitButtonStyle="bg-blue-500 hover:bg-blue-600"
        cancelButtonStyle=" bg-transparent border-2 border-gray-200 hover:bg-blue-50"
        cancelButtonText="Copy Link"
        cancelButtonIcon={copylinkIcon}
        isOpen={isOpen}
        onSubmit={submitHandler}
        onCancel={cancelHandler}
      >
        <div className="flex items-center border-2 border-gray-200 rounded mt-4 focus-within:border-2 focus-within:border-blue-500">
          <img src={userIcon} className="mx-2" />
          <input
            type="text"
            placeholder="Enter user email"
            className="flex-1 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className={`flex items-center border-l-2 py-3 border-gray-200 px-2 ${
              showDropdown && "bg-blue-50"
            }`}
          >
            <img src={viewIcon} />
            <div className="px-2">
              <img src={downArrowIcon} />
            </div>
          </button>
          {showDropdown && (
            <ul className="absolute right-6 top-28 shadow-lg bg-white z-10">
              {permissions.map((p, index) => (
                <li
                  key={index}
                  className="flex items-center px-6 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setPermission(p.label);
                    setShowDropdown(false);
                  }}
                >
                  <div className="flex justify-center items-center">
                    <div>
                      <img src={p.icon} className="mr-2" />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium">{p.label}</p>
                      <p className="text-xs text-gray-400">{p.description}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="w-full mt-4 relative">
          <img src={newMessageIcon} className="absolute left-2 top-2" />
          <textarea
            className="resize-none rounded border-2 border-gray-200 w-full focus:outline-blue-500 pl-10 p-2"
            placeholder="Add a message"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
        </div>
      </NotificationModal>
    </div>
  );
};

export default ShareModal;
