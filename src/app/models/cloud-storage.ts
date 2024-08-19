export interface FileList {
  _id: string;
  created_at: Date;
  file_id: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  parent_folder_id: null;
  updated_at: Date;
  user_id: string;
}

export interface FolderList {
  _id: string;
  created_at: Date;
  name: string;
  parent_folder_id: string | null;
  updated_at: Date;
  user_id: string;
}
