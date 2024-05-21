import { useSelector } from "react-redux";
import noFavoritesImage from "../../../assets/images/no-favorites.svg";
import RecentFiles from "../../overview/RecentFiles";
import { selectFiles } from "../../../reducers/file/fileSlice";

const Favorites: React.FC = () => {
  const files = useSelector(selectFiles);
  const favoriteFiles = files.filter(
    (file) => !file.isDeleted && file.isFavorite
  );

  return (
    <>
      <div className="bg-white rounded-md border-2 border-gray-200 mt-2 min-h-screen">
        <h1 className="text-lg text-gray-600 font-semibold pl-4 mt-8">
          Favorites
        </h1>
        {favoriteFiles && favoriteFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-12">
            <img
              src={noFavoritesImage}
              alt="No Tags"
              className="max-w-xs mb-4"
            />
            <h2 className="text-xl font-semibold">No Favorites Yet</h2>
            <p className="text-center text-sm mt-2 max-w-lg text-gray-400">
              Haven't found anything worth starring yet? Add stars to the files
              you want to easily find later.
            </p>
          </div>
        ) : (
          <>
            <RecentFiles
              tagFiles={favoriteFiles}
              fromFavorites={true}
              files={favoriteFiles}
              filesPerPage={8}
            />
          </>
        )}
      </div>
    </>
  );
};

export default Favorites;
