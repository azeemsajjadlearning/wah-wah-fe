export interface FileList {
  file_id: string;
  file_name: string;
  mime_type: string;
  origin_file_id?: string | null;
  file_size: string;
  status: 'uploaded' | 'shared' | 'shortcut';
  folder_id?: string | null;
  user_id: number;
  created_on: string;
  updated_on: string;
}

export interface FolderList {
  folder_id: string;
  folder_name: string;
  parent_folder_id?: string | null;
  user_id: number;
  created_on: string;
  updated_on: string;
}

export interface FolderPath {
  folder_id: string;
  folder_name: string;
}
