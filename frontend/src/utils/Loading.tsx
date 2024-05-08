import React from "react";
type SpinnerProps = {
  dimensions: string;
};

const Loading: React.FC<SpinnerProps> = ({ dimensions }) => {
  return (
    <div className="flex justify-center items-center">
      <div
        className={`animate-spin rounded-full ${dimensions} border-b-2 border-gray-900`}
      ></div>
    </div>
  );
};

export default Loading;
