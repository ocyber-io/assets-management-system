import React, { useState } from "react";
import ReplaceSuccessfullModal from "./shared/ReplaceSuccessfullModal";

const Test: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const submitHandler = () => {
    console.log("submit");
  };

  const file = {
    id: 11,
    name: "Image.png",
    lastModified: "2023-04-16",
    link: "https://example.com/file5",
    type: "PNG",
    size: "2.5 MB",
    tags: ["image", "text"],
  };

  return (
    <div className="m-4">
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 bg-blue-500 text-white rounded"
      >
        Open Rename Modal
      </button>
      <ReplaceSuccessfullModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={submitHandler}
        fileDetails={file}
      ></ReplaceSuccessfullModal>
    </div>
  );
};
export default Test;
