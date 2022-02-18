import React, { useState } from 'react';
import Input, { InputProps } from '@mui/material/Input';
import Button from '@mui/material/Button';
import BackupIcon from '@mui/icons-material/Backup';

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

  const inputProps: InputProps['inputProps'] = {
    multiple: false,
  };

  return (
    <label>
      <Input
        type='file'
        value={inputValue}
        onChange={handleChange(handleAppendFile)}
        inputProps={inputProps}
        sx={{ display: 'none' }}
      />
      <Button variant='outlined' component='span' endIcon={<BackupIcon />} sx={{ width: '100%' }}>
        Upload
      </Button>
    </label>
  );
}
