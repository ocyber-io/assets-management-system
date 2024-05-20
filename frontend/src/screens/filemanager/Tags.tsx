import React, { useState } from "react";
import { useSelector } from "react-redux";
import noTagsImage from "../../assets/images/no-tags.svg";
import { selectFiles } from "../../reducers/file/fileSlice";
import RecentFiles from "../overview/RecentFiles";
import TagBubbles from "./TagBubbles";

const Tags: React.FC = () => {
  const files = useSelector(selectFiles);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const undeletedFiles = files.filter((file) => !file.isDeleted);

  const allTags = Array.from(
    new Set(undeletedFiles.flatMap((file) => file.tags))
  );

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filteredFiles = undeletedFiles.filter(
    (file) =>
      selectedTags.length === 0 ||
      file.tags.some((tag) => selectedTags.includes(tag))
  );

  return (
    <>
      <div className="bg-white rounded-md border-2 border-gray-200 mt-2 min-h-screen">
        <h1 className="text-lg text-gray-600 font-semibold pl-4 mt-8">Tags</h1>
        {filteredFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-12">
            <img src={noTagsImage} alt="No Tags" className="max-w-xs mb-4" />
            <h2 className="text-xl font-semibold">No Tagged Files Found</h2>
            <p className="text-center text-sm mt-2 max-w-lg text-gray-400">
              Your tagged files collection is currently empty. <br />
              Start organizing your documents by adding tags to easily find them
              later.
            </p>
          </div>
        ) : (
          <>
            <TagBubbles
              tags={allTags}
              selectedTags={selectedTags}
              onTagClick={toggleTag}
            />
            <RecentFiles
              tagFiles={filteredFiles}
              files={filteredFiles}
              filesPerPage={8}
            />
          </>
        )}
      </div>
    </>
  );
};

export default Tags;
