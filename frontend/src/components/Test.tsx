import React, { useState } from "react";
import NewFolderModal from "./shared/NewFolderModal";

const Test: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const submitHandler = () => {
    console.log("submit");
  };
  const cancelHandler = () => {
    console.log("cancel or copy");
  };

  return (
    <div className="m-4">
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 bg-blue-500 text-white rounded"
      >
        Open Rename Modal
      </button>
      <NewFolderModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={submitHandler}
        onCancel={cancelHandler}
      ></NewFolderModal>
    </div>
  );
};
export default Test;
