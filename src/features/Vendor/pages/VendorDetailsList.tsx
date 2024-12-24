import React, { useEffect, useState } from 'react'
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
} from '@mui/material';
import { bodyStyles } from './styles';
import GeneralCard from 'components/UI/GeneralCard';

interface Props {
  editData?: any;
  setEditVendorDetails?: any;
  toggleVendorForm?: any;
}

const VendorDetailsList = (props: Props) => {

  const [vendorDetails, setVendorDetails] = useState<any>([]);

  useEffect(() => {
    if (props.editData) {
      setVendorDetails([props.editData]);
    }
  }, [props.editData]);

  const handleOpenModal = () => {
    props.toggleVendorForm(); // Toggle the state to open the modal
    props.setEditVendorDetails(vendorDetails[0]);
  };

  return (
    <>
      <GeneralCard title={"Vendor Details"} action={handleOpenModal}>
        <Box sx={{px: 2}}>
          <List>
            {vendorDetails.map((item: any, index: any) => (
              <>
                <ListItem sx={{ py: 0, px: 0 }} key={index}>
                  <ListItemText
                    primary="Vendor Name"
                    sx={{
                      color: '#1976d1',
                    }}
                  />
                  <Typography variant="body1"
                    sx={bodyStyles}
                  >
                    {item.DisplayName}
                  </Typography>
                </ListItem>
                <Divider />
                <ListItem sx={{ py: 0, px: 0 }} key={index}>
                  <ListItemText
                    primary="Primary Phone"
                    sx={{
                      color: '#1976d1',
                    }}
                  />
                  <Typography variant="body1"
                    sx={bodyStyles}
                  >
                    {item.PrimaryPhone}
                  </Typography>
                </ListItem>
                <Divider />
                <ListItem sx={{ py: 0, px: 0 }} key={index}>
                  <ListItemText
                    primary="Domain"
                    sx={{
                      color: '#1976d1',
                    }}
                  />
                  <Typography variant="body1"
                    sx={bodyStyles}
                  >
                    {item.Domain}
                  </Typography>
                </ListItem>
                <Divider />
                <ListItem sx={{ py: 0, px: 0 }} key={index}>
                  <ListItemText
                    primary="Primary Email"
                    sx={{
                      color: '#1976d1',
                    }}
                  />
                  <Typography variant="body1"
                    sx={bodyStyles}
                  >
                    {item.PrimaryEmail}
                  </Typography>
                </ListItem>
                <Divider />
                <ListItem sx={{ py: 0, px: 0 }} key={index}>
                  <ListItemText
                    primary="Company"
                    sx={{
                      color: '#1976d1',
                    }}
                  />
                  <Typography variant="body1"
                    sx={bodyStyles}
                  >
                    {item.CompanyName}
                  </Typography>
                </ListItem>
                <Divider />
                <ListItem sx={{ py: 0, px: 0 }} key={index}>
                  <ListItemText
                    primary="Web Address"
                    sx={{
                      color: '#1976d1',
                    }}
                  />
                  <Typography variant="body1"
                    sx={bodyStyles}
                  >
                    {item.WebAddress}
                  </Typography>
                </ListItem>
                <Divider />
                <ListItem sx={{ py: 0, px: 0 }} key={index}>
                  <ListItemText
                    primary="Balance"
                    sx={{
                      color: '#1976d1',
                    }}
                  />
                  <Typography variant="body1"
                    sx={bodyStyles}
                  >
                    {item.Balance}
                  </Typography>
                </ListItem>
              </>
            ))}
          </List>
        </Box>
      </GeneralCard>
    </>
  )
}

export default VendorDetailsList;