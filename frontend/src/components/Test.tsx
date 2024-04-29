import React, { useState } from "react";
import WarningModal from "../components/shared/WarningModal"; // Ensure path is correct
import DeleteModal from "../components/shared/DeleteModal"; // Ensure path is correct
import LinkModal from "../components/shared/LinkModal"; // Ensure path is correct

const Test: React.FC = () => {
  const [showWarningModal, setShowWarningModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showLinkModal, setShowLinkModal] = useState<boolean>(false); // State for LinkModal visibility

  const handleWarningAction = () => {
    console.log("Action taken from Test component");
  };

  const handleDeleteAction = () => {
    console.log("Delete action taken");
    setShowDeleteModal(false);
  };

  const link = "https://example.com/shared-link"; // Define the link that will be shown in the LinkModal

  return (
    <div className="TestComponent">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => setShowWarningModal(!showWarningModal)}
      >
        Toggle Warning Modal
      </button>
      {showWarningModal && (
        <WarningModal
          heading="Disable File?"
          description="Disabling this file will render its link inactive. Any shared links to this file will no longer be accessible to recipients."
          onSubmit={handleWarningAction}
          submitButtonText="Disable"
        />
      )}

      <button
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
        onClick={() => setShowDeleteModal(!showDeleteModal)}
      >
        Toggle Delete Modal
      </button>
      {showDeleteModal && (
        <DeleteModal
          heading="Delete File?"
          description="Are you sure you want to delete this file?"
          onSubmit={handleDeleteAction}
          submitButtonText="Yes, Delete"
        />
      )}

      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
        onClick={() => setShowLinkModal(!showLinkModal)}
      >
        Toggle Link Modal
      </button>
      {showLinkModal && (
        <LinkModal
          isOpen={showLinkModal}
          heading="Full Link"
          link={link}
          closeModal={() => setShowLinkModal(false)}
        />
      )}
    </div>
  );
};

export default Test;
