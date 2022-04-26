import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

const StyledFooter = styled('footer')(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(1),
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  marginTop: 'auto',
}));

function Footer() {
  return (
    <StyledFooter>
      <Typography variant='body1'> Powered by SugarShare </Typography>
    </StyledFooter>
  );
}

export default Footer;
