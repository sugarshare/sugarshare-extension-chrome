export type Action =
  | { type: 'TRY_UPLOAD'; payload: { file: File, uuid: string } }
  | { type: 'CANCEL_UPLOAD'; payload: { uuid: string } }
  | {
      type: 'SET_SHAREABLE_LINK';
      payload: { uuid: string; shareableLink: string };
    }
  | { type: 'SET_ERROR'; payload: { uuid: string; error: string } };

export type SugarFileState = {
  file: File;
  shareableLink: string;
  uuid: string;
  upload: {
    state: boolean;
    progress: number;
  };
  hasError: {
    state: boolean;
    error?: string;
  };
};
