import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import settings from '../settings';
import BottomButton from './BottomButton';

export default function Account() {
  const handleLogin = () => {
    chrome.runtime.sendMessage(
      'authenticate',
      (response?: any) => {
        if (!response && !!chrome.runtime.lastError) {
          alert(JSON.stringify(chrome.runtime.lastError));
        }
      },
    );
  };

  return (
    <Box sx={{ my: 4 }}>
      <Stack
        direction='column'
        justifyContent='flex-start'
        alignItems='stretch'
        spacing={2}
      >
        <Button variant='contained' onClick={() => handleLogin()}>
          Login
        </Button>
      </Stack>
    </Box>
  );
}
