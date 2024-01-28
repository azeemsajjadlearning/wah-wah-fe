export interface PhotoList {
  file_id: string;
  metadata: Metadata;
  thumbnail: string;
}

export interface Metadata {
  __v: number;
  _id: string;
  album: null;
  description: null;
  image: Image;
  title: null;
  uploadDate: Date;
  user_id: string;
}

export interface Image {
  file_id: string;
  file_name: string;
  file_size: number;
  file_unique_id: string;
  mime_type: string;
  thumb: Thumb;
  thumbnail: Thumb;
}

export interface Thumb {
  file_id: string;
  file_size: number;
  file_unique_id: string;
  height: number;
  width: number;
}
