import React, { useState } from "react";
import OverviewTopBar from "../overview/OverviewTopBar";
import Breadcrumbs from "../../components/Breadcrumbs";
import RecentFiles from "../overview/RecentFiles";
import { selectFiles } from "../../reducers/file/fileSlice";
import { useSelector } from "react-redux";

const DocumentLinks: React.FC = () => {
  const files = useSelector(selectFiles);
  let undeletedFiles = files.filter((file) => !file.isDeleted);

  const [isSorted, setIsSorted] = useState(false);

  const toggleSort = () => {
    setIsSorted(!isSorted);
  };

  const sortHandler = () => {
    toggleSort();
  };

  if (isSorted) {
    undeletedFiles = undeletedFiles.sort((a, b) => {
      // Assuming you want to sort by file name
      return b.createdAt.localeCompare(a.createdAt);
    });
  }

  return (
    <>
      <Breadcrumbs fromDocumentLinks={true} />
      <OverviewTopBar
        heading="Document Links"
        isSorted={isSorted}
        sortHandler={sortHandler}
      />
      <RecentFiles
        files={undeletedFiles}
        showFullLink={true}
        filesPerPage={8}
      />
    </>
  );
};

export default DocumentLinks;
