import React, { useState } from 'react';
import { Box, Modal, Typography, List, ListItemButton, ListItemText, Divider } from '@mui/material';
import { listItemStyles } from './styles';
import StatePage from 'features/Setting/State/pages/StatePage';
import CityPage from 'features/Setting/City/pages/CityPage';
import TaxPage from 'features/Setting/Tax/pages/TaxPage';
import TerminalPage from 'features/Terminal/pages/TerminalPage';
import ProductCategoryPage from 'features/Product/pages/ProductCategoryPage';
import Product from 'features/Product/pages/ProductPage';
import RealTimeCostPage from 'features/Setting/RealTimeCost/pages/RealTimePage';
// import GeneralModal from 'components/UI/GeneralModal';
// import TaxRatePage from 'features/Setting/Tax/pages/TaxRatePage';
import Button from 'components/Button/Button';
import { useAppDispatch, useAppSelector } from 'hooks/useStore';
import { listIntuitAccount } from 'store/slices/accountSlice';
import { toast } from 'react-toastify';
import { shallowEqual } from 'react-redux';
import DropShippingPage from 'features/Setting/DropShipping/pages/DropingShippingPage';
import PricingRulePage from 'features/Setting/PricingRule/pages/PricingRulePage';
import OpisIndexPage from 'features/Setting/OpisIndex/OpisIndexPage';
import OtherChargesPage from 'features/Setting/Other Charges/pages/OtherChargesPage';
import FreightRulePage from 'features/Setting/Freight/pages/FreightRulePage';

interface SystemDataManagementModalProps {
  open: boolean;
  onClose: () => void;
  modalStyle: React.CSSProperties;
}

const SystemDataManagementModal: React.FC<SystemDataManagementModalProps> = ({ open, onClose, modalStyle }) => {
  const [modalType, setModalType] = useState<'product' | 'category' | 'state' | 'city' | 'realtimecost' | 'tax' | 'terminal' | 'taxrate' | 'pricingrule' | 'freightrule' | 'opisIndex' | 'additionalcharges' | null>(null);

  const handleModalOpen = (type: 'product' | 'category' | 'state' | 'city' | 'realtimecost' | 'tax' | 'terminal' | 'taxrate' | 'pricingrule' | 'freightrule' | 'opisIndex' | 'additionalcharges') => {
    setModalType(type);
    onClose(); // Close the SystemDataManagementModal
  };

  const handleModalClose = () => {
    setModalType(null);
  };
  const dispatch = useAppDispatch();

  const [accountListData, listInutitLoading] = useAppSelector(
    (state) => [
      state.accountReducers.accountListData,
      state.accountReducers.listInutitLoading,
    ],
    shallowEqual
  );
  const handleUpdateIntuitData = async () => {
    try {
      const action = await dispatch(listIntuitAccount());

      const response = action.payload

      toast.success(response.message.message);
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while updating Intuit data.");
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            ...modalStyle,
            width: '600px',
            height: '15rem',
            padding: '20px',
            bgcolor: 'background.paper',
            marginLeft: '20px',
            borderRadius: '4px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <Typography noWrap sx={{ marginBottom: '10px', color: 'black', fontWeight: 'bold' }}>
                PRODUCTS
              </Typography>
              <List>
                <ListItemButton onClick={() => handleModalOpen('category')} sx={listItemStyles}>
                  <ListItemText primary="Categories" />
                </ListItemButton>
                <ListItemButton onClick={() => handleModalOpen('product')} sx={listItemStyles}>
                  <ListItemText primary="Products" />
                </ListItemButton>
              </List>
            </div>
            <div>
              <Typography noWrap sx={{ marginBottom: '10px', color: 'black', fontWeight: 'bold' }}>
                ADDRESS
              </Typography>
              <List>
                <ListItemButton onClick={() => handleModalOpen('state')} sx={listItemStyles}>
                  <ListItemText primary="State" />
                </ListItemButton>
                <ListItemButton onClick={() => handleModalOpen('city')} sx={listItemStyles}>
                  <ListItemText primary="City" />
                </ListItemButton>
              </List>
            </div>
            <div>
              <Typography noWrap sx={{ marginBottom: '10px', color: 'black', fontWeight: 'bold' }}>
                PRICE TABLE
              </Typography>
              <List>
                <ListItemButton onClick={() => handleModalOpen('realtimecost')} sx={listItemStyles}>
                  <ListItemText primary="Real Time Cost" />
                </ListItemButton>
                <ListItemButton onClick={() => handleModalOpen('opisIndex')} sx={listItemStyles}>
                  <ListItemText primary="OPIS Index" />
                </ListItemButton>
                <ListItemButton onClick={() => handleModalOpen('additionalcharges')} sx={listItemStyles}>
                  <ListItemText primary="Other Charges" />
                </ListItemButton>
              </List>
            </div>
            <div>
              <Typography noWrap sx={{ marginBottom: '10px', color: 'black', fontWeight: 'bold' }}>
                TAX
              </Typography>
              <List>
                <ListItemButton onClick={() => handleModalOpen('tax')} sx={listItemStyles}>
                  <ListItemText primary="Tax" />
                </ListItemButton>
                {/* <ListItemButton onClick={() => handleModalOpen('taxrate')} sx={listItemStyles}>
                  <ListItemText primary="Tax Rate" />
                </ListItemButton> */}
              </List>
            </div>
            <div>
              <Typography noWrap sx={{ marginBottom: '10px', color: 'black', fontWeight: 'bold' }}>
                Terminal
              </Typography>
              <List>
                <ListItemButton onClick={() => handleModalOpen('terminal')} sx={listItemStyles}>
                  <ListItemText primary="Terminal" />
                </ListItemButton>
              </List>
            </div>

            {/* <div>
              <Typography noWrap sx={{ marginBottom: '10px', color: 'black', fontWeight: 'bold' }}>
                Drop Shipping
              </Typography>
              <List>
                <ListItemButton onClick={() => handleModalOpen('dropshipping')} sx={listItemStyles}>
                  <ListItemText primary="DropShipping" />
                </ListItemButton>
              </List>
            </div> */}

            <div>
              <Typography noWrap sx={{ marginBottom: '10px', color: 'black', fontWeight: 'bold' }}>
                Pricing Rule
              </Typography>
              <List>
                <ListItemButton onClick={() => handleModalOpen('pricingrule')} sx={listItemStyles}>
                  <ListItemText primary="PricingRule" />
                </ListItemButton>
                <ListItemButton onClick={() => handleModalOpen('freightrule')} sx={listItemStyles}>
                  <ListItemText primary="FreightRule" />
                </ListItemButton>
              </List>
            </div>
          </div>
          <Divider sx={{ marginTop: '1px', marginBottom: '20px' }} />

          {/* Button towards the left below divider */}
          <Button variant="outlined" color="primary"
            onClick={handleUpdateIntuitData}
            loading={listInutitLoading}
            disabled={listInutitLoading}>
            Refresh Account Intuit Data
          </Button>
        </Box>
      </Modal>

      {modalType === 'category' && (
        <ProductCategoryPage open={true} onClose={handleModalClose} />
      )}
      {modalType === 'product' && (
        <Product open={true} onClose={handleModalClose} />
      )}
      {modalType === 'state' && (
        <StatePage open={true} onClose={handleModalClose} />
      )}
      {modalType === 'city' && (
        <CityPage open={true} onClose={handleModalClose} />
      )}
      {modalType === 'realtimecost' && (
        <RealTimeCostPage open={true} onClose={handleModalClose} />
      )}
      {modalType === 'opisIndex' && (
        <OpisIndexPage open={true} onClose={handleModalClose} />
      )}
      {modalType === 'additionalcharges' && (
        <OtherChargesPage open={true} onClose={handleModalClose} />
      )}
      {modalType === 'tax' && (
        <TaxPage open={true} onClose={handleModalClose} />
      )}
      {/* {modalType === 'taxrate' && (
        <TaxRatePage open={true} onClose={handleModalClose} />

      )} */}
      {modalType === 'terminal' && (
        <TerminalPage open={true} onClose={handleModalClose} />
      )}
      {/* {modalType === 'dropshipping' && (
        <DropShippingPage open={true} onClose={handleModalClose} />
      )} */}
      {modalType === 'pricingrule' && (
        <PricingRulePage open={true} onClose={handleModalClose} />
      )}
      {modalType === 'freightrule' && (
        <FreightRulePage open={true} onClose={handleModalClose} />
      )}
    </>
  );
};

export default SystemDataManagementModal;