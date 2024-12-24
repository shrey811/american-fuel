import React, { useState } from 'react';
import GeneralCard from 'components/UI/GeneralCard';
import DashboardDayGraph from './DashboardDayGraph';
import { Box, Tabs, Tab } from '@mui/material';
import { TabButtonStyles } from '../styles';

interface Props {}

const IndexDashboard = (props: Props) => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <GeneralCard title={""}>
      <Box>
        <Tabs value={tabIndex} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Day" sx={tabIndex === 0 ? TabButtonStyles.selected : TabButtonStyles.default} />
          <Tab label="Month" sx={tabIndex === 1 ? TabButtonStyles.selected : TabButtonStyles.default} />
          <Tab label="Year" sx={tabIndex === 2 ? TabButtonStyles.selected : TabButtonStyles.default} />
        </Tabs>
      </Box>
      <Box sx={{ display: tabIndex === 0 ? 'block' : 'none', mt: 2 }}>
        <DashboardDayGraph />
      </Box>
      <Box sx={{ display: tabIndex === 1 ? 'block' : 'none', mt: 2 }}>
        Add Month here
      </Box>
      <Box sx={{ display: tabIndex === 2 ? 'block' : 'none', mt: 2 }}>
        Add Year here
      </Box>
    </GeneralCard>
  );
};

export default IndexDashboard;