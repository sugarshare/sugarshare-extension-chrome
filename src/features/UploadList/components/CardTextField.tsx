import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import { SugarFileState } from '../types';

type Props = {
  onClick: () => void;
  notification: string | null;
} & SugarFileState;

const CardTextField = ({
  file,
  shareableLink,
  upload,
  error,
  onClick,
  notification,
}: Props) => {
  const { progress } = upload;
  const isUploading = upload.state && upload.progress < 100;
  const isError = error.state !== null;

  if (isError) {
    return (
      <TextField
        error
        label='Error'
        value={error.text || ''}
        helperText={error.hint || ''}
        aria-label='link shared file'
        variant='filled'
        size='small'
        fullWidth
        InputProps={{
          readOnly: true,
        }}
      />
    );
  }

  return (
    <Tooltip title={!isUploading && 'Copy to clipboard'}>
      <TextField
        value={isUploading ? 'Uploading...' : shareableLink}
        label={file.name ?? null}
        helperText={isUploading ? `${progress}%` : notification}
        aria-label='link shared file'
        variant='filled'
        size='small'
        fullWidth
        InputProps={{
          readOnly: true,
        }}
        onClick={onClick}
      />
    </Tooltip>
  );
};

export default CardTextField;
