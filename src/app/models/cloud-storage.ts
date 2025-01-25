export interface FileList {
  __v: number;
  _id: string;
  created_at: Date;
  file_id: string;
  origin_file_id: string;
  file_name: string;
  file_size: number;
  folder_id: null | string;
  mime_type: string;
  status: 'uploaded' | 'shared' | 'shortcut';
  updated_at: Date;
  user_id: string;
}

export interface FolderList {
  __v: number;
  _id: string;
  created_at: Date;
  folder_id: string;
  folder_name: string;
  parent_folder_id: null | string;
  updated_at: Date;
  user_id: string;
}

export interface FolderPath {
  folder_id: string;
  folder_name: string;
}
