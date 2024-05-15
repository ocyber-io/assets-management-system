import { jwtDecode } from "jwt-decode";
import React, { useEffect, useMemo, useState } from "react";
import { MdMoreVert } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { selectError, selectFiles } from "../../reducers/file/fileSlice";
import { fetchFiles } from "../../reducers/file/fileThunks";
import { AppDispatch } from "../../stores/store";
import useIsMobile from "../../utils/IsMobile";
import { formatFilename } from "../../utils/helpers";
import dummyImage from "../../assets/images/dummyDocument.svg";
import dummyVideo from "../../assets/images/dummyVideo.svg";
import dummyCompressed from "../../assets/images/compressedDummy.svg";

const RecentStorage: React.FC = () => {
  const files = useSelector(selectFiles);
  const error = useSelector(selectError);
  const dispatch = useDispatch<AppDispatch>();
  const [userId, setUserId] = useState<string>();
  const token = localStorage.getItem("token");
  const isMobile = useIsMobile();

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<{
          id: string;
        }>(token);
        if (decoded) {
          setUserId(decoded.id);
        }
      } catch (error) {
        console.error("Failed to decode JWT:", error);
      }
    }
  }, [token]);

  useEffect(() => {
    if (userId) dispatch(fetchFiles(userId));
  }, [dispatch, userId]);

  const undeletedFiles = files.filter((file) => !file.isDeleted);

  const recentFiles = useMemo(() => {
    return [...undeletedFiles].reverse().slice(0, 4);
  }, [files]);

  if (error) return <div>Error loading files: {error}</div>;

  return (
    <div className="md:px-8 px-3 py-3">
      <h2 className="text-2xl font-bold mb-6">Recent Storage</h2>
      {/* {loading && <ImagesCard />} */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 md:gap-8 gap-3">
        {recentFiles.map((file, index) => (
          <>
            <React.Fragment key={index}>
              <div
                key={file._id}
                className="bg-white rounded-lg border-2 border-gray-200 flex flex-col justify-between"
              >
                <div className="px-4 pt-4 flex justify-center items-center flex-grow">
                  <div className=" flex justify-center items-center flex-grow">
                    {file.type && file.type.startsWith("image/") ? (
                      <img
                        src={file.link}
                        alt={file.originalName}
                        className="xl:max-h-32 max-h-20 w-full object-cover "
                        style={{ margin: "2px 2px 0 2px" }}
                      />
                    ) : file.type && file.type.startsWith("video/") ? (
                      <img
                        src={dummyVideo} // Placeholder thumbnail for video files
                        alt="Video Thumbnail"
                        className="xl:max-h-32 max-h-20 w-full object-cover opacity-80"
                        style={{ margin: "2px 2px 0 2px" }}
                      />
                    ) : file.type &&
                      (file.type === "application/zip" ||
                        file.type === "application/octet-stream") ? (
                      <img
                        src={dummyCompressed} // Placeholder for compressed files
                        alt="Compressed File"
                        className="xl:max-h-32 max-h-20 w-full object-cover opacity-80"
                        style={{ margin: "2px 2px 0 2px" }}
                      />
                    ) : (
                      <img
                        src={dummyImage}
                        alt="Dummy Image"
                        className="xl:max-h-32 max-h-20 w-full object-cover opacity-80"
                        style={{ margin: "2px 2px 0 2px" }}
                      />
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center px-3 py-3 border-t-2 border-gray-200">
                  <p className="text-sm text-gray-700 font-medium">
                    {formatFilename(file.originalName, isMobile)}
                  </p>
                  <button className="text-gray-600 hover:text-gray-800">
                    <MdMoreVert size={20} />
                  </button>
                </div>
              </div>
            </React.Fragment>
          </>
        ))}
      </div>
    </div>
  );
};

export default RecentStorage;
