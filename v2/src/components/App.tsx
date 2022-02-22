import React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
// import Typography from '@mui/material/Typography';
// import Link from '@mui/material/Link';

import Upload from './Upload';

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
  return (
    <Container maxWidth='sm'>
      <Box sx={{ my: 4 }}>
        <a
          href='https://www.sugarshare.me'
          target='_blank'
          rel='noreferrer'
        >
          <img
            src='/images/banner-v3.png'
            alt='SugarShare logo'
            aria-label='sugarshare logo'
            title='Go to sugarshare.me'
            style={{
              width: '200px',
              display: 'block',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          />
        </a>
        <Chip size='small' label='beta' />
        {/* <Typography variant='h5' component='h5' gutterBottom>
          Create React App example with TypeScript
        </Typography> */}
        {/* <Copyright /> */}
        <Upload />
      </Box>
    </Container>
  );
}

export default App;
