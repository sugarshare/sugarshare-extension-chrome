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
export type Callback<T> = T extends void
  ? () => void
  : (value: T) => void;
