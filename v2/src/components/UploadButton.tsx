import React, { useState } from 'react';
import Input from '@mui/material/Input';
import Tooltip from '@mui/material/Tooltip';
import BackupIcon from '@mui/icons-material/Backup';

import BottomButton from './BottomButton';
import { Callback } from '../libs/types';

interface UploadButtonProps {
  onClick: Callback<File>;
}

export default function UploadButton({ onClick: handleAppendFile }: UploadButtonProps) {
  const [inputValue, setInputValue] = useState('');

  const handleChange = (callback: UploadButtonProps['onClick']) => async (event: React.ChangeEvent<HTMLInputElement>) => {
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
    <label>
      <Input
        type='file'
        value={inputValue}
        onChange={handleChange(handleAppendFile)}
        inputProps={{ multiple: false }}
        sx={{ display: 'none' }}
      />
      <Tooltip title='Click to select a file'>
        <BottomButton
          variant='contained'
          component='span'
          startIcon={<BackupIcon />}
          sx={{
            // Keep to get it to same height as signup/signout buttons
            bottom: 76,
          }}
        >
          Upload
        </BottomButton>
      </Tooltip>
    </label>
  );
}
