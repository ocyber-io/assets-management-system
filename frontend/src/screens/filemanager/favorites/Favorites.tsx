import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../stores/store";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { getUserById } from "../../../reducers/user/userThunks";
import { selectUser } from "../../../reducers/user/userSlice";
import RecentFiles from "../../overview/RecentFiles";

const Favorites: React.FC = () => {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch<AppDispatch>();
  const [userId, setUserId] = useState<string>();
  const user = useSelector(selectUser);
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
    if (userId) dispatch(getUserById(userId));
  }, [dispatch, userId]);

  const undeletedFiles = user?.favoriteFiles.filter((file) => !file.isDeleted);

  return (
    <div>
      <h1 className="text-lg px-6 pt-4 font-bold mb-6 text-gray-800">
        Favorites
      </h1>

      <RecentFiles tagFiles={undeletedFiles} />
    </div>
  );
};

export default Favorites;
