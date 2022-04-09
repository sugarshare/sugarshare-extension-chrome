import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import { IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import LogoLink from './LogoLink';

const StyledHeader = styled('header', {
  shouldForwardProp: (props) => props !== 'centerLogo',
})<{ centerLogo: boolean }>(({ theme, centerLogo }) => ({
  color: theme.palette.primary.contrastText,
  backgroundColor: theme.palette.primary.main,
  padding: theme.spacing(1),
  width: '100%',
  display: 'flex',
  justifyContent: centerLogo ? 'center' : 'space-between',
}));

export type HeaderProps = {
  centerLogo?: boolean;
  onClickLogout?: () => void;
};

function Header({ centerLogo = false, onClickLogout }: HeaderProps) {
  return (
    <StyledHeader centerLogo={centerLogo}>
      <LogoLink />
      {onClickLogout && (
        <Tooltip title='Logout'>
          <IconButton onClick={onClickLogout} aria-label='delete'>
            <LogoutIcon />
          </IconButton>
        </Tooltip>
      )}
    </StyledHeader>
  );
}

export default Header;
