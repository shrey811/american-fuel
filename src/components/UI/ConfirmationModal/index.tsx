import React from "react";
import { Modal } from "@mui/material";
import { Backdrop, Box, Button, Divider, Fade, Typography } from "@mui/material";
import { BorderAll } from "@mui/icons-material";

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  boxShadow: 24,
  borderRadius: '4px',
  p: 4,
  '&:focus-visible': {
    outline: 'none'
  }
};

interface IProps {
  open: boolean;
  handleModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleConfirmClick: () => void;
}

function ConfirmationModal(props: IProps) {
  const { open, handleModal, handleConfirmClick } = props;

  return (
    <Modal
      open={open}
      onClose={() => handleModal(false)}
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Box sx={style}>
        <Typography id="transition-modal-title" variant="h6" component="h2" sx={{ fontSize: "1.5rem", color: '#1071e5' }}>
            Confirmation
          </Typography>
          <Typography id="transition-modal-title" variant="h6" component="h2" sx={{ fontSize: '.875rem' }}>
            Are you sure you want to delete?
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ float: 'right' }}>
            <Button onClick={() => handleModal(false)} variant="outlined" sx={{ mr: 2, color: '#000000' }}>
              Cancel
            </Button>
            <Button onClick={handleConfirmClick} variant="contained" color="primary" >
              Confirm
            </Button>

          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}

export default ConfirmationModal;
