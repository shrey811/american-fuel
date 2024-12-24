import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const PageNotFound: React.FC = () => {
  const navigate = useNavigate()

  const handleBackToHome = () => {
    navigate('/')
  };

  return (
    <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Box>
        <Typography variant="h1" gutterBottom
          sx={{
            fontSize: '1.3rem',
            fontWeight: '700',
            textTransform: 'uppercase',
            color: '#262626',
            letterSpacing: '3px',
          }}
        >
          Oops! page not found
        </Typography>
        <Typography variant="h1" gutterBottom
          sx={{
            fontSize: '212px',
            fontWeight: '900',
            letterSpacing: '-50px',
            marginBottom: '0em',
            marginLeft: '-50px',
            lineHeight: '1',
          }}>
          <span style={{ textShadow: '-5px 0 0 #fff' }}>4</span>
          <span style={{ textShadow: '-5px 0 0 #fff' }}>0</span>
          <span style={{ textShadow: '-5px 0 0 #fff' }}>4</span>
        </Typography>
        <Typography variant="h5" gutterBottom
          sx={{
            fontSize: '22px',
            fontWeight: '500',
            // marginBottom: '0rem',
            letterSpacing: '1px',
          }}
        >
          we couldn't find what you are looking for. <br />
          Please try again with different url
        </Typography>
        <Button variant="contained" onClick={handleBackToHome}
          sx={{
            mt: 2,
            fontSize: '.75rem',
            backgroundColor: '#ffffff',
            color: '#1071e5',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
              backgroundColor: '#ffffff',
              color: '#0b4e9d',
            },
          }}
        >
          Refresh Page
        </Button>
      </Box>
    </div>
  );
};

export default PageNotFound;
