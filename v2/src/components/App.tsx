import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';
// import Link from '@mui/material/Link';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
// import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Collapse from '@mui/material/Collapse';
import { TransitionGroup } from 'react-transition-group';
import { v4 as uuidv4 } from 'uuid';

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

  const handleRemoveFile = (uuid: string) => {
    // TODO: Handle cancel upload
    setFiles((prev) => [...prev.filter((file: IdentifiableFile) => file.uuid !== uuid)]);
  };

  return (
    <Container maxWidth='sm'>
      <Box sx={{ my: 4 }}>
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
                <ListItem
                  sx={{ p: 0, m: 0 }}
                  secondaryAction={(
                    <IconButton
                      edge='end'
                      aria-label='cancel'
                      title='Cancel'
                      size='small'
                      onClick={() => handleRemoveFile(uuid)}
                    >
                      <CloseIcon />
                    </IconButton>
                  )}
                  divider
                >
                  <FileCard file={file} uuid={uuid} />
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
