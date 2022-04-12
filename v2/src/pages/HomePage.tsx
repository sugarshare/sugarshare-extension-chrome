import Layout from 'components/Layout';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import UploadList from 'features/UploadList';
import { useAuth } from 'providers/AuthProvider';

const CHROME_SIGNOUT = () => chrome.runtime.sendMessage({ action: 'signout' });

const Wrapper = styled('article')(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around',
  alignItems: 'center',
}));

export default function HomePage() {
  const { state: authState, dispatch } = useAuth();

  return (
    <Layout
      centerLogo={false}
      onClickLogout={() => {
        CHROME_SIGNOUT();
        dispatch({ type: 'SIGN_OUT' });
      }}
    >
      <Wrapper>
        <Typography variant='body1'>Welcome {authState.user}!</Typography>
        <UploadList />
      </Wrapper>
    </Layout>
  );
}
