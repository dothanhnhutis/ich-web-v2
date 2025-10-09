type ImageURL = {
  id: string;
  width: number;
  height: number;
  fileName: string;
  url: string;
  size: number;
  created_at: Date;
};

type Image = {
  id: string;
  width: number;
  height: number;
  is_primary: boolean;
  original_name: string;
  mime_type: string;
  destination: string;
  file_name: string;
  size: number;
  created_at: Date;
};
