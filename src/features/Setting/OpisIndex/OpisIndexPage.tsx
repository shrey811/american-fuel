import { Box, Button, Grid } from '@mui/material';
import GeneralModal from 'components/UI/GeneralModal';
import React, { useState } from 'react';
import OpisIndexForm from './OpisIndexForm';
import OpisIndexList from './OpisIndexList';

interface Props {
  open: boolean;
  onClose: () => void;
}

const OpisIndexPage = (props: Props) => {

  const [editData, setEditData] = useState<any>();
  const [showForm, setShowForm] = useState(false);

  const toggleForm = () => {
    setShowForm(!showForm);
    if (showForm) {
      setEditData(null)
    }
  };

  const handleModalClose = () => {
    props.onClose();
  };

  return (
    <GeneralModal open={props.open} handleClose={handleModalClose} title="OPIS Index" LeftArrow={showForm ? toggleForm : null}>
      <Box sx={{ width: '750px' }}>
        <Grid container spacing={2} mt={2}>
          <Grid item xs={12} sm={12} sx={{ paddingTop: '0!important', position: 'absolute', top: '1.2rem', right: '4rem' }}>
            {!showForm && (
              <Button variant="contained" color="primary" onClick={toggleForm}>
                Create OPIS Index
              </Button>
            )}
          </Grid>
          <Grid item xs={12} sm={12} sx={{ paddingTop: '0!important' }}>
            <div style={{ display: showForm ? 'block' : 'none' }}>
              <OpisIndexForm editData={editData} setEditData={setEditData} backToList={toggleForm} />
            </div>
            <div style={{ display: showForm ? 'none' : 'block' }}>
              <OpisIndexList setEditData={setEditData} toggleForm={toggleForm} />
            </div>
          </Grid>
        </Grid>
      </Box>
    </GeneralModal>
  )
}

export default OpisIndexPage;