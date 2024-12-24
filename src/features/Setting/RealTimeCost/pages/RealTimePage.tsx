import { useState } from 'react';
import RealTimeForm from './RealTimeForm';
import RealTimeList from './RealTimeList';
import { Box, Button, Grid } from '@mui/material';
import RealTimeUploadFile from './RealTimeUploadFile';
import GeneralModal from 'components/UI/GeneralModal';

interface Props {
  open: boolean;
  onClose: () => void;
}
const RealTimeCostPage = (props: Props) => {

  const [editData, setEditData] = useState<any>();
  const [showForm, setShowForm] = useState(false);

  const toggleForm = () => {
    if (showForm) {
      setEditData(null);
    }
    setShowForm(!showForm);
  };

  const handleModalClose = () => {
    props.onClose();
  };

  return (
    <GeneralModal open={props.open} handleClose={handleModalClose} title="Real Time Cost" LeftArrow={showForm ? toggleForm : null}>
      <Box sx={{ width: '650px' }}>
        <Grid container spacing={2} mt={2}>
          <Grid item xs={12} sm={12} sx={{ paddingTop: '0!important', position: 'absolute', top: '1.2rem', right: '4rem' }}>
            {!showForm && (
              <Button variant="contained" color="primary" onClick={toggleForm}>
                Create Real Time Cost
              </Button>
            )}
          </Grid>
          <Grid item xs={12} sm={12} sx={{ paddingTop: '0!important' }}>
            <div style={{ display: showForm ? 'block' : 'none' }}>
              <RealTimeForm editData={editData} setEditData={setEditData} backToList={toggleForm} />
            </div>
            <div style={{ display: showForm ? 'none' : 'block' }}>
              <Grid item xs={12} sm={12}>
                <RealTimeUploadFile />
              </Grid>
              <RealTimeList setEditData={setEditData} toggleForm={toggleForm} />
            </div>
          </Grid>
        </Grid>
      </Box>
    </GeneralModal>
  )
}

export default RealTimeCostPage;