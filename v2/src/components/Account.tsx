import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';

import BottomButton from './BottomButton';
import Auth, { AuthenticationError } from '../libs/auth';

const CHROME_AUTHENTICATE = () => chrome.runtime.sendMessage({ action: 'authenticate' });

const CHROME_SIGNOUT = () => chrome.runtime.sendMessage({ action: 'signout' });

export default function Account() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setUserEmail(null);
    CHROME_SIGNOUT();
  };

  useEffect(() => {
    const auth = new Auth();
    auth
      .load()
      .then(() => {
        if (auth.isAuthenticated) {
          setIsAuthenticated(auth.isAuthenticated);
          setUserEmail(auth.email);
        }

        if (auth.isSessionExpired()) {
          setIsSessionExpired(true);
        }
      })
      .catch((error) => {
        if (
          error instanceof AuthenticationError && error.message === 'Cannot find tokens in storage'
        ) {
          // Skip when tokens cannot be found
        } else {
          throw error;
        }
      });
  }, []);

  if (!isAuthenticated) {
    return (
      <BottomButton
        variant='contained'
        onClick={CHROME_AUTHENTICATE}
        startIcon={<LoginIcon />}
        sx={{ my: 2 }}
      >
        Log in or Sign up
      </BottomButton>
    );
  }

  return (
    <Box
      sx={{
        my: 4,
        width: '100%',
        textAlign: 'center',
      }}
    >
      <Typography variant='h5'>Welcome!</Typography>
      <br />
      <Typography variant='subtitle2'>You are logged in as</Typography>
      <Typography variant='subtitle1'>{userEmail}</Typography>
      <br />

      {isSessionExpired && (
        <Typography variant='body2'>
          Your session has expired. Please make sure to log in to refresh
          your session.
        </Typography>
      )}

      <BottomButton
        variant='contained'
        onClick={isSessionExpired ? CHROME_AUTHENTICATE : handleSignOut}
        startIcon={isSessionExpired ? <LoginIcon /> : <LogoutIcon />}
        sx={{ my: 2 }}
      >
        {isSessionExpired ? 'Log in or Sign up' : 'Sign out'}
      </BottomButton>
    </Box>
  );
}
