import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import crossIcon from "../assets/icons/cross.svg";
import fileUploadIcon from "../assets/icons/fileUpload.svg";
import modalUploadIcon from "../assets/icons/modalUpload.svg";

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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles: File[]) => {
      setFile(acceptedFiles[0]);
      simulateFileUpload(acceptedFiles[0]);
    },
  });

  const simulateFileUpload = (file: File) => {
    const fileSize = file.size;
    let uploaded = 0;
    const chunkSize = fileSize / 100;

    const interval = setInterval(() => {
      uploaded += chunkSize;
      setUploadProgress((uploaded / fileSize) * 100);
      if (uploaded >= fileSize) {
        clearInterval(interval);
      }
    }, 50);
  };

  const handleFileUpload = () => {
    console.log(file); // Implement actual file upload logic here
    alert("File upload functionality not implemented.");
  };

  const removeFile = () => {
    setFile(null);
    setFileDescription("");
    setUploadProgress(0);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && tagInput) {
      event.preventDefault();
      setTags([...tags, tagInput]);
      setTagInput("");
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  const renderFileSection = () => {
    if (!file) return null;

    return (
      <div className="flex justify-between flex-col md:flex-row items-center p-2 mb-4 bg-white border-2 border-gray-200 rounded">
        <div className="flex items-center">
          <div className="p-2 bg-blue-50 rounded-md">
            <img src={fileUploadIcon} alt="File Icon" />
          </div>
          <div>
            <p className="ml-2">{file.name}</p>
            <p className="text-sm text-gray-500 ml-2">
              {(file.size / 1024).toFixed(2)} KB
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-36 flex mr-2 items-center rounded overflow-hidden">
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
            <img src={crossIcon} alt="Remove" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h3 className="font-semibold text-xl mb-4">Upload New File</h3>
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
            className="bg-blue-500 w-full hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
            onClick={handleFileUpload}
          >
            Import
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileUploadModal;
