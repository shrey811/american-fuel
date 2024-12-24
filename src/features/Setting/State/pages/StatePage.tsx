import React, { useState } from 'react';
import { Box, Grid, Button, Typography } from '@mui/material';
import StateForm from './StateForm';
import StateList from './StateList';
import GeneralModal from 'components/UI/GeneralModal';

interface Props {
  open: boolean;
  onClose: () => void;
}

const StatePage = (props: Props) => {
  const [editData, setEditData] = useState<any>();
  const [showForm, setShowForm] = useState(false);

  const toggleForm = () => {
    if (showForm) {
      setEditData(null)
    }
    setShowForm(!showForm);
  };

  const handleModalClose = () => {
    props.onClose();
  };

  return (
    <GeneralModal open={props.open} handleClose={handleModalClose} title="State" LeftArrow={showForm ? toggleForm : null}>
      <Box className="State" sx={{ width: '650px' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} sx={{ paddingTop: '0!important', position: 'absolute', top: '1.2rem', right: '4rem' }}>
            {!showForm && (
              <Button variant="contained" color="primary" onClick={toggleForm}>
                Create State
              </Button>
            )}
          </Grid>
          <Grid item xs={12} sm={12} sx={{ paddingTop: '0!important' }}>
            <div style={{ display: showForm ? 'block' : 'none' }}>
              <StateForm editData={editData} setEditData={setEditData} backToList={toggleForm} />
            </div>
            <div style={{ display: showForm ? 'none' : 'block' }}>
              <StateList setEditData={setEditData} toggleForm={toggleForm} />
            </div>
          </Grid>
        </Grid>
      </Box>
    </GeneralModal>
  );
};

export default StatePage;
