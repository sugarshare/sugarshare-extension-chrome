import * as React from 'react';
import Input, { InputProps } from '@mui/material/Input';
import Button from '@mui/material/Button';
import BackupIcon from '@mui/icons-material/Backup';

import Client from '../libs/client';
import { ProgressHandler } from '../libs/types';

interface UploadButtonProps {
  onProgress: ProgressHandler;
}

const handleUpload = (handleProgress: UploadButtonProps['onProgress']) => async (event: React.ChangeEvent<HTMLInputElement>) => {
  const { files } = event.target;

  if (!files?.length) {
    // TODO
  }

  const file = files![0];

  const client = new Client();
  await client.upload(file, handleProgress);

  // chrome.runtime.sendMessage(
  //   file,
  //   (response) => alert(`Got this response: ${JSON.stringify(response)}`),
  // );
};

export default function UploadButton({ onProgress }: UploadButtonProps) {
  const inputAttributes: InputProps['inputProps'] = {
    multiple: false,
  };

  return (
    <label>
      <Input
        type='file'
        onChange={handleUpload(onProgress)}
        inputProps={inputAttributes}
        sx={{ display: 'none' }}
      />
      <Button variant='outlined' component='span' endIcon={<BackupIcon />} sx={{ width: '100%' }}>
        Upload
      </Button>
    </label>
  );
}
