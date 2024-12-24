import React, { Suspense, useEffect } from 'react';
import {
  Box,
  Container,
  Toolbar,
  Grid,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
  Typography,

} from '@mui/material';
import FallbackLoader from 'components/React/FallBackLoader/FallBackLoader';
import GeneralCard from 'components/UI/GeneralCard';
import { GridStyles, ParagraphStyles } from './styles';
import ProdCustSupTotal from './ProdCustSupTotal';
import IndexDashboard from './DashboardGraph';


const DashboardPage = () => {

  const sections = [
    { title: 'Purchase', rate: '$ 324.57 K', confirmed: '$ 123.45', new: '$ 123.45', received: '$ 123.45 ', billed: '123.45' },
    { title: 'Sales', rate: '$ 324.57 K', confirmed: '$ 123.45', new: '$ 123.45', received: '$ 123.45 ', billed: '123.45' },
    { title: 'Inventory', rate: '$ 324.57 K', confirmed: '$ 123.45', new: '$ 123.45', received: '$ 123.45 ', billed: '123.45' },
  ];

  return (
    <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><FallbackLoader /> </div>}>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: '100vh',
        }}
      >
        <GeneralCard title={"Transaction Summary"}>
          <Grid container style={{ display: "flex", alignItems: "center", marginTop: "1.5rem" }}>
            {sections.map((section, index) => (
              <React.Fragment key={index}>
                <Grid item style={{ marginLeft: "5px", marginRight: "5px", width: '20rem' }}>
                  <Grid container direction="column" >
                    <Grid item sx={{ marginBottom: "5px" }}>
                      <h4>{section.title}</h4>
                    </Grid>
                    <Grid item container direction="row" alignItems="center" >
                      <Grid item xs={12} sx={{ marginBottom: "5px" }}>
                        <h2>{section.rate}</h2>
                      </Grid>
                      <Grid item container direction="column" xs={5} >
                        <Grid item sx={GridStyles}>
                          <Typography>New: {section.new}</Typography>
                        </Grid>
                        <Grid item>
                          <Typography sx={ParagraphStyles}>Confirmed: {section.confirmed}</Typography>
                        </Grid>
                      </Grid>

                      <Grid item container direction="column" xs={5} sx={GridStyles}>
                        <Grid item>
                          <Typography>Received: {section.received}</Typography>
                        </Grid>
                        <Grid item>
                          <Typography sx={ParagraphStyles}>Billed: {section.billed}</Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                {index !== sections.length - 1 && ( // Add divider only if not the last item
                  <Divider orientation="vertical" flexItem style={{ margin: "0 5px" }} />
                )}
              </React.Fragment>
            ))}
          </Grid>
        </GeneralCard>
        <Grid container spacing={3} sx={{ marginTop: "1.5rem" }}>
          <Grid sm={8} lg={8} sx={{ padding: "1.5rem" }}>
            <IndexDashboard />
          </Grid>
          <Grid sm={4} lg={4} sx={{ paddingTop: "1.5rem" }}>
            <ProdCustSupTotal />
          </Grid>
        </Grid>
      </Box>
    </Suspense >
  );
}

export default DashboardPage;