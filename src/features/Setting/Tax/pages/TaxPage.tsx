import React, { useEffect, useState } from 'react';
import { Box, Button, Grid } from '@mui/material';
import TaxForm from './TaxForm';
import TaxList from './TaxList';
import { useAppDispatch } from 'hooks/useStore';
import { listTax } from 'store/slices/taxSlice';
import GeneralModal from 'components/UI/GeneralModal';

interface Props {
  open: boolean;
  onClose: () => void;
}

const TaxPage = (props: Props) => {
  const dispatch = useAppDispatch();
  const [editData, setEditData] = useState<any>();
  const [showForm, setShowForm] = useState(false);

  const toggleForm = () => {
    setShowForm(!showForm);
    if (showForm) {
      setEditData(null)
    }
  };

  useEffect(() => {
    dispatch(listTax());
  }, []);

  const handleModalClose = () => {
    props.onClose();
  };

  return (
    <GeneralModal open={props.open} handleClose={handleModalClose} title="Tax" LeftArrow={showForm ? toggleForm : null}>
      <Box sx={{ width: '650px' }}>
        <Grid container spacing={2} mt={2}>
          <Grid item xs={12} sm={12} sx={{ paddingTop: '0!important', position: 'absolute', top: '1.2rem', right: '4rem' }}>
            {!showForm && (
              <Button variant="contained" color="primary" onClick={toggleForm}>
                Create Tax
              </Button>
            )}
          </Grid>
          <Grid item xs={12} sm={12} sx={{ paddingTop: '0!important' }}>
            <div style={{ display: showForm ? 'block' : 'none' }}>
              <TaxForm editData={editData} setEditData={setEditData} backToList={toggleForm} />
            </div>
            <div style={{ display: showForm ? 'none' : 'block' }}>
              <TaxList setEditData={setEditData} toggleForm={toggleForm} />
            </div>
          </Grid>
        </Grid>
      </Box>
    </GeneralModal>
  )
}

export default TaxPage;