export type File = {
  _id: string;
  name: string;
  originalName: string;
  image?: string;
  type?: string;
  storageUsed?: string;
  location?: string;
  owner?: string;
  createdAt: string;
  updatedAt: string;
  downloadPermission?: string;
  link: string;
  fullLink: string;
  size: string;
  tags: string[];
  description?: string;
  isDisabled?: boolean;
  isDeleted?: boolean;
  isFavorite?: boolean;
};

export type SelectedFile = {
  id: string;
  originalName: string;
  link: string;
  isFavorite: boolean | undefined;
};

export type UserInfo = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  googleId: string;
  profilePicture: string;
};

export type Folder = {
  _id: string;
  folderName: string;
  folderColor: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  files: File[]; // Assuming file IDs are stored as strings
};
