import React, { Fragment, useState } from 'react';
import { TransitionGroup } from 'react-transition-group';
import { v4 as uuidv4 } from 'uuid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Collapse from '@mui/material/Collapse';

import FileCard from './FileCard';
import UploadButton from '../components/UploadButton';

interface IdentifiableFile {
  file: File;
  uuid: string;
}

export default function Upload() {
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
    <Fragment>
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
    </Fragment>
  );
}
