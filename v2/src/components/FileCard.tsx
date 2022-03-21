import axios, { AxiosError } from 'axios';
import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import ReplayIcon from '@mui/icons-material/Replay';
import CloseIcon from '@mui/icons-material/Close';

import settings from '../settings';
import APIClient from '../libs/client';
import Clipboard from '../libs/clipboard';
import { Callback } from '../libs/types';

interface FileCardProps {
  file: File;
  uuid: String;
  onRetry: Callback<void>;
  onCancel: Callback<void>;
}

interface ErrorData {
  error: string;
  hint: string | null;
}

export default function FileCard({
  file, uuid, onRetry: handleRetry, onCancel: handleCancel,
}: FileCardProps) {
  // Error information
  const [isError, setIsError] = useState<'retriable' | 'non-retriable' | boolean>(false);
  const [errorData, setErrorData] = useState<ErrorData>({ error: 'Upload failed', hint: null });

  // Loading bar
  const [progressDisplay, setProgressDisplay] = useState<'block' | 'none'>('block');
  const [progressVariant, setProgressVariant] = useState<LinearProgressProps['variant']>('indeterminate');
  const [progressValue, setProgressValue] = useState(0);

  // Link to the shared file
  const [shareableLink, setShareableLink] = useState('');

  // Show notification in helperText of a TextField
  const [notification, setNotification] = useState<string | null>(null);

  const notify = (text: string, millis = 2000) => {
    setNotification(text);
    setTimeout(
      () => setNotification(null),
      millis,
    );
  };

  const copyToClipboard = (text: string) => {
    if (text.length === 0) {
      return;
    }

    Clipboard.copy(
      text,
      () => notify('Copied to clipboard!'),
      () => notify('Copy failed, ensure clipboard permissions.'),
    );
  };

  useEffect(
    () => {
      setIsError(false);

      const handleProgress = (value: number) => {
        if (value > 0) {
          setProgressDisplay('block');
          setProgressVariant('determinate');
          setProgressValue(value);
        }

        if (value === 100) {
          setTimeout(
            () => {
              setProgressDisplay('none');
              setProgressVariant('indeterminate');
            },
            500,
          );
        }
      };

      const client = new APIClient();
      client.upload(file, handleProgress)
        .then((link: string) => {
          setShareableLink(link);
        })
        .catch((error: AxiosError | Error) => {
          if (axios.isAxiosError(error)) {
            setIsError('retriable');

            if (error.response) {
              setErrorData(error.response.data);

              if (error.response.status === 413) {
                // Disallow retying for 413 Payload Too Large errors
                setIsError('non-retriable');
              } else if (error.response.status === 401) {
                setErrorData({
                  error: 'Missing credentials',
                  hint: 'Please make sure to log in before continuing.',
                });
              }
            } else if (error.request) {
              setErrorData((prev) => ({
                ...prev,
                hint: 'Please check your network connection and retry.',
              }));
            } else {
              setErrorData((prev) => ({
                ...prev,
                hint: error.message,
              }));
            }
          } else {
            setIsError('retriable');

            if (error.name === 'NotAuthorizedException' && error.message.match(/Refresh Token has expired/i)) {
              setErrorData({
                error: 'Your session has expired',
                hint: 'Please make sure to log in to refresh your session.',
              });
            } else {
              setErrorData((prev) => ({
                ...prev,
                hint: 'Internal error, we are working on it.',
              }));
            }
            // TODO
            // throw error;
          }
        });

      return () => {
        // TODO: solve "Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function."
        // Cancel upload on user request (click on cancel button triggers component to deregister)
        client.cancel();
      };
    },
    [uuid],
  );

  // chrome.runtime.sendMessage(
  //   file,
  //   (response) => alert(`Got this response: ${JSON.stringify(response)}`),
  // );

  return (
    <Box sx={{ width: '100%' }}>
      <Card
        variant='outlined'
        // sx={{ bgcolor: 'background.default' }}
      >
        <CardContent sx={{ p: 1, m: 0 }}>
          {
            isError
              ? (
                <TextField
                  error
                  label='Error'
                  value={errorData.error}
                  helperText={errorData?.hint ?? null}
                  variant='filled'
                  size='small'
                  fullWidth
                  InputProps={{
                    readOnly: true,
                    sx: {
                      display: 'inline-block',
                      overflow: 'hidden',
                      fontWeight: 'light',
                      fontSize: '0.8rem',
                    },
                  }}
                />
              )
              : (
                <Tooltip title={progressValue < 100 ? false : 'Copy to clipboard'}>
                  <TextField
                    value={progressValue < 100 ? 'Uploading...' : shareableLink}
                    label={file.name ?? null}
                    helperText={progressValue < 100 ? `${progressValue}%` : notification}
                    aria-label='link shared file'
                    variant='filled'
                    size='small'
                    fullWidth
                    InputProps={{
                      readOnly: true,
                      sx: {
                        display: 'inline-block',
                        overflow: 'hidden',
                        fontWeight: 'light',
                        fontSize: '0.8rem',
                      },
                    }}
                    onClick={() => copyToClipboard(shareableLink)}
                  />
                </Tooltip>
              )
          }
          {
            // Display progress bar depending on error state and progress value
            isError && progressValue === 0
              ? null
              : (
                <LinearProgress
                  variant={progressVariant}
                  value={progressValue}
                  color={isError ? 'error' : 'primary'}
                  sx={{ display: progressDisplay }}
                />
              )
          }
        </CardContent>
        {
          // If there is a non-retriable error
          isError === 'non-retriable' // || progressValue < 100
            ? (
              <Tooltip title='Cancel'>
                <IconButton
                  aria-label='cancel'
                  size='small'
                  onClick={() => handleCancel()}
                >
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            )
            // If there is a retriable or any other error
            : isError === 'retriable' || isError === true
              ? (
                <CardActions disableSpacing sx={{ p: 0, mx: 1 }}>
                  <Tooltip title='Cancel'>
                    <IconButton
                      aria-label='cancel'
                      size='small'
                      onClick={() => handleCancel()}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='Retry'>
                    <IconButton
                      aria-label='retry'
                      size='small'
                      onClick={() => handleRetry()}
                    >
                      <ReplayIcon />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              )
              : (
                <CardActions disableSpacing sx={{ p: 0, mx: 1 }}>
                  <Tooltip title='Cancel'>
                    <IconButton
                      aria-label='cancel'
                      size='small'
                      onClick={() => handleCancel()}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='Open in a new tab'>
                    <IconButton
                      aria-label='open new tab'
                      size='small'
                      href={`https://${shareableLink}`}
                      target='_blank'
                      rel='noopener'
                    >
                      <OpenInNewIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='Copy to clipboard'>
                    <IconButton
                      aria-label='copy to clipboard'
                      size='small'
                      onClick={() => copyToClipboard(shareableLink)}
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='Send via Email'>
                    <IconButton
                      aria-label='send via email'
                      size='small'
                      href={
                        // TODO: make sure this works
                        `mailto:?subject=Here is your ${settings.decoratedProjectName} link!&body=You can download '${file.name}' from ${shareableLink}`
                      }
                    >
                      <EmailOutlinedIcon />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              )
        }
      </Card>
    </Box>
  );
}
