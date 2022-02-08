import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';
// import Link from '@mui/material/Link';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';

import UploadButton from './UploadButton';
// import './App.css';

// function Copyright() {
//   return (
//     <Typography variant='body2' color='text.secondary' align='center'>
//       {'Copyright © '}
//       <Link color='inherit' href='https://mui.com/'>
//         Your Website
//       </Link>
//       {' '}
//       {new Date().getFullYear()}
//     </Typography>
//   );
// }

function App() {
  const [progressDisplay, setProgressDisplay] = useState('none');
  const [progressVariant, setProgressVariant] = useState('indeterminate' as LinearProgressProps['variant']);
  const [progressValue, setProgressValue] = useState(0);

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

  return (
    <Container maxWidth='sm'>
      <Box sx={{ my: 4 }}>
        {/* <Typography variant='h5' component='h5' gutterBottom>
          Create React App example with TypeScript
        </Typography> */}
        {/* <Copyright /> */}
        <UploadButton onProgress={handleProgress} />
      </Box>
      <Box sx={{ width: '100%' }}>
        <LinearProgress variant={progressVariant} value={progressValue} sx={{ display: progressDisplay }} />
      </Box>
    </Container>
  );
}

export default App;
