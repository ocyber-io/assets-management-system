// DetailsTab.tsx
import React from "react";
import { File } from "../../../Types";
import { formatDate } from "../../../utils/helpers";

type DetailsTabProps = {
  file: File | undefined;
};

export const DetailsTab: React.FC<DetailsTabProps> = ({ file }) => {
  return (
    <div className="p-2">
      <img src={file?.link} alt="File" className="w-full h-24 object-cover" />
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
          <br /> {file?.type}
        </p>
        <p className="mt-1.5">
          <span className="font-semibold">Size:</span>
          <br /> {file?.size}
        </p>
        <p className="mt-1.5">
          <span className="font-semibold">Storage Used:</span>
          <br />
          {file?.storageUsed}
        </p>
        <p className="mt-1.5">
          <span className="font-semibold">Location:</span>
          <br /> {file?.location}
        </p>
        <p className="mt-1.5">
          <span className="font-semibold">Owner:</span>
          <br /> {file?.owner}
        </p>
        <p className="mt-1.5">
          <span className="font-semibold">Modified:</span>
          <br /> {file && formatDate(file.updatedAt)}
        </p>
        <p className="mt-1.5">
          <span className="font-semibold">Created:</span>
          <br /> {file && formatDate(file.createdAt)}
        </p>
        <p className="mt-1.5">
          <span className="font-semibold">Download Permissions:</span>
          <br />
          {file?.downloadPermission
            ? "Viewers can download"
            : "Unable to download"}
        </p>
        <div className="mt-2">
          <label htmlFor="description" className="font-semibold text-xs">
            Description
          </label>{" "}
          <br />
          <input
            type="text"
            name="description"
            id="description"
            value={file?.description}
            placeholder="Add Description"
            disabled
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
            disabled
            placeholder="Add Tags"
            value={file?.tags.join(", ")}
            className=" bg-blue-50 text-xs px-1 w-full py-2 rounded mt-0.5 focus:border-blue-500 focus:outline-none focus:border"
          />
        </div>
      </div>
    </div>
  );
};
