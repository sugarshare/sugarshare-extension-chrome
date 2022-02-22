/* eslint-disable react/jsx-props-no-spreading */

import React, { Fragment, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

interface TabViewProps {
  items: {
    name: string;
    component: React.ReactNode;
    icon: React.ReactElement;
  }[];
}

interface TabPanelProps {
  children: React.ReactNode;
  tabName: string;
  index: number;
  currTabIndex: number;
}

function a11yProps(tabName: string) {
  return {
    id: `tab-${tabName}`,
    'aria-controls': `tabpanel-${tabName}`,
  };
}

function TabPanel({
  children, tabName, index, currTabIndex, ...other
}: TabPanelProps) {
  return (
    <div
      role='tabpanel'
      hidden={index !== currTabIndex}
      id={`tabpanel-${tabName}`}
      aria-labelledby={`tab-${tabName}`}
      {...other}
    >
      {children}
    </div>
  );
}

export default function TabsView({ items }: TabViewProps) {
  const [currTabIndex, setCurrTabIndex] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, index: number) => setCurrTabIndex(index);

  return (
    <Fragment>
      <AppBar position='fixed' color='transparent' sx={{ top: 'auto', bottom: 0 }}>
        <Tabs
          value={currTabIndex}
          onChange={handleTabChange}
          variant='fullWidth'
          aria-label='menus'
          // indicatorColor='primary'
          selectionFollowsFocus
        >
          {
            items.map(({ name, icon }, index) => (
              <Tab value={index} key={name} icon={icon} title={name} {...a11yProps(name)} />
            ))
          }
        </Tabs>
      </AppBar>
      {
        items.map(({ name, component }, index) => (
          <TabPanel
            index={index}
            currTabIndex={currTabIndex}
            key={name}
            tabName={name}
          >
            {component}
          </TabPanel>
        ))
      }
    </Fragment>
  );
}
