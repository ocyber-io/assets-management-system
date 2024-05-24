import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../stores/store";
import { addFile } from "../reducers/file/fileThunks";
import crossIcon from "../assets/icons/cross.svg";
import fileUploadIcon from "../assets/icons/fileUpload.svg";
import modalUploadIcon from "../assets/icons/modalUpload.svg";
import { jwtDecode } from "jwt-decode";
import { showErrorToast, showSuccessToast } from "../utils/toast";
import { FaTimes } from "react-icons/fa";
import { selectLoading } from "../reducers/file/fileSlice";

type FileUploadModalProps = {
  isOpen: boolean;
  closeModal: () => void;
};

const FileUploadModal: React.FC<FileUploadModalProps> = ({
  isOpen,
  closeModal,
}) => {
  const [fileDescription, setFileDescription] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [userId, setUserId] = useState<string | undefined>();
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector(selectLoading);

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
    onDrop: (acceptedFiles: File[]) => {
      setFile(acceptedFiles[0]);
      simulateFileUpload(acceptedFiles[0]);
    },
  });

  const simulateFileUpload = (file: File) => {
    const fileSize = file.size;
    let uploaded = 0;
    const chunkSize = fileSize / 100; // Dividing into 100 pieces

    const interval = setInterval(() => {
      uploaded += chunkSize;
      const progress = (uploaded / fileSize) * 100;
      setUploadProgress(progress);
      if (uploaded >= fileSize) {
        clearInterval(interval);
        setUploadProgress(100); // Ensure it's exactly 100 at the end
      }
    }, 10); // Update every 50ms
  };

  const handleFileUpload = async () => {
    if (file && userId && uploadProgress >= 100) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("description", fileDescription);
      formData.append("tags", tags.join(","));
      formData.append("userId", userId);

      dispatch(addFile(formData))
        .unwrap() // Assuming addFile is a thunk that returns a Promise
        .then(() => {
          showSuccessToast("File uploaded successfully!");
          closeModal();
          resetForm();
        })
        .catch((error) => {
          showErrorToast("Upload failed: " + error.message);
        });
    } else {
      showErrorToast("Wait until the file has completely uploaded.");
    }
  };

  const resetForm = () => {
    setFile(null);
    setFileDescription("");
    setTags([]);
    setUploadProgress(0);
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
      <div className="flex justify-start flex-col w-full  md:flex-row items-center p-2 mb-4 bg-white border-2 border-gray-200 rounded">
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
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <div className="flex w-full justify-between">
          <h3 className="font-semibold text-xl mb-4">Upload New File</h3>
          <button
            className=" mt-[-50px] mr-[-16px] text-gray-500 hover:text-gray-700"
            onClick={closeModal}
          >
            <FaTimes size={20} />
          </button>
        </div>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed bg-blue-50 ${
            isDragActive ? "border-blue-500 border-dashed" : "border-blue-500"
          } rounded-md px-4 py-10 text-center mb-4 cursor-pointer`}
        >
          <div className="w-full justify-center flex mb-6">
            <div className="p-2 bg-white rounded-full">
              <img src={modalUploadIcon} />
            </div>
          </div>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-blue-500">Drop the file here...</p>
          ) : (
            <p>
              <span className="text-blue-500 underline">Click to upload</span>{" "}
              or drag & drop any file
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
        </div>

        {file && uploadProgress < 100 && renderFileSection()}

        <div className="flex items-center w-full justify-between space-x-4">
          <button
            className="text-gray-500 border-2 border-gray-200 w-full hover:bg-gray-50 font-semibold py-2 px-4 rounded transition duration-150 ease-in-out"
            onClick={closeModal}
          >
            Close
          </button>
          <button
            className="bg-blue-500 flex justify-center w-full hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
            onClick={handleFileUpload}
          >
            Import
            {loading && (
              <div className="ml-2 w-4 h-4 border-2 border-t-2 mt-1 border-white rounded-full animate-spin"></div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileUploadModal;
