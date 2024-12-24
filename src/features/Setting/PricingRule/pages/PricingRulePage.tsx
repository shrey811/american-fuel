import { Box, Button, Grid } from '@mui/material';
import GeneralModal from 'components/UI/GeneralModal';
import { useAppDispatch } from 'hooks/useStore';
import React, { useEffect, useState } from 'react';
import PricingRuleForm from './PricingRuleForm';
import PricingRuleList from './PricingRuleList';

interface Props {
  open: boolean;
  onClose: () => void;
}

const PricingRulePage = (props: Props) => {

  const dispatch = useAppDispatch();
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
    <GeneralModal open={props.open} handleClose={handleModalClose} title="Pricing Rule" LeftArrow={showForm ? toggleForm : null}>
      <Box sx={{ width: '720px' }}>
        <Grid container spacing={2} mt={2}>
          <Grid item xs={12} sm={12} sx={{ paddingTop: '0!important', position: 'absolute', top: '1.2rem', right: '4rem' }}>
            {!showForm && (
              <Button variant="contained" color="primary" onClick={toggleForm}>
                Create Pricing Rule
              </Button>
            )}
          </Grid>
          <Grid item xs={12} sm={12} sx={{ paddingTop: '0!important' }}>
            <div style={{ display: showForm ? 'block' : 'none' }}>
              <PricingRuleForm editData={editData} setEditData={setEditData} backToList={toggleForm} />
            </div>
            <div style={{ display: showForm ? 'none' : 'block' }}>
              <PricingRuleList setEditData={setEditData} toggleForm={toggleForm} />
            </div>
          </Grid>
        </Grid>
      </Box>
    </GeneralModal>
  )
}

export default PricingRulePage;