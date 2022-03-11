import { styled } from '@mui/material/styles';
import Button, { ButtonProps } from '@mui/material/Button';

const BottomButton = styled(Button)<ButtonProps & { component?: string }>({
  width: '90%',
  position: 'fixed',
  top: 'auto',
  bottom: 60,
  left: '50%',
  transform: 'translate(-50%)',
});

export default BottomButton;
