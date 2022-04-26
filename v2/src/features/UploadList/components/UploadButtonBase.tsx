import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import BackupIcon from '@mui/icons-material/Backup';
import { Button } from '@mui/material';

type Props = {
  onClick: (fileList: FileList) => void;
};

export default function UploadButtonBase({ onClick }: Props) {
  const inputFileRef = React.useRef<HTMLInputElement | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files;
      onClick(file);
    }
  };

  return (
    <Tooltip title='Click to select a file'>
      <label>
        <Button
          onClick={() => {
            inputFileRef?.current?.click();
          }}
          variant='contained'
          color='secondary'
          startIcon={<BackupIcon />}
          component='label'
        >
          Upload
        </Button>
        <input
          ref={inputFileRef}
          type='file'
          multiple={false}
          onChange={handleChange}
          hidden
        />
      </label>
    </Tooltip>
  );
}
