export type File = {
  _id: string;
  name: string;
  originalName: string;
  image?: string;
  type?: string;
  storageUsed?: string;
  location?: string;
  owner?: string;
  created?: string;
  updatedAt: string;
  downloadPermission?: string;
  link: string;
  fullLink: string;
  size: string;
  tags: string[];
  description?: string;
  isDisabled?: boolean;
};
