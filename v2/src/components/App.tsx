import React, { useState } from 'react';
import { TransitionGroup } from 'react-transition-group';
import { v4 as uuidv4 } from 'uuid';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';
// import Link from '@mui/material/Link';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Collapse from '@mui/material/Collapse';

import FileCard from './FileCard';
import UploadButton from './UploadButton';

interface IdentifiableFile {
  file: File;
  uuid: string;
}

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
  const [files, setFiles] = useState<IdentifiableFile[]>([]);

  const handleAppendFile = (file: File) => {
    const identifiableFile = { file, uuid: uuidv4() };
    setFiles((prev) => [...prev, identifiableFile]);
  };

  const handleCancel = (uuid: string) => {
    setFiles((prev) => [...prev.filter((file: IdentifiableFile) => file.uuid !== uuid)]);
  };

  const handleRetry = (uuid: string) => {
    // Assign a new UUID to force re-rendering
    setFiles((prev) => prev.map<IdentifiableFile>((file: IdentifiableFile) => (file.uuid !== uuid
      ? file
      : {
        ...file,
        uuid: uuidv4(),
      })));
  };

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
        <List sx={{
          width: '100%',
          // maxHeight: 200,
          maxHeight: 800,
          position: 'relative',
          overflow: 'auto',
          '& ul': { padding: 0 },
        }}
        >
          <TransitionGroup>
            {files.map(({ file, uuid }) => (
              <Collapse key={uuid}>
                <ListItem sx={{ p: 0, m: 0 }} divider>
                  <FileCard
                    file={file}
                    uuid={uuid}
                    onRetry={() => handleRetry(uuid)}
                    onCancel={() => handleCancel(uuid)}
                  />
                </ListItem>
              </Collapse>
            ))}
          </TransitionGroup>
        </List>
        <UploadButton onClick={handleAppendFile} />
      </Box>
    </Container>
  );
}

export default App;
