import { Box, Button, Grid } from '@mui/material';
import GeneralCard from 'components/UI/GeneralCard';
import CityForm from './CityForm';
import CityList from './CityList';
import { useState } from 'react';
import GeneralModal from 'components/UI/GeneralModal';

interface Props {
  open: boolean;
  onClose: () => void;
}
const CityPage = (props: Props) => {

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
    <GeneralModal open={props.open} handleClose={handleModalClose} title="City" LeftArrow={showForm ? toggleForm : null}>
      <Box className="City" sx={{ width: '650px' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} sx={{ paddingTop: '0!important', position: 'absolute', top: '1.2rem', right: '4rem' }}>
            {!showForm && (
              <Button variant="contained" color="primary" onClick={toggleForm}>
                Create City
              </Button>
            )}
            {/* {showForm && (
            <Button variant="contained" color="primary" onClick={toggleForm}>
              Back
            </Button>
          )} */}
          </Grid>
          <Grid item xs={12} sm={12} sx={{ paddingTop: '0!important' }}>
            <div style={{ display: showForm ? 'block' : 'none' }}>
              <CityForm editData={editData} setEditData={setEditData} backToList={toggleForm} />
            </div>
            <div style={{ display: showForm ? 'none' : 'block' }}>
              <CityList setEditData={setEditData} toggleForm={toggleForm} />
            </div>
          </Grid>
        </Grid>
      </Box>
    </GeneralModal>
  )
}

export default CityPage;