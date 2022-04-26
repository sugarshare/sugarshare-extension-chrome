import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import Link from '@mui/material/Link';

import settings from 'settings';

export default function LogoLink() {
  return (
    <Link href={`https://${settings.siteDomainName}`} target='_blank'>
      <Tooltip title={`Go to ${settings.siteDomainName}`}>
        <img
          src='/images/banner-v3.png'
          alt={`${settings.projectName} logo`}
          aria-label={`${settings.projectName} logo`}
          style={{
            width: '200px',
          }}
        />
      </Tooltip>
    </Link>
  );
}
