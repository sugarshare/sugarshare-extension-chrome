import React from 'react';
import { AxiosError } from 'axios';
import UploadButtonBase from './components/UploadButtonBase';
import SugarShareCient from 'clients/SugarShareClient';
import uploadReducer from './reducer';
import { SugarFileState } from './types';
import FileCard from './components/FileCard';
import { v4 as uuidv4 } from 'uuid';

export default function UploadList() {
  const [files, dispatch] = React.useReducer(
    uploadReducer,
    [] as SugarFileState[]
  );

  const uploadFile = (fileList: FileList) => {
    for (let i = 0; i < fileList.length; i += 1) {
      const file = fileList[i];
      const uuid = uuidv4();

      dispatch({ type: 'TRY_UPLOAD', payload: { file, uuid } });

      SugarShareCient.upload(file, (progress) => {
        console.log(progress);
      })
        .then((link: string) => {
          dispatch({
            type: 'SET_SHAREABLE_LINK',
            payload: { uuid, shareableLink: link },
          });
        })
        .catch((error: AxiosError | Error) => {
          console.log(error);
          dispatch({
            type: 'SET_ERROR',
            payload: { uuid, error: 'Something went wrong' },
          });
        });
    }
  };

  const removeFile = (uuid: string) => {
    dispatch({
      type: 'CANCEL_UPLOAD',
      payload: { uuid },
    });
  };

  return (
    <React.Fragment>
      {files.length > 0 &&
        files.map((file) => <FileCard key={file.uuid} data={file} onCancel={() => removeFile(file.uuid)} />)}
      <UploadButtonBase onClick={uploadFile} />
    </React.Fragment>
  );
}
