import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LoginIcon from '@mui/icons-material/Login';

import Layout from 'components/Layout';

const CHROME_AUTHENTICATE = () =>
  chrome.runtime.sendMessage({ action: 'authenticate' });

const Wrapper = styled('article')(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around',
  alignItems: 'center',
}));

export default function LoginPage() {
  return (
    <Layout centerLogo={true} showFooter={false}>
      <Wrapper>
        <Typography variant='body1' padding={1}>
          Create shareable links valid for 24 hours or more to transfer files
          privately and securely with your collaborators and friends.
        </Typography>
        <Button
          variant='contained'
          color='secondary'
          startIcon={<LoginIcon />}
          onClick={CHROME_AUTHENTICATE}
        >
          Log in
        </Button>
      </Wrapper>
    </Layout>
  );
}
