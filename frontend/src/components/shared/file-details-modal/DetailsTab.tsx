// DetailsTab.tsx
import React from "react";
import { File } from "../../../Types";

type DetailsTabProps = {
  file: File | undefined;
};

export const DetailsTab: React.FC<DetailsTabProps> = ({ file }) => {
  return (
    <div className="p-2">
      <img
        src={file && file.image}
        alt="File"
        className="w-full h-24 object-cover"
      />
      <h3 className="text-xs font-semibold mt-1.5">Who has access</h3>
      {/* Dummy for access visualization */}
      <div className="flex mt-1 items-center">
        <span className="block w-6 h-6 rounded-full bg-gray-300 text-center">
          U
        </span>
      </div>
      <h3 className="text-xs font-semibold mt-1.5">File Details</h3>
      <div className="text-xs">
        <p className="mt-1.5">
          <span className="font-semibold">Type:</span>
          <br /> {file && file.type}
        </p>
        <p className="mt-1.5">
          <span className="font-semibold">Size:</span>
          <br /> {file && file.size}
        </p>
        <p className="mt-1.5">
          <span className="font-semibold">Storage Used:</span>
          <br />
          {file && file.storageUsed}
        </p>
        <p className="mt-1.5">
          <span className="font-semibold">Location:</span>
          <br /> {file && file.location}
        </p>
        <p className="mt-1.5">
          <span className="font-semibold">Owner:</span>
          <br /> {file && file.owner}
        </p>
        <p className="mt-1.5">
          <span className="font-semibold">Modified:</span>
          <br /> {file && file.lastModified}
        </p>
        <p className="mt-1.5">
          <span className="font-semibold">Created:</span>
          <br /> {file && file.created}
        </p>
        <p className="mt-1.5">
          <span className="font-semibold">Download Permissions:</span>
          <br />
          {file && file.downloadPermission}
        </p>
        <div className="mt-1">
          <label htmlFor="description" className="font-semibold text-xs">
            Description
          </label>{" "}
          <br />
          <input
            type="text"
            name="description"
            id="description"
            placeholder="Add Description"
            className=" bg-blue-50 text-xs px-1 w-full py-2 rounded mt-0.5 focus:border-blue-500 focus:outline-none focus:border"
          />
        </div>
        <div className="">
          <label htmlFor="tags" className="font-semibold text-xs">
            Tags
          </label>{" "}
          <br />
          <input
            type="text"
            name="tags"
            id="tags"
            placeholder="Add Tags"
            className=" bg-blue-50 text-xs px-1 w-full py-2 rounded mt-0.5 focus:border-blue-500 focus:outline-none focus:border"
          />
        </div>
      </div>
    </div>
  );
};
