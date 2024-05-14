import React from "react";
import OverviewTopBar from "../overview/OverviewTopBar";
import Breadcrumbs from "../../components/Breadcrumbs";
import RecentFiles from "../overview/RecentFiles";
import { selectFiles } from "../../reducers/file/fileSlice";
import { useSelector } from "react-redux";

const DocumentLinks: React.FC = () => {
  const files = useSelector(selectFiles);
  const undeletedFiles = files.filter((file) => !file.isDeleted);

  return (
    <>
      <Breadcrumbs fromDocumentLinks={true} />
      <OverviewTopBar heading="Document Links" />
      <RecentFiles
        files={undeletedFiles}
        showFullLink={true}
        filesPerPage={8}
      />
    </>
  );
};

export default DocumentLinks;
