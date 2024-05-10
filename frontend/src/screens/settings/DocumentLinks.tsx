import React from "react";
import OverviewTopBar from "../overview/OverviewTopBar";
import Breadcrumbs from "../../components/Breadcrumbs";
import RecentFiles from "../overview/RecentFiles";

const DocumentLinks: React.FC = () => {
  return (
    <>
      <Breadcrumbs fromDocumentLinks={true} />
      <OverviewTopBar heading="Document Links" />
      <RecentFiles showFullLink={true} filesPerPage={8} />
    </>
  );
};

export default DocumentLinks;
