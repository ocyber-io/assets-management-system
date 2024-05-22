import React from "react";
import successfullReplaceImage from "../../assets/images/file-replacement-success.svg";
import NotificationModal from "./NotificationModal";

import dummyCompressed from "../../assets/images/compressedDummy.svg";
import dummyImage from "../../assets/images/dummyDocument.svg";
import dummyVideo from "../../assets/images/dummyVideo.svg";

import { useSelector } from "react-redux";
import { File } from "../../Types";
import { RootState } from "../../stores/store";
import { formatFilenameInSuccessModal } from "../../utils/helpers";

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

  console.log({ oldFileDetails });
  console.log({ newFileDetails });

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
            <div className=" rounded">
              <div className=" p-2 flex border-2 border-gray-200 justify-center items-center w-36 h-24 overflow-hidden">
                {oldFileDetails.type &&
                oldFileDetails.type.startsWith("image/") ? (
                  <img
                    src={oldFileDetails.link}
                    alt={oldFileDetails.originalName}
                    className="max-h-24 w-full mt-3 object-cover "
                  />
                ) : oldFileDetails.type &&
                  oldFileDetails.type.startsWith("video/") ? (
                  <img
                    src={dummyVideo} // Placeholder thumbnail for video files
                    alt="Video Thumbnail"
                    className="max-h-24 w-full mb-1 object-cover opacity-80"
                  />
                ) : oldFileDetails.type &&
                  (oldFileDetails.type === "application/zip" ||
                    oldFileDetails.type === "application/octet-stream") ? (
                  <img
                    src={dummyCompressed} // Placeholder for compressed files
                    alt="Compressed File"
                    className="max-h-24 w-full mb-1 object-cover opacity-80"
                  />
                ) : (
                  <img
                    src={dummyImage}
                    alt="Dummy Image"
                    className=" max-h-24 w-full mb-1 object-cover opacity-80"
                  />
                )}
              </div>
            </div>
            <div className="md:py-2 pl-3">
              <p>
                File Name:{" "}
                <span>
                  {oldFileDetails &&
                    formatFilenameInSuccessModal(oldFileDetails.originalName)}
                </span>
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
            <div className=" rounded">
              <div className=" p-2 flex border-2 border-gray-200 justify-center items-center w-36 h-24 overflow-hidden">
                {newFileDetails.type &&
                newFileDetails.type.startsWith("image/") ? (
                  <img
                    src={newFileDetails.link}
                    alt={newFileDetails.originalName}
                    className="max-h-24 w-full mt-3 object-cover "
                  />
                ) : newFileDetails.type &&
                  newFileDetails.type.startsWith("video/") ? (
                  <img
                    src={dummyVideo} // Placeholder thumbnail for video files
                    alt="Video Thumbnail"
                    className="max-h-24 w-full mb-1 object-cover opacity-80"
                  />
                ) : newFileDetails.type &&
                  (newFileDetails.type === "application/zip" ||
                    newFileDetails.type === "application/octet-stream") ? (
                  <img
                    src={dummyCompressed} // Placeholder for compressed files
                    alt="Compressed File"
                    className="max-h-24 w-full mb-1 object-cover opacity-80"
                  />
                ) : (
                  <img
                    src={dummyImage}
                    alt="Dummy Image"
                    className=" max-h-24 w-full mb-1 object-cover opacity-80"
                  />
                )}
              </div>
            </div>
            <div className="md:py-2 pl-3">
              <p>
                File Name:{" "}
                <span>
                  {newFileDetails &&
                    formatFilenameInSuccessModal(newFileDetails.originalName)}
                </span>
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
