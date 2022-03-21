import React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
// import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';

import settings from '../settings';

import TabsView from './TabsView';
import Upload from './Upload';
import Account from './Account';

export default function App() {
  return (
    <Container maxWidth='sm'>
      <Box sx={{ my: 4 }}>
        <Link href={`https://${settings.siteDomainName}`} target='_blank'>
          <Tooltip title={`Go to ${settings.siteDomainName}`}>
            <img
              src='/images/banner-v3.png'
              alt={`${settings.projectName} logo`}
              aria-label={`${settings.projectName} logo`}
              style={{
                width: '200px',
                display: 'block',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            />
          </Tooltip>
        </Link>
        <TabsView items={[
          {
            name: 'Home',
            component: <Upload />,
            icon: <HomeIcon />,
          },
          {
            name: 'Account',
            component: <Account />,
            icon: <AccountCircleIcon />,
          },
        ]}
        />
      </Box>
    </Container>
  );
}
