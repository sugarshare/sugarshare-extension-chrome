export interface PresignedUrlBody {
  title: string;
  fileType: string;
  sizeBytes: number;
}

export interface PresignedUrlResponse {
  uuid: string;
  presignedUrl: string;
}

/* eslint no-unused-vars: ["error", { "args": "none" }] */
export type ProgressHandler = (value: number) => void;
