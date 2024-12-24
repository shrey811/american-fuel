import { ListItemButton, ListItemText, Box, Grid, Divider } from '@mui/material';
import GeneralCard from 'components/UI/GeneralCard';
import React, { useState } from 'react';
import RealTimeCostPage from './RealTimeCost/pages/RealTimePage';
import TaxPage from './Tax/pages/TaxPage';
import StatePage from './State/pages/StatePage';
import CityPage from './City/pages/CityPage';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';


const Settings = () => {
    const [activeLink, setActiveLink] = useState<string>('');

    const handleItemClick = (link: string) => {
        setActiveLink(link === activeLink ? '' : link);
    };

    return (
        <GeneralCard title={"Account & Settings"}>
            <Grid container sx={{ marginTop: "10px" }}>
                <Grid item xs={2}>
                    <ListItemButton
                        sx={{
                            borderRadius: '24px', // Add border radius for oval shape
                            ...(activeLink === '/real-time-cost' && {

                                borderRight: '3px solid #D8D8D8',
                                height: '48px',
                                '&:hover': {
                                    backgroundColor: '#EAEAEA',
                                },
                            }),
                        }}
                        onClick={() => handleItemClick('/real-time-cost')}
                    >
                        <ListItemText sx={{ color: 'black' }} primary="Company" />
                        <ArrowForwardIcon />
                    </ListItemButton>
                    < Divider sx={{ my: 2 }} />
                    <ListItemButton
                        sx={{
                            borderRadius: '24px',
                            ...(activeLink === '/tax' && {

                                borderRight: '3px solid #D8D8D8',
                                height: '48px',
                                '&:hover': {
                                    backgroundColor: '#EAEAEA',
                                },
                            }),
                        }}
                        onClick={() => handleItemClick('/tax')}
                    >
                        <ListItemText sx={{ color: 'black' }} primary="Purchase" />
                        <ArrowForwardIcon />
                    </ListItemButton>
                    < Divider sx={{ my: 2 }} />
                    <ListItemButton
                        sx={{
                            borderRadius: '24px',
                            ...(activeLink === '/state' && {

                                borderRight: '3px solid #D8D8D8',
                                height: '48px',
                                '&:hover': {
                                    backgroundColor: '#EAEAEA',
                                },
                            }),
                        }}
                        onClick={() => handleItemClick('/state')}
                    >
                        <ListItemText sx={{ color: 'black' }} primary="Sales" />
                        <ArrowForwardIcon />
                    </ListItemButton>
                    < Divider sx={{ my: 2 }} />
                    <ListItemButton
                        sx={{
                            borderRadius: '24px',
                            ...(activeLink === '/city' && {

                                borderRight: '3px solid #D8D8D8',
                                height: '48px',
                                '&:hover': {
                                    backgroundColor: '#EAEAEA',
                                },
                            }),
                        }}
                        onClick={() => handleItemClick('/city')}
                    >
                        <ListItemText sx={{ color: 'black' }} primary="Inventory" />
                        <ArrowForwardIcon />
                    </ListItemButton>
                    < Divider sx={{ my: 2 }} />
                    <ListItemButton
                        sx={{
                            borderRadius: '24px',
                            ...(activeLink === '/city' && {

                                borderRight: '3px solid #D8D8D8',
                                height: '48px',
                                '&:hover': {
                                    backgroundColor: '#EAEAEA',
                                },
                            }),
                        }}
                        onClick={() => handleItemClick('/city')}
                    >
                        <ListItemText sx={{ color: 'black' }} primary="Advanced" />
                        <ArrowForwardIcon />
                    </ListItemButton>
                </Grid>
                <Grid item xs={1}>

                </Grid>
                <Grid item xs={9}>
                    {/* {activeLink === '/real-time-cost' && <RealTimeCostPage />}
                    {activeLink === '/tax' && <TaxPage />}
                    {activeLink === '/state' && <StatePage />}
                    {activeLink === '/city' && <CityPage />} */}
                </Grid>
            </Grid>

        </GeneralCard>
    );
};

export default Settings;
