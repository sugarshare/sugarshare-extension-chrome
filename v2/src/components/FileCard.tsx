import axios, { AxiosError } from 'axios';
import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';

import APIClient from '../libs/client';
import Clipboard from '../libs/clipboard';

interface FileCardProps {
  file: File;
  uuid: String;
}

interface ErrorData {
  error: string;
  hint: string | null;
}

export default function FileCard({ file, uuid }: FileCardProps) {
  // Error information
  const [isError, setIsError] = useState(false);
  const [errorData, setErrorData] = useState<ErrorData>({ error: 'Upload failed.', hint: null });

  // Loading bar
  const [progressDisplay, setProgressDisplay] = useState('block');
  const [progressVariant, setProgressVariant] = useState('indeterminate' as LinearProgressProps['variant']);
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

  const copyToClipboard = (text: string) => Clipboard.copy(
    text,
    () => notify('Copied to clipboard!'),
    () => notify('Copy failed, ensure clipboard permissions'),
  );

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
            setIsError(true);

            if (error.response) {
              setErrorData(error.response.data);
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
      <Card>
        <CardContent sx={{ p: 1, m: 0 }}>
          {
            isError
              ? (
                <TextField
                  error
                  label='Error'
                  value={errorData.error}
                  helperText={errorData?.hint ?? null}
                  variant='standard'
                  size='small'
                  fullWidth
                  InputProps={{ readOnly: true }}
                  sx={{
                    textOverflow: 'ellipsis',
                    fontWeight: 'light',
                    fontSize: 8,
                  }}
                />
              )
              : (
                <TextField
                  value={shareableLink}
                  helperText={notification}
                  title='Copy to clipboard'
                  aria-label='link shared file'
                  variant='standard'
                  size='small'
                  hiddenLabel
                  fullWidth
                  // multiline
                  // maxRows={2}
                  // helperText='TODO'
                  InputProps={{ readOnly: true }}
                  sx={{
                    textOverflow: 'ellipsis',
                    fontWeight: 'light',
                    fontSize: 8,
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
          isError
            ? null
            : (
              <CardActions disableSpacing sx={{ p: 0, m: 0 }}>
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
