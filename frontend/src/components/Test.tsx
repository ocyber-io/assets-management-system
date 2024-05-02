import React, { useState } from "react";
import ReplaceFileModal from "./shared/ReplaceFileModal";
import ReplaceSuccessfullModal from "./shared/ReplaceSuccessfullModal"; // Adjust the path as needed
import { files } from "../helpers/sampleTableData";

const Test = () => {
  const [isReplaceModalOpen, setIsReplaceModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [fileDetails, setFileDetails] = useState(files[0]);

  const toggleReplaceModal = () => {
    setIsReplaceModalOpen(!isReplaceModalOpen);
  };

  const handleSubmit = () => {
    console.log("Submit new file details");
    toggleReplaceModal();
    toggleSuccessModal();
  };

  const handleCancelReplace = () => {
    console.log("Cancelled");
    toggleReplaceModal();
  };

  const toggleSuccessModal = () => {
    setIsSuccessModalOpen(!isSuccessModalOpen);
  };

  return (
    <div>
      <button onClick={toggleReplaceModal}>Replace File</button>
      {isReplaceModalOpen && (
        <ReplaceFileModal
          isOpen={isReplaceModalOpen}
          onClose={toggleReplaceModal}
          onSubmit={handleSubmit}
          onCancel={handleCancelReplace}
          fileDetails={fileDetails}
        />
      )}
      {isSuccessModalOpen && (
        <ReplaceSuccessfullModal
          isOpen={isSuccessModalOpen}
          onClose={toggleSuccessModal}
          onSubmit={() => console.log("Continue after success")}
          fileDetails={fileDetails}
        />
      )}
    </div>
  );
};

export default Test;
