import React, { useState } from 'react';
import { Popover, Typography, Divider, IconButton, TextField, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { ValidatorForm } from 'react-material-ui-form-validator';


type Props = {
  anchorEl: HTMLElement | null;
  handleClose: () => void;
  open: boolean;
};

const SearchPage = (props: Props) => {

  const [columnSearchQuery, setColumnSearchQuery] = useState('');

  const handleSubmit = () => {

  }

  return (
    <Popover
      open={props.open}
      anchorEl={props.anchorEl}
      onClose={props.handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      sx={{ marginRight: '2rem', }}
    >
      <Typography
        sx={{ p: 2, textAlign: 'start', textTransform: 'uppercase' }}
        component="h4"
        variant="h5"
        color="inherit" noWrap
      >
        Search
      </Typography>
      <Divider />
      <ValidatorForm onSubmit={() => { handleSubmit }}>
        <TextField
          value={columnSearchQuery}
          onChange={(e) => setColumnSearchQuery(e.target.value)}
          variant="outlined"
          margin="dense"
          size='small'
          fullWidth
          placeholder="Search Columns..."
          InputProps={{
            startAdornment: (
              <IconButton size="small">
                <SearchIcon />
              </IconButton>
            ),
          }}
          sx={{ padding: '10px' }}
        />
      </ValidatorForm>
      <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, whiteSpace: 'nowrap' }}>
        <Typography component="h4"
          variant="h6"
          color="inherit"
          >Search For:
        </Typography>
        <Typography sx={{fontSize: '0.6rem', pl:1}}>
          Customers, Suppliers, Transactions and Products
        </Typography>
      </Box>
      <Box sx={{display: 'flex', alignItems: 'center', px: 2, pb: 2, pt: 1, whiteSpace: 'nowrap' }}>
        <Typography component="h4"
          variant="h6"
          color="inherit"
          >BY:
        </Typography>
        <Typography sx={{fontSize: '0.6rem', pl:1}}>
          Name, Address, Amount and Date
        </Typography>
      </Box>
    </Popover>
  );
};

export default SearchPage;
