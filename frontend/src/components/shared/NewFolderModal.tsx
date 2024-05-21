import React, { useEffect, useState } from "react";
import NotificationModal from "./NotificationModal";
import { AppDispatch } from "../../stores/store";
import { useDispatch } from "react-redux";
import { addFolder } from "../../reducers/folder/folderThunk";
import { jwtDecode } from "jwt-decode";
import { showErrorToast, showSuccessToast } from "../../utils/toast";

type NewFolderProps = {
  isOpen: boolean;
  onClose: () => void;
  onCancel: () => void;
};

const NewFolderModal: React.FC<NewFolderProps> = ({
  isOpen,
  onClose,
  onCancel,
}) => {
  const [folderName, setFolderName] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const token = localStorage.getItem("token");
  const [userId, setUserId] = useState<string>();

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

  const colors = [
    "#f44336",
    "#e91e63",
    "#9c27b0",
    "#673ab7",
    "#3f51b5",
    "#2196f3",
    "#03a9f4",
    "#00bcd4",
    "#009688",
    "#4caf50",
    "#8bc34a",
    "#cddc39",
    "#ffeb3b",
    "#ffc107",
    "#ff9800",
    "#ff5722",
    "#795548",
    "#9e9e9e",
    "#607d8b",
    "#ff4081",
    "#e040fb",
    "#7c4dff",
    "#536dfe",
    "#448aff",
  ];

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
  };

  const submitHandler = async () => {
    if (!userId) return;

    if (folderName === "") {
      showErrorToast("Please enter the folder name");
      return;
    }
    let colorToSend = selectedColor || "#9e9e9e";
    const folderData = {
      folderName: folderName,
      folderColor: colorToSend,
      userId: userId,
    };
    try {
      await dispatch(addFolder(folderData)).unwrap();
      showSuccessToast("Folder created successfully");
      setFolderName("");
      setSelectedColor("");
      onClose();
    } catch (error: any) {
      showErrorToast(error || "An error occurred while moving the file.");
    }
  };
  return (
    <div>
      <NotificationModal
        heading="Create a Folder"
        headingStyles="font-semibold text-xl"
        closeModal={onClose}
        submitButtonText="Create Folder"
        submitButtonStyle="bg-blue-500 hover:bg-blue-600"
        cancelButtonStyle=" bg-transparent border-2 border-gray-200 hover:bg-blue-50"
        cancelButtonText="Cancel"
        isOpen={isOpen}
        onSubmit={submitHandler} // Passing folder name and color to onSubmit
        onCancel={onCancel}
      >
        <div className="w-full mt-4">
          <label htmlFor="foldername" className="font-semibold">
            Folder Name
          </label>
          <input
            id="foldername"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            className="resize-none rounded border-2 mt-1 border-gray-200 w-full focus:outline-blue-500 p-2"
            placeholder="Enter your folder name"
          />
        </div>
        <div className="mt-4">
          <h1 className="mb-1 font-semibold">Folder Color</h1>
          <div className="flex flex-wrap -mx-1">
            {colors.map((color) => (
              <div key={color} className={`w-1/12 p-1 mt-1`}>
                <button
                  className={`h-5 w-5  rounded-full cursor-pointer`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorSelect(color)}
                  aria-label={`Select color ${color}`}
                >
                  {selectedColor === color && (
                    <div className="h-full w-full rounded-full border border-white outline outline-blue-500" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </NotificationModal>
    </div>
  );
};

export default NewFolderModal;
