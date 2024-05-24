import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useDispatch } from "react-redux";
import crossIcon from "../../assets/icons/cross.svg";
import fileUploadIcon from "../../assets/icons/fileUpload.svg";
import modalUploadIcon from "../../assets/icons/modalUpload.svg";
import { replaceFile } from "../../reducers/file/fileThunks";
import { AppDispatch } from "../../stores/store";
import NotificationModal from "./NotificationModal";

import dummyCompressed from "../../assets/images/compressedDummy.svg";
import dummyImage from "../../assets/images/dummyDocument.svg";
import dummyVideo from "../../assets/images/dummyVideo.svg";
import {
  saveNewFileDetails,
  saveOldFileDetails,
} from "../../reducers/file/fileDetailsSlice";
import { convertImageToBase64, formatFilenameInSuccessModal } from "../../utils/helpers";
import { jwtDecode } from "jwt-decode";

type ReplaceFileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  fileDetails: any;
  toggleReplaceSuccessModal: (base64Image: string | null) => void;
  fetchAllFiles: () => void;
};

const ReplaceFileModal: React.FC<ReplaceFileModalProps> = ({
  isOpen,
  onClose,
  fileDetails,
  toggleReplaceSuccessModal,
  fetchAllFiles,
}) => {
  const [fileDescription, setFileDescription] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);  // State for Base64 image
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [userId, setUserId] = useState<string | undefined>();
  const dispatch = useDispatch<AppDispatch>();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<{ id: string }>(token);
        setUserId(decoded.id);
      } catch (error) {
        console.error("Failed to decode JWT:", error);
      }
    }
  }, [token]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (acceptedFiles: File[]) => {
      setFile(acceptedFiles[0]);
      simulateFileUpload(acceptedFiles[0]);
      
      if (acceptedFiles[0].type.startsWith("image/")) {
        const base64 = await convertImageToBase64(acceptedFiles[0]);
        setBase64Image(base64);  // Set the Base64 image state
      } else {
        setBase64Image(null);  // Clear the Base64 image state if the file is not an image
      }
    },
  });

  const simulateFileUpload = (file: File) => {
    const fileSize = file.size;
    let uploaded = 0;
    const chunkSize = fileSize / 100;

    const interval = setInterval(() => {
      uploaded += chunkSize;
      const progress = (uploaded / fileSize) * 100;
      setUploadProgress(progress);
      if (uploaded >= fileSize) {
        clearInterval(interval);
        setUploadProgress(100);
      }
    }, 50);
  };

  const handleReplaceFile = async () => {
    dispatch(saveOldFileDetails(fileDetails));
    if (file && userId && uploadProgress >= 100) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("description", fileDescription);
      formData.append("tags", tags.join(","));
      formData.append("userId", userId);

      await dispatch(
        replaceFile({ fileId: fileDetails._id, fileData: formData })
      )
        .then(async (response) => {
          await dispatch(saveNewFileDetails(response.payload));
          onClose();
          toggleReplaceSuccessModal(base64Image);
        })
        .catch((error) => {
          console.error("Replace file failed: ", error);
        });
    } else {
      console.error("File upload is incomplete or missing necessary data.");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && tagInput) {
      event.preventDefault();
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeFile = () => {
    setFile(null);
    setFileDescription("");
    setUploadProgress(0);
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  const renderFileSection = () => {
    if (!file) return null;

    return (
      <div className="flex justify-start flex-col w-full md:flex-row items-center p-2 mb-4 bg-white border-2 border-gray-200 rounded">
        <div className="flex justify-start w-full">
          <div className="p-2 bg-blue-50 rounded-md w-10 h-10 mt-1">
            <img src={fileUploadIcon} alt="File Icon" className="w-6 h-6" />
          </div>
          <div className=" w-3/4">
            <p className="ml-2">{file.name}</p>
            <p className="text-sm text-gray-500 ml-2">
              {(file.size / 1024).toFixed(2)} KB
            </p>
          </div>
        </div>
        <div className="flex md:justify-end items-start justify-start md:mt-0 mt-2 w-full">
          <div className="md:w-36 w-80 flex mr-2 items-center rounded overflow-hidden">
            <div
              className="bg-blue-500 h-2 rounded"
              style={{ width: `${uploadProgress}%` }}
            ></div>
            <span className="ml-1 text-xs">{uploadProgress.toFixed(0)}%</span>
          </div>
          <button
            onClick={removeFile}
            style={{ border: "none", background: "transparent" }}
          >
            <img src={crossIcon} className="md:mt-0 mt-0.5" alt="Remove" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <NotificationModal
      isOpen={isOpen}
      closeModal={onClose}
      onSubmit={handleReplaceFile}
      submitButtonText="Replace File"
      heading="Replace File"
    >
      <div className="mt-5">
        <h1 className="font-medium">Old File</h1>
        <div className="flex mt-3">
          <div className=" rounded">
            <div className=" p-2 flex border-2 border-gray-200 justify-center items-center w-36 h-24 overflow-hidden">
              {fileDetails.type && fileDetails.type.startsWith("image/") ? (
                <img
                  src={fileDetails.link}
                  alt={fileDetails.originalName}
                  className="max-h-24 w-full mt-3 object-cover "
                />
              ) : fileDetails.type && fileDetails.type.startsWith("video/") ? (
                <img
                  src={dummyVideo} // Placeholder thumbnail for video files
                  alt="Video Thumbnail"
                  className="max-h-24 w-full mb-1 object-cover opacity-80"
                />
              ) : fileDetails.type &&
                (fileDetails.type === "application/zip" ||
                  fileDetails.type === "application/octet-stream") ? (
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
          <div className="md:py-2 pl-3 mt-1">
            <p>
              File Name:{" "}
              <span>
                {fileDetails &&
                  formatFilenameInSuccessModal(fileDetails.originalName)}
              </span>
            </p>
            <p>
              File Type: <span>{fileDetails && fileDetails.type}</span>
            </p>
            <p>
              File Size:{" "}
              <span className="text-gray-400">
                {fileDetails && fileDetails.size}
              </span>
            </p>
          </div>
        </div>
      </div>
      <h1 className="mt-6 mb-4 font-medium">Upload new file</h1>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed bg-blue-50 ${
          isDragActive ? "border-blue-500" : "border-gray-300"
        } rounded-md px-4 py-10 text-center mb-4 cursor-pointer`}
      >
        <input {...getInputProps()} />
        <div className="w-full justify-center flex mb-6">
          <div className="p-2 bg-white rounded-full">
            <img src={modalUploadIcon} alt="Upload icon" />
          </div>
        </div>
        {isDragActive ? (
          <p className="text-blue-500">Drop the file here...</p>
        ) : (
          <p>
            <span className="text-blue-500 underline">Click to upload</span> or
            drag & drop any file
          </p>
        )}
      </div>

      {file && uploadProgress >= 100 && renderFileSection()}

      <div>
        <label htmlFor="description" className="font-semibold text-lg">
          Description
        </label>
        <input
          type="text"
          id="description"
          placeholder="Enter file description"
          value={fileDescription}
          onChange={(e) => setFileDescription(e.target.value)}
          className="border-2 border-gray-200 rounded-md p-2 w-full mb-2 mt-1 focus:outline-blue-500"
        />
      </div>

      <div className="mb-4 mt-1">
        <label htmlFor="tags" className="font-semibold text-lg mb-1">
          Tags
        </label>
        <div className="border-2 border-gray-200 mt-1 rounded-md px-2 py-1 flex flex-wrap items-center">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="flex items-center bg-white shadow pl-3 pr-1 py-1 rounded text-sm font-semibold text-gray-700 mr-2"
            >
              {tag}
              <button
                onClick={() => removeTag(index)}
                className="ml-2 text-gray-400 hover:text-gray-700"
              >
                &times;
              </button>
            </span>
          ))}
          <input
            type="text"
            placeholder={tags.length === 0 ? "Add tags" : ""}
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 min-w-[100px] pr-8 py-1 rounded-md focus:outline-none"
          />
        </div>
        <div className="mt-2">
          {file && uploadProgress < 100 && renderFileSection()}
        </div>
      </div>
    </NotificationModal>
  );
};

export default ReplaceFileModal;
