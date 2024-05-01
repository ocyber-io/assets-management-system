import React from "react";
import testImage from "../../assets/test/test.jpg";
import test2Image from "../../assets/test/test2.jpg";
import test3Image from "../../assets/test/test3.jpg";
import test4Image from "../../assets/test/test4.jpg";
import { MdMoreVert } from "react-icons/md";

// Define the interface for each file in the array
interface FileItem {
  id: number;
  thumbnail: string;
  name: string;
  type: string;
}

const recentFiles: FileItem[] = [
  {
    id: 1,
    thumbnail: testImage,
    name: "HolidayPhoto.jpg",
    type: "image",
  },
  {
    id: 2,
    thumbnail: test2Image,
    name: "ProjectCode.js",
    type: "code",
  },
  {
    id: 3,
    thumbnail: test3Image,
    name: "Report.docx",
    type: "doc",
  },
  {
    id: 4,
    thumbnail: test4Image,
    name: "Archive.zip",
    type: "zip",
  },
];

const RecentStorage: React.FC = () => {
  return (
    <div className="md:px-8 px-3 py-3">
      <h2 className="text-2xl font-bold mb-6">Recent Storage</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 md:gap-8 gap-3">
        {recentFiles.map((file) => (
          <div
            key={file.id}
            className="bg-white rounded-lg border-2 border-gray-200 flex flex-col justify-between"
          >
            <div className="px-4 pt-4 flex justify-center items-center flex-grow">
              <img
                src={file.thumbnail}
                alt={file.name}
                className="max-h-32 w-full object-cover"
                style={{ margin: "2px 2px 0 2px" }}
              />
            </div>
            <div className="flex justify-between items-center px-3 py-3 border-t-2 border-gray-200">
              <p className="text-sm text-gray-700">{file.name}</p>
              <button className="text-gray-600 hover:text-gray-800">
                <MdMoreVert size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentStorage;
