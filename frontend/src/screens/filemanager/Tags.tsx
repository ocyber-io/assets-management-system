import React, { useEffect, useState } from "react";
import noTagsImage from "../../assets/images/no-tags.svg";
import RecentFiles from "../overview/RecentFiles";
import TagBubbles from "./TagBubbles";
import { selectFiles } from "../../reducers/file/fileSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../stores/store";
import { fetchFiles } from "../../reducers/file/fileThunks";
import { jwtDecode } from "jwt-decode";

const Tags: React.FC = () => {
  const files = useSelector(selectFiles);
  const [userId, setUserId] = useState<string>();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const token = localStorage.getItem("token");
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<{
          id: string;
        }>(token);
        if (decoded) {
          setUserId(decoded.id);
        }
      } catch (error) {
        console.error("Failed to decode JWT:", error);
      }
    }
  }, [token]);

  useEffect(() => {
    if (userId) dispatch(fetchFiles(userId));
  }, [dispatch, userId]);

  const allTags = Array.from(new Set(files.flatMap((file) => file.tags)));

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filteredFiles = files.filter(
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
            <RecentFiles tagFiles={filteredFiles} />
          </>
        )}
      </div>
    </>
  );
};

export default Tags;
