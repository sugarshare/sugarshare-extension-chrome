import React from 'react';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Link from '@mui/material/Link';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';

import RollbarClient from 'clients/RollbarClient';

import settings from './settings';

import TabsView from './components/TabsView';
import Upload from './features/Upload';
import Account from './features/Account';

export default function App() {
  return (
    <RollbarProvider instance={RollbarClient}>
      {/*
        TODO
        fallbackUI
      */}
      <ErrorBoundary>
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
      </ErrorBoundary>
    </RollbarProvider>
  );
}
