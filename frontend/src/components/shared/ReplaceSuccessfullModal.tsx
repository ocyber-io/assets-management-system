import React from "react";
import replaceFileImage from "../../assets/images/replace-file.svg";
import replaceFileImage2 from "../../assets/images/replace-file2.svg";
import successfullReplaceImage from "../../assets/images/file-replacement-success.svg";
import NotificationModal from "./NotificationModal";

import { File } from "../../Types";

type ReplaceSuccessfullModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  fileDetails: File;
};

const ReplaceSuccessfullModal: React.FC<ReplaceSuccessfullModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  fileDetails,
}) => {
  return (
    <div>
      <NotificationModal
        imageUrl={successfullReplaceImage}
        heading="File Replacement Successfull"
        descriptionAndHeadingPosition="text-center"
        description="The file has been successfully replaced with the new file."
        headingStyles="font-semibold text-xl"
        closeModal={onClose}
        submitButtonText="Continue"
        submitButtonStyle="bg-blue-500 hover:bg-blue-600"
        isOpen={isOpen}
        onSubmit={onSubmit}
      >
        <div className="mt-5">
          <h1 className="font-medium">Old File</h1>
          <div className="flex mt-3">
            <div className="p-1 border-2 border-gray-200 rounded">
              <img src={replaceFileImage} alt="Old file" />
            </div>
            <div className="py-2 pl-3">
              <p>
                File Name: <span>{fileDetails.name}</span>
              </p>
              <p>
                File Type: <span>{fileDetails.type}</span>
              </p>
              <p>
                File Size:{" "}
                <span className="text-gray-400">{fileDetails.size}</span>
              </p>
            </div>
          </div>
        </div>
        <div className="mt-5">
          <h1 className="font-medium">New File</h1>
          <div className="flex mt-3">
            <div className="p-1 border-2 border-gray-200 rounded">
              <img src={replaceFileImage2} alt="Old file" />
            </div>
            <div className="py-2 pl-3">
              <p>
                File Name: <span>{fileDetails.name}</span>
              </p>
              <p>
                File Type: <span>{fileDetails.type}</span>
              </p>
              <p>
                File Size:{" "}
                <span className="text-gray-400">{fileDetails.size}</span>
              </p>
            </div>
          </div>
        </div>
      </NotificationModal>
    </div>
  );
};

export default ReplaceSuccessfullModal;
