import React from "react";
import listRowLoadingImage from "../assets/images/list-row.svg";

type ListLoadingProps = {
  count: number; // This prop specifies the number of loading images to display
};

const ListLoading: React.FC<ListLoadingProps> = ({ count }) => {
  return (
    <div className="flex w-full flex-col opacity-45">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="mt-10">
          <img src={listRowLoadingImage} alt="card" />
        </div>
      ))}
    </div>
  );
};

export default ListLoading;
