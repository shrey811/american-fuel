import React, { useState, useEffect } from 'react';
import GeneralModal from 'components/UI/GeneralModal';
import { Box, Typography, TextField, Button, Grid } from '@mui/material';

type Props = {
  open: boolean;
  handleClose: () => void;
  data: {
    Vendors: string;
    Products: string;
    Terminals: string;
    Cost: string;
    EffectiveDateTime: string;
    State: string;
    City: string;
    CostType: string;
    ProductsCategory: string;
    SupplyFrom: string;
  } | null;
  onSave: (updatedData: any) => void;
};

const RealTimeUploadEdit = ({ open, handleClose, data, onSave }: Props) => {
  const [formData, setFormData] = useState({
    Vendors: '',
    Products: '',
    Terminals: '',
    Cost: '',
    EffectiveDateTime: '',
    State: '',
    City: '',
    CostType: '',
    ProductsCategory: '',
    SupplyFrom: ''
  });

  useEffect(() => {
    if (data) {
      setFormData({
        Vendors: data.Vendors || '',
        Products: data.Products || '',
        Terminals: data.Terminals || '',
        Cost: data.Cost || '',
        EffectiveDateTime: data.EffectiveDateTime || '',
        State: data.State || '',
        City: data.City || '',
        CostType: data.CostType || '',
        ProductsCategory: data.ProductsCategory || '',
        SupplyFrom: data.SupplyFrom || ''
      });
    }
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    if (formData) {
      onSave(formData);
      handleClose();
    }
  };

  return (
    <GeneralModal title="Edit Uploaded Real Time Cost" open={open} handleClose={handleClose}>
      <Box component="form" sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Vendor"
              name="Vendors"
              value={formData.Vendors}
              onChange={handleChange}
              size='small'
              fullWidth
              variant="filled"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Product"
              name="Products"
              value={formData.Products}
              onChange={handleChange}
              size='small'
              fullWidth
              variant="filled"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Terminal"
              name="Terminals"
              value={formData.Terminals}
              onChange={handleChange}
              size='small'
              fullWidth
              variant="filled"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Cost"
              name="Cost"
              value={formData.Cost}
              onChange={handleChange}
              size='small'
              fullWidth
              variant="filled"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              type="datetime-local"
              label="Effective Date"
              name="EffectiveDateTime"
              value={formData.EffectiveDateTime}
              onChange={handleChange}
              size='small'
              fullWidth
              variant="filled"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="State"
              name="State"
              value={formData.State}
              onChange={handleChange}
              size='small'
              fullWidth
              variant="filled"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="City"
              name="City"
              value={formData.City}
              onChange={handleChange}
              size='small'
              fullWidth
              variant="filled"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Cost Type"
              name="CostType"
              value={formData.CostType}
              onChange={handleChange}
              size='small'
              fullWidth
              variant="filled"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Product Category"
              name="ProductsCategory"
              value={formData.ProductsCategory}
              onChange={handleChange}
              size='small'
              fullWidth
              variant="filled"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Supply From"
              name="SupplyFrom"
              value={formData.SupplyFrom}
              onChange={handleChange}
              size='small'
              fullWidth
              variant="filled"
            />
          </Grid>
        </Grid>
        <Button variant="contained" onClick={handleSubmit}>Save</Button>
      </Box>
    </GeneralModal>
  );
}

export default RealTimeUploadEdit;
