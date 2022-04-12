import { SugarFileState, Action } from './types';

export default function uploadReducer(
  state: SugarFileState[],
  action: Action
): SugarFileState[] {
  switch (action.type) {
    case 'TRY_UPLOAD': {
      const { file, uuid } = action.payload;
      const newFile: SugarFileState = {
        file: file,
        shareableLink: '',
        uuid: uuid,
        upload: {
          state: true,
          progress: 0,
        },
        hasError: {
          state: false,
        },
      };
      return [newFile, ...state];
    }

    case 'SET_SHAREABLE_LINK': {
      const { uuid, shareableLink } = action.payload;
      const newState = state.map((file) => {
        if (file.uuid === uuid) {
          return {
            ...file,
            shareableLink: shareableLink,
          };
        }
        return file;
      });
      return newState;
    }

    case 'SET_ERROR': {
      const { uuid, error } = action.payload;
      const newState = state.map((file) => {
        if (file.uuid === uuid) {
          return {
            ...file,
            hasError: {
              state: true,
              error: error,
            },
          };
        }
        return file;
      });
      return newState;
    }

    case 'CANCEL_UPLOAD': {
      const { uuid } = action.payload;
      
      return [...state.filter((file) => file.uuid !== uuid)];
    }
  }
}
