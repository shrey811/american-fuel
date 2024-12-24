import * as React from 'react';
import {
  Backdrop,
  Box,
  Fade,
  Modal,
  Typography,
  Button,
  Divider,
  IconButton
} from '@mui/material';
import { style } from './style';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

interface Props {
  open: boolean;
  handleClose?: any; // Add handleClose prop
  title?: string;
  children?: any;
  size?: string;
  toggle?: () => void;
  LeftArrow?: any;
  width?: any;
}
const GeneralModal = (props: Props) => {

  const modalStyle = {
    ...style,
    maxHeight: '90vh', // Set a maximum height for the modal
    overflowY: 'auto', // Enable vertical scrolling
    width: props.width || 'auto', // Apply the width prop or default to 'auto'
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={props.open}
        onClose={props.handleClose} // Call handleClose when modal is closed
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={props.open}>
          <Box sx={modalStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.7rem' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {props.LeftArrow && (
                  <Box role="button" onClick={props.LeftArrow} sx={{ cursor: 'pointer', marginTop: '7px' }} >
                    <ArrowBackIosNewIcon />
                  </Box>
                )}
                {props.title && (
                  <Box sx={{ml: 1}}>
                    <Typography id="transition-modal-title" variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                      {props.title}
                    </Typography>
                  </Box>
                )}
              </div>
              <IconButton onClick={props.handleClose}>
                <CloseIcon />
              </IconButton>
            </div>
            <Divider />
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
              {props.children}
            </Typography>
            {/* <Button onClick={props.handleClose}>Close</Button>  */}
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

export default GeneralModal;