export interface Document {
  document_id: string;
  filename: string;
  mimetype: string;
  size: number;
  url: string;
  path: string;
  created_at: string;
  updated_at: string;
  user_id: number;
  page_count: number;
}

export interface UploadDocumentResponse {
  data: Document;
  message: string;
}

export interface DocumentArrayResponse {
  data: Document[];
  message: string;
}

