import React from "react";
import noTagsImgae from "../../assets/images/no-tags.svg";
import { files } from "../../helpers/sampleTableData";
import RecentFiles from "../overview/RecentFiles";

const Tags: React.FC = () => {
  return (
    <>
      <div className="bg-white rounded-md border-2 border-gray-200 mt-2 min-h-screen">
        <h1 className="text-lg text-gray-600 font-semibold pl-4 mt-8">Tags</h1>
        {files.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-12">
            <img src={noTagsImgae} alt="No Tags" className="max-w-xs mb-4" />
            <h2 className="text-xl font-semibold">No Tagged Files Found</h2>
            <p className="text-center text-sm mt-2 max-w-lg text-gray-400">
              Your tagged files collection is currently empty. <br />
              Start organizing your documents by adding tags to easily find them
              later.
            </p>
          </div>
        ) : (
          <>
            <RecentFiles />
          </>
        )}
      </div>
    </>
  );
};

export default Tags;
