import React from 'react';
import GeneralCard from 'components/UI/GeneralCard';
import { Typography, Divider, ListItemIcon } from '@mui/material';
import { TypographyStyles } from './styles';
import ProductsIcon from '@mui/icons-material/Category'; // Example icon for Products
import CustomersIcon from '@mui/icons-material/People'; // Example icon for Customers
import SellIcon from '@mui/icons-material/Sell'; // Example icon for Suppliers

type Props = {}

const ProdCustSupTotal = (props: Props) => {

  const sections = [
    { icon: <ProductsIcon />, title: 'Products', total: '1923' },
    { icon: <CustomersIcon />, title: 'Customers', total: '1923' },
    { icon: <SellIcon />, title: 'Suppliers', total: '1923' },
  ];

  return (
    <GeneralCard title={""}>
      {sections.map((section, index) => (
        <div>
          <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography sx={{ display: 'flex', alignItems: 'center', fontSize: 14, p: 2, px: 4 }} color="text.secondary" gutterBottom>
              <ListItemIcon className="icon" sx={{ marginRight: '1rem' }}>
                {section.icon}
              </ListItemIcon>
              {section.title}
            </Typography>
            <Typography variant="h5" component="div" sx={TypographyStyles}>
              {section.total}
            </Typography>
          </div>
          <Divider />
        </div>
      ))}
    </GeneralCard>
  )
}

export default ProdCustSupTotal;