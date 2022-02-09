import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
// import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
// import Button from '@mui/material/Button';
// import IconButton from '@mui/material/IconButton';

interface FileCardProps {
  file: File;
}

export default function FileCard({ file }: FileCardProps) {
  // const [progressDisplay, setProgressDisplay] = useState('none');
  // const [progressVariant, setProgressVariant] = useState('indeterminate' as LinearProgressProps['variant']);
  // const [progressValue, setProgressValue] = useState(0);

  // const handleProgress = (value: number) => {
  //   if (value > 0) {
  //     setProgressDisplay('block');
  //     setProgressVariant('determinate');
  //     setProgressValue(value);
  //   }

  //   if (value === 100) {
  //     setTimeout(
  //       () => {
  //         setProgressDisplay('none');
  //         setProgressVariant('indeterminate');
  //       },
  //       500,
  //     );
  //   }
  // };

  return (
    <Box sx={{ width: '100%' }}>
      <Card>
        <CardContent>
          {file.name}
          {/* <LinearProgress variant={progressVariant} value={progressValue} sx={{ display: progressDisplay }} /> */}
        </CardContent>
        <CardActions>
          Bar
        </CardActions>
      </Card>
    </Box>
  );
}
