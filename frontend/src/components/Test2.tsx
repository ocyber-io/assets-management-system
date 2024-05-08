// Test2.tsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectFiles,
  selectLoading,
  selectError,
} from "../reducers/file/fileSlice"; // Adjust the import paths based on your project structure
import { AppDispatch } from "../stores/store";
import { fetchFiles } from "../reducers/file/fileThunks";
import { jwtDecode } from "jwt-decode";
import Loading from "../utils/Loading";

const Test2 = () => {
  const files = useSelector(selectFiles);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const dispatch = useDispatch<AppDispatch>();
  const [userId, setUserId] = useState<string>();
  const token = localStorage.getItem("token");

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

  if (loading) return <Loading dimensions="h-16 w-16" />;
  if (error) return <div>Error loading files: {error}</div>;

  return (
    <div className="container mx-auto p-4 grid grid-cols-3 gap-4">
      {files.map((file) => (
        <div key={file.id} className="card bg-white shadow-lg rounded-lg p-4">
          <img
            src={file.link}
            alt={file.name}
            className="w-full h-48 object-cover rounded-md"
          />
          <div className="p-4">
            <h5 className="text-lg font-bold">{file.name}</h5>
            <p className="text-gray-600">{file.description}</p>
            <p className="text-sm text-gray-500">
              Tags: {file.tags.join(", ")}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Test2;
