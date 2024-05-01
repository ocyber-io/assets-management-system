import React from "react";
import OverviewTopBar from "../overview/OverviewTopBar";
import Breadcrumbs from "../../components/Breadcrumbs";
import RecentFiles from "../overview/RecentFiles";
import { files } from "../../helpers/sampleDocumentLinksData";

const DocumentLinks: React.FC = () => {
  return (
    <>
      <Breadcrumbs fromDocumentLinks={true} />
      <OverviewTopBar heading="Document Links" />
      <RecentFiles files={files} />
    </>
  );
};

export default DocumentLinks;
