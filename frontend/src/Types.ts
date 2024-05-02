export type File = {
  id: number;
  name: string;
  image?: string;
  type?: string;
  storageUsed?: string;
  location?: string;
  owner?: string;
  created?: string;
  lastModified: string;
  downloadPermission?: string;
  link: string;
  size: string;
  tags: string[];
  description?: string;
};
