// FileDetailsModal.tsx
import React from "react";
import { DetailsTab } from "./DetailsTab";
import { ActivityTab } from "./ActivityTab";
import { MdInsertDriveFile, MdClose } from "react-icons/md";
import { File } from "../../../Types";

interface FileDetailsModalProps {
  closeModal: () => void;
  file: File | undefined;
}

const FileDetailsModal: React.FC<FileDetailsModalProps> = ({
  closeModal,
  file,
}) => {
  const [activeTab, setActiveTab] = React.useState("details");

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={closeModal}
      ></div>
      <div className="fixed right-0 bottom-0 w-64 h-full bg-white shadow-lg rounded z-50">
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center space-x-2">
            <MdInsertDriveFile className="text-2xl w-6 h-6" />
            <h2 className="font-semibold text-sm">{file && file.name}</h2>
          </div>
          <button onClick={closeModal}>
            <MdClose className="text-md text-gray-400" />
          </button>
        </div>
        <div className="flex border-b text-xs">
          <button
            className={`flex-1 p-1 ${
              activeTab === "details"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("details")}
          >
            Details
          </button>
          <button
            className={`flex-1 p-1 ${
              activeTab === "activity"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("activity")}
          >
            Activity
          </button>
        </div>
        {activeTab === "details" ? (
          <DetailsTab file={file && file} />
        ) : (
          <ActivityTab />
        )}
      </div>
    </>
  );
};

export default FileDetailsModal;
