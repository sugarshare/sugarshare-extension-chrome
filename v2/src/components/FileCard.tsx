import axios, { AxiosError } from 'axios';
import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';

import APIClient from '../libs/client';

interface FileCardProps {
  file: File;
  uuid: String;
}

export default function FileCard({ file, uuid }: FileCardProps) {
  const [isError, setIsError] = useState(false);

  // Show loading bar initially
  const [progressDisplay, setProgressDisplay] = useState('block');
  const [progressVariant, setProgressVariant] = useState('indeterminate' as LinearProgressProps['variant']);
  const [progressValue, setProgressValue] = useState(0);

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
          alert(link);
        })
        .catch((error: AxiosError | Error) => {
          if (axios.isAxiosError(error)) {
            setIsError(true);
            alert(error);
          } else {
            throw error;
          }
        });

      return () => {};
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
            {file.name}
            <LinearProgress variant={progressVariant} value={progressValue} sx={{ display: progressDisplay }} />
          </CardContent>
          <CardActions>
            Bar
          </CardActions>
        </Card>
      </Box>
    );
}
