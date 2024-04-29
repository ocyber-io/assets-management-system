import React, { useEffect } from "react";
import useFileStore from "../stores/fileUploadStore";
import { FaFileAlt, FaFilePdf, FaFileWord, FaImage } from "react-icons/fa";

const getFileIcon = (filetype) => {
  if (filetype.includes("image"))
    return <FaImage size={50} className="text-blue-500" />;
  if (filetype.includes("pdf"))
    return <FaFilePdf color="red" size={50} className="text-red-500" />;
  if (filetype.includes("word"))
    return <FaFileWord color="blue" size={50} className="text-blue-500" />;
  return <FaFileAlt size={50} className="text-gray-500" />;
};

const MyFiles = () => {
  const { files, fetchFiles, isLoading } = useFileStore();

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  return (
    <div className="container mx-auto px-4">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="flex flex-wrap -m-4">
          {files.map((file) => (
            <div key={file._id} className="p-4 md:w-1/3">
              <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
                <div className="p-6">
                  {file.filetype.includes("image") ? (
                    <img
                      src={`/uploads/${file.file}`}
                      alt={file.originalname}
                      className="lg:h-48 md:h-36 w-full object-cover object-center"
                    />
                  ) : (
                    <div className="flex justify-center items-center h-48">
                      {getFileIcon(file.filetype)}
                    </div>
                  )}
                  <h2 className="text-base font-medium text-indigo-600 mt-1">
                    {file.originalname}
                  </h2>
                  <p className="text-gray-600 text-xs mt-1">
                    Description: {file.description}
                  </p>
                  <div className="text-gray-500 text-sm mb-4">
                    Size: {(file.filesize / 1024).toFixed(2)} KB
                  </div>
                  <div>
                    {file.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyFiles;
