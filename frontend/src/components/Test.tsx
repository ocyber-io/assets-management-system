import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../stores/store";

const Test: React.FC = () => {
  const oldFileDetails = useSelector(
    (state: RootState) => state.fileDetails.oldFileDetails
  );
  const newFileDetails = useSelector(
    (state: RootState) => state.fileDetails.newFileDetails
  );

  console.log(oldFileDetails);
  console.log(newFileDetails);
  return (
    <div>
      <img src="http://localhost:5173/uploads/663887ef728d43c79d14fd15/file-1715672475612-644343822.jpg"></img>
    </div>
  );
};

export default Test;
