import { Divider, Popover, Typography } from '@mui/material';
import React from 'react';

type Props = {
  anchorEl: HTMLElement | null;
  handleClose: () => void;
  open: boolean;
};

const NotificationPage = (props: Props) => {
  return (
    <Popover
      open={props.open}
      anchorEl={props.anchorEl}
      onClose={props.handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      sx={{marginRight: '2rem'}}
    >
      <Typography
        sx={{ p: 2, textAlign: 'start', textTransform: 'uppercase' }}
        component="h4"
        variant="h5"
        color="inherit" noWrap
      >
        Notification
      </Typography>
      <Divider />
      <Typography sx={{ p: 2 }}>To Be Done Late...</Typography>
      <Typography sx={{ p: 2 }}>Lorem ipsum, dolor sit amet consectetur adipisicing elit. !</Typography>
    </Popover>
  );
};

export default NotificationPage;
