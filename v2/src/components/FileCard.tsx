import axios, { AxiosError } from 'axios';
import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import IconButton from '@mui/material/IconButton';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ReplayIcon from '@mui/icons-material/Replay';
import CloseIcon from '@mui/icons-material/Close';

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
  const [isError, setIsError] = useState<boolean | 'retriable' | 'non-retriable'>(false);
  const [errorData, setErrorData] = useState<ErrorData>({ error: 'Upload failed.', hint: null });

  // Loading bar
  const [progressDisplay, setProgressDisplay] = useState('block');
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

              // Disallow retying for 413 Payload Too Large errors
              if (error.response.status === 413) {
                setIsError('non-retriable');
              }

              console.log(error.response);
            } else if (error.request) {
              setErrorData((prev) => ({
                ...prev,
                hint: 'Please check your network connection and retry.',
              }));
              console.log(error.request);
            } else {
              setErrorData((prev) => ({
                ...prev,
                hint: error.message,
              }));
              console.log('Error', error.message);
            }

            console.log(error.config);
          } else {
            setErrorData((prev) => ({
              ...prev,
              hint: 'Internal error, we are working on it.',
            }));
            // TODO
            // throw error;
          }
        });

      return () => {
        // Cancel upload on user request (click on cancel button)
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
                <TextField
                  value={shareableLink}
                  helperText={progressValue > 0 && progressValue < 100 ? `${progressValue}%` : notification}
                  title='Copy to clipboard'
                  aria-label='link shared file'
                  variant='filled'
                  size='small'
                  hiddenLabel
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
              )
          }
          {
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
          isError === 'non-retriable'
            ? (
              <IconButton
                aria-label='cancel'
                title='Cancel'
                size='small'
                onClick={() => handleCancel()}
              >
                <CloseIcon />
              </IconButton>
            )
            : isError === true || isError === 'retriable'
              ? (
                <CardActions disableSpacing sx={{ p: 0, mx: 1 }}>
                  <IconButton
                    aria-label='cancel'
                    title='Cancel'
                    size='small'
                    onClick={() => handleCancel()}
                  >
                    <CloseIcon />
                  </IconButton>
                  <IconButton
                    title='Retry'
                    aria-label='retry'
                    size='small'
                    onClick={() => handleRetry()}
                  >
                    <ReplayIcon />
                  </IconButton>
                </CardActions>
              )
              : (
                <CardActions disableSpacing sx={{ p: 0, mx: 1 }}>
                  <IconButton
                    aria-label='cancel'
                    title='Cancel'
                    size='small'
                    onClick={() => handleCancel()}
                  >
                    <CloseIcon />
                  </IconButton>
                  <IconButton
                    href={`https://${shareableLink}`}
                    target='_blank'
                    rel='noopener'
                    aria-label='open new tab'
                    title='Open in a new tab'
                    size='small'
                  >
                    <OpenInNewIcon />
                  </IconButton>
                  <IconButton
                    title='Copy to clipboard'
                    aria-label='copy to clipboard'
                    size='small'
                    onClick={() => copyToClipboard(shareableLink)}
                  >
                    <ContentCopyIcon />
                  </IconButton>
                </CardActions>
              )
        }
      </Card>
    </Box>
  );
}
