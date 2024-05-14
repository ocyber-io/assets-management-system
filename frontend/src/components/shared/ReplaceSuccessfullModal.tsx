import React from "react";
import successfullReplaceImage from "../../assets/images/file-replacement-success.svg";
import replaceFileImage from "../../assets/images/replace-file.svg";
import replaceFileImage2 from "../../assets/images/replace-file2.svg";
import NotificationModal from "./NotificationModal";

import { useSelector } from "react-redux";
import { File } from "../../Types";
import { RootState } from "../../stores/store";

type ReplaceSuccessfullModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  fileDetails: File | undefined;
};

const ReplaceSuccessfullModal: React.FC<ReplaceSuccessfullModalProps> = ({
  isOpen,
  onClose,
}) => {
  const oldFileDetails = useSelector(
    (state: RootState) => state.fileDetails.oldFileDetails
  );
  const newFileDetails = useSelector(
    (state: RootState) => state.fileDetails.newFileDetails
  );

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
        onSubmit={onClose}
      >
        <div className="mt-5">
          <h1 className="font-medium">Old File</h1>
          <div className="flex mt-3">
            <div className="p-1 border-2 border-gray-200 rounded">
              <img src={replaceFileImage} alt="Old file" />
            </div>
            <div className="py-2 pl-3">
              <p>
                File Name:{" "}
                <span>{oldFileDetails && oldFileDetails.originalName}</span>
              </p>
              <p>
                File Type: <span>{oldFileDetails && oldFileDetails.type}</span>
              </p>
              <p>
                File Size:{" "}
                <span className="text-gray-400">
                  {oldFileDetails && oldFileDetails.size}
                </span>
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
                File Name:{" "}
                <span>{newFileDetails && newFileDetails.originalName}</span>
              </p>
              <p>
                File Type: <span>{newFileDetails && newFileDetails.type}</span>
              </p>
              <p>
                File Size:{" "}
                <span className="text-gray-400">
                  {newFileDetails && newFileDetails.size}
                </span>
              </p>
            </div>
          </div>
        </div>
      </NotificationModal>
    </div>
  );
};

export default ReplaceSuccessfullModal;
