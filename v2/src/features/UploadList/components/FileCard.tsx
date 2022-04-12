import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';

import Clipboard from 'libs/clipboard';
import { SugarFileState } from '../types';
import settings from 'settings';

type Props = {
  data: SugarFileState;
  onCancel: () => void;
};

const StyledCard = styled(Card)(({ theme }) => ({
  width: '90%',
  marginBottom: theme.spacing(1),
}));

export default function FileCard({ data, onCancel }: Props) {
  const { file, shareableLink, upload } = data;
  const isUploading = upload.state && upload.progress < 100;

  // Show notification in helperText of a TextField
  const [notification, setNotification] = React.useState<string | null>(null);

  const notify = (text: string, millis = 2000) => {
    setNotification(text);
    setTimeout(() => setNotification(null), millis);
  };

  const copyToClipboard = () => {
    Clipboard.copy(
      shareableLink,
      () => notify('Copied to clipboard!'),
      () => notify('Copy failed, ensure clipboard permissions.')
    );
  };

  return (
    <StyledCard>
      <CardContent sx={{padding: 1, margin: 0}}>
        <Tooltip title={!isUploading && 'Copy to clipboard'}>
          <TextField
            value={isUploading ? 'Uploading...' : shareableLink}
            label={file.name ?? null}
            helperText={isUploading ? `${upload.progress}%` : notification}
            aria-label='link shared file'
            variant='filled'
            size='small'
            fullWidth
            InputProps={{
              readOnly: true,
            }}
            onClick={copyToClipboard}
          />
        </Tooltip>
      </CardContent>
      <CardActions disableSpacing sx={{ p: 0, mx: 1 }}>
        <Tooltip title='Cancel'>
          <IconButton aria-label='cancel' size='small' onClick={onCancel}>
            <CloseIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title='Open in a new tab'>
          <IconButton
            aria-label='open new tab'
            size='small'
            href={`https://${shareableLink}`}
            target='_blank'
          >
            <OpenInNewIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title='Copy to clipboard'>
          <IconButton
            aria-label='copy to clipboard'
            size='small'
            onClick={copyToClipboard}
          >
            <ContentCopyIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title='Send via Email'>
          <IconButton
            aria-label='send via email'
            size='small'
            href={`mailto:?subject=Here is your ${settings.decoratedProjectName} link!&body=You can download '${file.name}' from ${shareableLink}`}
          >
            <EmailOutlinedIcon />
          </IconButton>
        </Tooltip>
      </CardActions>
    </StyledCard>
  );
}
