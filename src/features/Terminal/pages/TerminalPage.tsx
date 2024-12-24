import React, { useState } from 'react';
import { Box, Grid, Button } from '@mui/material';
import TerminalForm from './TerminalForm';
import TerminalList from './TerminalList';
import GeneralModal from 'components/UI/GeneralModal';

interface Props {
    open: boolean;
    onClose: () => void;
  }

const TerminalPage = (props: Props) => {
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
        <GeneralModal open={props.open} handleClose={handleModalClose} title="Terminal" LeftArrow={showForm ? toggleForm : null}>
            <Box className="State" sx={{ width: '800px' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} sx={{ paddingTop: '0!important', position: 'absolute', top: '1.2rem', right: '4rem' }}>
                        {!showForm && (
                            <Button variant="contained" color="primary" onClick={toggleForm}>
                                Create Terminal
                            </Button>
                        )}
                    </Grid>
                    <Grid item xs={12} sm={12} sx={{ paddingTop: '0!important' }}>
                        <div style={{ display: showForm ? 'block' : 'none' }}>
                            <TerminalForm editData={editData} setEditData={setEditData} backToList={toggleForm} />
                        </div>
                        <div style={{ display: showForm ? 'none' : 'block' }}>
                            <TerminalList setEditData={setEditData} toggleForm={toggleForm} />
                        </div>
                    </Grid>
                </Grid>
            </Box>
        </GeneralModal>
    )
}

export default TerminalPage;