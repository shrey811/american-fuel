import React, { useEffect, useRef, useState } from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Link as RouterLink } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import { Box, Divider, List, Menu, MenuItem, Modal, Typography } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { listItemTextStyles, systemItemTextStyles, listItemStyles } from './styles';
import SellIcon from '@mui/icons-material/Sell';
import StorageIcon from '@mui/icons-material/Storage';
import SystemDataManagementModal from './SysmteDataManagement';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import SummarizeIcon from '@mui/icons-material/Summarize';
import Button from 'components/Button/Button';
interface Props {
  showText?: boolean;
  activeLink?: string;
  setActiveLink?: any;
  sidebarToggle?: boolean;
}

export const mainListItems = (props: Props) => {

  const { showText, activeLink, setActiveLink, sidebarToggle } = props;
  const [open, setOpen] = useState(false);
  const [modalStyle, setModalStyle] = useState({});
  const buttonRef = useRef<HTMLDivElement>(null);
  const handleOpen = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setModalStyle({
        position: 'absolute',
        top: rect.top + window.scrollY - 190, // Subtract to raise the modal higher
        left: rect.left + window.scrollX + rect.width,
      });
    }
    setOpen(true);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open1 = Boolean(anchorEl);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose1 = () => {
    setAnchorEl(null);
  };

  const handleItemClick = (link: string) => {
    setActiveLink(link);
  };

  useEffect(() => {
    if (sidebarToggle) {
      setOpen(false); // Close the collapsible section when sidebarToggle is true
    }
  }, [sidebarToggle]);

  const handleClose = () => setOpen(false);

  return (
    <React.Fragment>
      <ListItemButton
        component={RouterLink}
        to="/dashboard"
        sx={{
          ...(activeLink === '/dashboard' && {
            backgroundColor: '#ffc6c6', // Lighter red shade
            borderRight: '3px solid #d32f2f', // Darker red for the border
            height: '48px',
            '&:hover': {
              backgroundColor: '#ff7d7d', // Hover shade of red
            },
          }),
        }}
        onClick={() => handleItemClick('/dashboard')}
      >
        <ListItemIcon className='toggled-icon'
          title='Home'
          sx={{
            marginLeft: sidebarToggle ? "0px" : "0px",
            transition: 'min-width 0.3s ease',
            alignItems: 'center',
          }}
        >
          <DashboardIcon />
          {showText &&
            <ListItemText primary="Home"
              sx={listItemTextStyles}
            />
          }
        </ListItemIcon>
      </ListItemButton>

      < Divider sx={{ my: 3 }} />
      {sidebarToggle ? (
        <Typography noWrap sx={{ marginLeft: "20px", color: '#ffffff', }}>
          Transactions
        </Typography>
      ) : (
        <Typography noWrap sx={{ marginLeft: "20px", color: 'black', fontWeight: 'bold' }}>
          Transactions
        </Typography>
      )}

      <ListItemButton
        component={RouterLink}
        to="/sales-order"
        sx={{
          ...(activeLink === '/sales-order' && {
            // marginLeft: '20px',
            backgroundColor: '#ffc6c6', // Lighter red shade
            borderRight: '3px solid #d32f2f', // Darker red for the border
            height: '48px',
            '&:hover': {
              backgroundColor: '#ff7d7d', // Hover shade of red
            },
          }),
        }}
        onClick={() => handleItemClick('/sales-order')}
      >
        <ListItemIcon className='toggled-icon' title='Sales Order'
          sx={{
            marginLeft: sidebarToggle ? "0px" : "20px",
            alignItems: 'center',
            transition: 'width 255ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'
          }}>
          <StorefrontIcon />
          {showText &&
            <ListItemText primary="Sales Order"
              sx={listItemTextStyles}
            />
          }
        </ListItemIcon>
      </ListItemButton>
      <ListItemButton
        component={RouterLink}
        to="/drop-ship"
        sx={{
          ...(activeLink === '/drop-ship' && {
            // marginLeft: '20px',
            backgroundColor: '#ffc6c6', // Lighter red shade
            borderRight: '3px solid #d32f2f', // Darker red for the border
            height: '48px',
            '&:hover': {
              backgroundColor: '#ff7d7d', // Hover shade of red
            },
          }),
        }}
        onClick={() => handleItemClick('/drop-ship')}
      >
        <ListItemIcon className='toggled-icon' title='Sales Order'
          sx={{
            marginLeft: sidebarToggle ? "0px" : "20px",
            alignItems: 'center',
            transition: 'width 255ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'
          }}>
          <AddShoppingCartIcon />
          {showText &&
            <ListItemText primary="Drop Ship"
              sx={listItemTextStyles}
            />
          }
        </ListItemIcon>
      </ListItemButton>
      <ListItemButton
        component={RouterLink}
        to="/purchase-order"
        sx={{
          ...(activeLink === '/purchase-order' && {
            // marginLeft: '20px',
            backgroundColor: '#ffc6c6', // Lighter red shade
            borderRight: '3px solid #d32f2f', // Darker red for the border
            height: '48px',
            '&:hover': {
              backgroundColor: '#ff7d7d', // Hover shade of red
            },
          }),
        }}
        onClick={() => handleItemClick('/purchase-order')}
      >
        <ListItemIcon className='toggled-icon' title='Purchase Order'
          sx={{
            marginLeft: sidebarToggle ? "0px" : "20px",
            alignItems: 'center',
            transition: 'width 255ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'
          }}>
          <ShoppingCartIcon />
          {showText &&
            <ListItemText primary="Pruchase Order"
              sx={listItemTextStyles}
            />
          }
        </ListItemIcon>
      </ListItemButton>
      < Divider sx={{ my: 3 }} />
      {sidebarToggle ? (
        <Typography noWrap sx={{ marginLeft: "20px", color: '#ffffff' }}>
          Parties
        </Typography>
      ) : (
        <Typography noWrap sx={{ marginLeft: "20px", color: 'black', fontWeight: 'bold' }}>
          Parties
        </Typography>
      )}
      <ListItemButton
        component={RouterLink}
        to="/customer"
        sx={{
          ...(activeLink === '/customer' && {
            // marginLeft: '20px',
            backgroundColor: '#ffc6c6', // Lighter red shade
            borderRight: '3px solid #d32f2f', // Darker red for the border
            height: '48px',
            '&:hover': {
              backgroundColor: '#ff7d7d', // Hover shade of red
            },
          }),
        }}
        onClick={() => handleItemClick('/customer')}
      >
        <ListItemIcon className='toggled-icon' title='Customer'
          sx={{
            alignItems: 'center',
            transition: 'width 255ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
            '& svg': {
              fontWeight: 'bold', // making the icon bold
            },
            marginLeft: sidebarToggle ? "0px" : "10px",
          }}>
          <PeopleIcon />
          {showText &&
            <ListItemText primary="Customer"
              sx={listItemTextStyles}
            />
          }
        </ListItemIcon>
      </ListItemButton>
      <ListItemButton
        component={RouterLink}
        to="/vendor"
        sx={{
          ...(activeLink === '/vendor' && {
            // marginLeft: '20px',
            backgroundColor: '#ffc6c6', // Lighter red shade
            borderRight: '3px solid #d32f2f', // Darker red for the border
            height: '48px',
            '&:hover': {
              backgroundColor: '#ff7d7d', // Hover shade of red
            },
          }),
        }}
        onClick={() => handleItemClick('/vendor')}
      >
        <ListItemIcon className='toggled-icon' title='Suppliers'
          sx={{
            marginLeft: sidebarToggle ? "0px" : "10px",
            transition: 'min-width 0.3s ease',
            alignItems: 'center',
          }}>
          <SellIcon />
          {showText &&
            <ListItemText primary="Suppliers"
              sx={listItemTextStyles}
            />
          }
        </ListItemIcon>

      </ListItemButton>
      < Divider sx={{ my: 3 }} />

      <>
        <ListItemButton
          id="reports-menu-button"
          aria-controls={open1 ? 'reports-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open1 ? 'true' : undefined}
          onClick={handleClick}
          sx={{
            ...(activeLink === '/report/PnL-BOL' && {
              backgroundColor: '#ffc6c6', // Lighter red shade
              borderRight: '3px solid #d32f2f', // Darker red for the border
              height: '48px',
              '&:hover': {
                backgroundColor: '#ff7d7d', // Hover shade of red
              },
            }),
          }}
        >
          <ListItemIcon
            className="toggled-icon"
            title="PnL-BOL"
            sx={{
              marginLeft: sidebarToggle ? '0px' : '20px',
              alignItems: 'center',
              transition: 'width 255ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
            }}
          >
            <SummarizeIcon />
            {showText && (
              <ListItemText primary="Reports" sx={listItemTextStyles} />
            )}
          </ListItemIcon>
        </ListItemButton>

        <Menu
          id="reports-menu"
          aria-labelledby="reports-menu-button"
          anchorEl={anchorEl}
          open={open1}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right', // Shifts the menu to the right
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left', // Keeps the transform origin closer to the menu
          }}
          sx={{ marginRight: '20px' }}
        >
          <MenuItem
            component={RouterLink}
            to="/report/PnL-BOL"
            onClick={handleClose1}
            sx={{
              backgroundColor: '#ffc6c6', // Lighter red shade
              borderRight: '3px solid #d32f2f', // Darker red for the border
              height: '48px',
              '&:hover': {
                backgroundColor: '#ff7d7d', // Hover shade of red
              },
            }}
          >
            <ListItemIcon>
              <SummarizeIcon />
            </ListItemIcon>
            <ListItemText primary="PnL-BOL" />
          </MenuItem>
        </Menu>
      </>

      <Box sx={{ position: 'absolute', bottom: '40px' }}>
        <Divider sx={{ my: 3 }} />
        <ListItemButton
          ref={buttonRef}
          sx={{
            width: '100%',
            ...(activeLink === '/system-data-management' && {
              backgroundColor: '#ffc6c6', // Lighter red shade
              borderRight: '3px solid #d32f2f', // Darker red for the border
              height: '48px',
              '&:hover': {
                backgroundColor: '#ff7d7d', // Hover shade of red
              },
            }),
          }}
          onClick={handleOpen}
        >
          <ListItemIcon
            className='toggled-icon'
            title='Settings'
            sx={{
              alignItems: 'center',
              transition: 'min-width 0.3s ease',
              marginLeft: sidebarToggle ? "0px" : "10px",
            }}
          >
            <StorageIcon />
            {showText && <ListItemText primary="System Data Management" sx={systemItemTextStyles} />}
          </ListItemIcon>
        </ListItemButton>
        <SystemDataManagementModal open={open} onClose={handleClose} modalStyle={modalStyle} />
        {/* <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Box
            sx={{
              ...modalStyle,
              width: '600px', // Adjust width as per your requirement
              height: '15rem', // Adjust height as per your requirement
              padding: '20px',
              bgcolor: 'background.paper',
              marginLeft: '20px', // Move more to the right
              borderRadius: '4px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <Typography noWrap sx={{ marginBottom: '10px', color: 'black', fontWeight: 'bold' }}>
                  PRODUCTS
                </Typography>
                <List>
                  <ListItemButton component={RouterLink} to="/product-category" onClick={handleClose} sx={listItemStyles}>
                    <ListItemText primary="Categories" />
                  </ListItemButton>

                  <ListItemButton component={RouterLink} to="/product" onClick={handleClose} sx={listItemStyles}>
                    <ListItemText primary="Products" />
                  </ListItemButton>
                </List>
              </div>

              <div>
                <Typography noWrap sx={{ marginBottom: '10px', color: 'black', fontWeight: 'bold' }}>
                  ADDRESS
                </Typography>
                <List>
                  <ListItemButton component={RouterLink} to="/state" onClick={handleClose} sx={listItemStyles}>
                    <ListItemText primary="State" />
                  </ListItemButton>

                  <ListItemButton component={RouterLink} to="/city" onClick={handleClose} sx={listItemStyles}>
                    <ListItemText primary="City" />
                  </ListItemButton>
                </List>
              </div>

              <div>
                <Typography noWrap sx={{ marginBottom: '10px', color: 'black', fontWeight: 'bold' }}>
                  PRICE TABLE
                </Typography>
                <List>
                  <ListItemButton component={RouterLink} to="/real-time-cost" onClick={handleClose} sx={listItemStyles}>
                    <ListItemText primary="Real Time Cost" />
                  </ListItemButton>

                  <ListItemButton onClick={handleClose} sx={listItemStyles}>
                    <ListItemText primary="OPIS Index" />
                  </ListItemButton>
                </List>
              </div>

              <div>
                <Typography noWrap sx={{ marginBottom: '10px', color: 'black', fontWeight: 'bold' }}>
                  TAX
                </Typography>
                <List>
                  <ListItemButton component={RouterLink} to="/tax" onClick={handleClose} sx={listItemStyles}>
                    <ListItemText primary="Tax" />
                  </ListItemButton>
                </List>
              </div>

              <div>
                <Typography noWrap sx={{ marginBottom: '10px', color: 'black', fontWeight: 'bold' }}>
                  Terminal
                </Typography>
                <List>
                  <ListItemButton component={RouterLink} to="/terminal" onClick={handleClose} sx={listItemStyles}>
                    <ListItemText primary="Terminal" />
                  </ListItemButton>
                </List>
              </div>
            </div>
          </Box>
        </Modal> */}
      </Box >
    </React.Fragment >
  );
};
