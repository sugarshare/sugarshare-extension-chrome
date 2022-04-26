import React from 'react';
import Header, { HeaderProps } from 'components/Header';
import Footer from 'components/Footer';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const Wrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
}));

type Props = {
  children: React.ReactElement;
  showFooter?: boolean;
} & HeaderProps;

function Layout({ children, centerLogo, onClickLogout, showFooter = true }: Props) {
  return (
    <Wrapper>
      <Header centerLogo={centerLogo} onClickLogout={onClickLogout} />
      {children}
      {showFooter && <Footer />}
    </Wrapper>
  );
}

export default Layout;
