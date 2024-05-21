import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../stores/store";
import { jwtDecode } from "jwt-decode";
import { showErrorToast, showSuccessToast } from "../../../utils/toast";
import NotificationModal from "../NotificationModal";
import { updateFolder } from "../../../reducers/folder/folderThunk"; // Import the updateFolder thunk

type ChangeColorProps = {
  isOpen: boolean;
  onClose: () => void;
  onCancel: () => void;
  folderId: string | null;
};

const ChangeColorModal: React.FC<ChangeColorProps> = ({
  isOpen,
  onClose,
  onCancel,
  folderId,
}) => {
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

    if (selectedColor === "") {
      showErrorToast("Please select a color");
      return;
    }

    try {
      if (!folderId) return;
      await dispatch(
        updateFolder({ folderId, updates: { folderColor: selectedColor } })
      ).unwrap();
      showSuccessToast("Folder color updated successfully");
      setSelectedColor("");
      onClose();
    } catch (error: any) {
      showErrorToast(
        error || "An error occurred while updating the folder color."
      );
    }
  };
  return (
    <div>
      <NotificationModal
        heading="Change Folder Color"
        headingStyles="font-semibold text-xl"
        closeModal={onClose}
        submitButtonText="Change Color"
        submitButtonStyle="bg-blue-500 hover:bg-blue-600"
        cancelButtonStyle=" bg-transparent border-2 border-gray-200 hover:bg-blue-50"
        cancelButtonText="Cancel"
        isOpen={isOpen}
        onSubmit={submitHandler} // Passing folder ID and selected color to onSubmit
        onCancel={onCancel}
      >
        <div className="mt-4">
          <h1 className="mb-1 font-semibold">Select Color</h1>
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

export default ChangeColorModal;
