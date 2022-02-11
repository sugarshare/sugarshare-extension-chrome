import axios, { AxiosError } from 'axios';
import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';

import APIClient from '../libs/client';

interface FileCardProps {
  file: File;
  uuid: String;
}

export default function FileCard({ file, uuid }: FileCardProps) {
  const [isError, setIsError] = useState(false);

  // Loading bar
  const [progressDisplay, setProgressDisplay] = useState('block');
  const [progressVariant, setProgressVariant] = useState('indeterminate' as LinearProgressProps['variant']);
  const [progressValue, setProgressValue] = useState(0);

  // Link
  const [shareableLink, setShareableLink] = useState('');

  useEffect(
    () => {
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
            alert(error);
          } else {
            throw error;
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

  return isError
    ? (
      <Box sx={{ width: '100%' }}>
        Error
      </Box>
    )
    : (
      <Box sx={{ width: '100%' }}>
        <Card>
          <CardContent>
            <TextField
              value={shareableLink}
              defaultValue=''
              variant='standard'
              hiddenLabel
              title='Copy to clipboard'
              aria-label='link shared file'
              // helperText='TODO'
              InputProps={{ readOnly: true }}
              sx={{ textOverflow: 'ellipsis' }}
              size='small'
              fullWidth
            />
            <LinearProgress variant={progressVariant} value={progressValue} sx={{ display: progressDisplay }} />
          </CardContent>
          <CardActions>
            Bar
          </CardActions>
        </Card>
      </Box>
    );
}
