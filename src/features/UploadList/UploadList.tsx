import React from 'react';
import axios from 'axios';
import { AxiosError } from 'axios';
import UploadButtonBase from './components/UploadButtonBase';
import SugarShareClient from 'clients/SugarShareClient';
import uploadReducer from './reducer';
import { SugarFileState, ErrorState } from './types';
import FileCard from './components/FileCard';
import { v4 as uuidv4 } from 'uuid';

const generateErrorPayload = (error: AxiosError | Error) => {
  let errorPayload: {
    state: ErrorState;
    text: string;
    hint?: string;
  } = {
    state: 'retriable',
    text: '',
    hint: '',
  };

  if (axios.isAxiosError(error)) {
    if (error.response) {
      errorPayload.text = error.response.data;
      if (error.response.status === 502) {
        errorPayload.text = 'Internal server error.';
        errorPayload.hint = 'Internal error, we are working on it.';
      } else if (error.response.status === 413) {
        // Disallow retying for 413 Payload Too Large errors
        errorPayload.state = 'non-retriable';
      } else if (error.response.status === 401) {
        errorPayload.text = 'Missing credentials';
        errorPayload.hint = 'Please make sure to log in before continuing.';
      }
    } else if (error.request) {
      errorPayload.hint = 'Please check your network connection and retry.';
    } else {
      errorPayload.hint = error.message;
    }
  } else {
    if (
      error.name === 'NotAuthorizedException' &&
      error.message.match(/Refresh Token has expired/i)
    ) {
      errorPayload.text = 'Your session has expired';
      errorPayload.hint = 'Please make sure to log in to refresh your session.';
    } else {
      errorPayload.hint = 'Internal error, we are working on it.';
    }
  }

  return errorPayload;
};

const LOCAL_STORAGE_KEY = 'sugar-share-files';

const setOnLocalStorage = (key: string, value: any) => {
  if (chrome.storage) {
    chrome.storage.local.set({ key: value }, function () {
      console.log(`Saved ${key} to local storage`, value);
    });
  } else {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
};

const getOnlocalStorage = (key: string) => {
  if (chrome.storage) {
    chrome.storage.local.get([key], function (result) {
      console.log(`Retrieved ${key} from local storage`, result);
      return result;
    });
  } else {
    const result = window.localStorage.getItem(key) || '[]';
    return JSON.parse(result);
  }
};

const INIT_STATE = getOnlocalStorage(LOCAL_STORAGE_KEY)
  ? (getOnlocalStorage(LOCAL_STORAGE_KEY) as SugarFileState[])
  : ([] as SugarFileState[]);

export default function UploadList() {
  const [files, dispatch] = React.useReducer(uploadReducer, INIT_STATE);

  React.useEffect(() => {
    const syncStateWithStorage = () => {
      setOnLocalStorage(LOCAL_STORAGE_KEY, files);
    };

    syncStateWithStorage();
  }, [files]);

  const uploadFileToApi = (file: File, uuid: string) => {
    SugarShareClient.upload(file, (progress) => {
      dispatch({
        type: 'UPDATE_PROGRESS',
        payload: { uuid, progress },
      });
    })
      .then((link: string) => {
        dispatch({
          type: 'SET_SHAREABLE_LINK',
          payload: { uuid, shareableLink: link },
        });
      })
      .catch((error: AxiosError | Error) => {
        const errorPayload = generateErrorPayload(error);

        dispatch({
          type: 'SET_ERROR',
          payload: { uuid, error: errorPayload },
        });
      });
  };

  const uploadFile = (fileList: FileList) => {
    for (let i = 0; i < fileList.length; i += 1) {
      const file = fileList[i];
      const uuid = uuidv4();

      dispatch({ type: 'TRY_UPLOAD', payload: { file, uuid } });
      uploadFileToApi(file, uuid);
    }
  };

  const removeFile = (uuid: string) => {
    dispatch({
      type: 'CANCEL_UPLOAD',
      payload: { uuid },
    });
  };

  const retryUpload = (file: File, uuid: string) => {
    dispatch({ type: 'RETRY_UPLOAD', payload: { uuid } });
    uploadFileToApi(file, uuid);
  };

  return (
    <React.Fragment>
      {files.length > 0 &&
        files.map((file) => (
          <FileCard
            key={file.uuid}
            data={file}
            onCancel={() => removeFile(file.uuid)}
            onRetry={() => retryUpload(file.file, file.uuid)}
          />
        ))}
      <UploadButtonBase onClick={uploadFile} />
    </React.Fragment>
  );
}
