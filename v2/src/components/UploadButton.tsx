import React, { useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import BackupIcon from '@mui/icons-material/Backup';
import { Button } from '@mui/material';
import { Callback } from '../libs/types';

interface UploadButtonProps {
  onClick: Callback<File>;
}

export default function UploadButton({
  onClick: handleAppendFile,
}: UploadButtonProps) {
  const [inputValue, setInputValue] = useState('');

  const handleChange =
    (callback: UploadButtonProps['onClick']) =>
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const { files } = event.target;
      if (!files?.length) {
        return;
      }

      for (let i = 0; i < files.length; i += 1) {
        callback(files[i]);
      }

      // Allow for selecting the same file consecutively
      setInputValue('');
    };

  return (
    <Tooltip title='Click to select a file'>
      <Button
        variant='contained'
        color='secondary'
        startIcon={<BackupIcon />}
        component='label'
      >
        Upload
        <input type='file' value={inputValue} onChange={handleChange(handleAppendFile)} hidden />
      </Button>
    </Tooltip>
  );
}
