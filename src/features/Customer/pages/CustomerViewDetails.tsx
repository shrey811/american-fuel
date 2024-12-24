import React, { useState } from 'react';
import CustomerPriceRule from './CustomerPriceRule';
import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Typography,
  Button,
  TablePagination,
} from '@mui/material';
import moment from 'moment';
import { useAppSelector } from 'hooks/useStore';
import { shallowEqual } from 'react-redux';
import CustomerFreightRule from './CustomerFreightRule';

interface Props {
  fetchCustomer: any;
  toggleDetails: any;
  setFetchCustomer: any;
  toggleForm: any;
  setEditData?: any;
  customerPR?: any;
  showPriceRuleForm: boolean;
  showFreightRuleForm: boolean;
  toggleFreightRuleForm: () => void;
  togglePriceRuleForm: () => void;
  setCustomerPR?: any;
  customerAssets?: any;
  setCustomerFR?: any;
  customerFR?: any;
}

const CustomerViewDetails = (props: Props) => {
  const [addressPage, setAddressPage] = useState(0);
  const [addressRowsPerPage, setAddressRowsPerPage] = useState(5);
  const [priceRulePage, setPriceRulePage] = useState(0);
  const [priceRuleRowsPerPage, setPriceRuleRowsPerPage] = useState(5);
  const [freightRulePage, setFreightRulePage] = useState(0);
  const [freightRuleRowsPerPage, setFreightRuleRowsPerPage] = useState(5);

  const [stateListData, stateDataLoading] = useAppSelector(
    (state) => [
      state.stateReducers.stateListData,
      state.stateReducers.stateDataLoading
    ],
    shallowEqual
  );

  const [listCityies, listCityStateLoading] = useAppSelector(
    (state) => [
      state.cityStateReducers.cityStateList,
      state.cityStateReducers.listCityStateLoading
    ],
    shallowEqual
  );

  // Utility function to find city or state name by ID
  const getCityNameById = (id: number) => {
    const city = listCityies.find((city: any) => city.Id === id);
    return city ? city.Name : 'N/A';
  };

  const getStateNameById = (id: number) => {
    const state = stateListData.find((state: any) => state.Id === id);
    return state ? state.Name : 'N/A';
  };

  const handleChangeAddressPage = (event: unknown, newPage: number) => {
    setAddressPage(newPage);
  };

  const handleChangeAddressRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddressRowsPerPage(parseInt(event.target.value, 10));
    setAddressPage(0);
  };

  const handleChangePriceRulePage = (event: unknown, newPage: number) => {
    setPriceRulePage(newPage);
  };

  const handleChangePriceRuleRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPriceRuleRowsPerPage(parseInt(event.target.value, 10));
    setPriceRulePage(0);
  };

  const handleChangeFreightRulePage = (event: unknown, newPage: number) => {
    setFreightRulePage(newPage);
  };

  const handleChangeFreightRuleRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFreightRuleRowsPerPage(parseInt(event.target.value, 10));
    setFreightRulePage(0);
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
              <TableHead>
                <TableRow sx={{ background: '#EFEFEF' }}>
                  <TableCell>Customer Name</TableCell>
                  <TableCell>Customer Display Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone No</TableCell>
                  <TableCell>Mobile No</TableCell>
                  {/* <TableCell>FamilyName</TableCell>
                  <TableCell>AlternatePhone</TableCell> */}
                  <TableCell>Other</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow sx={{ background: '#F8F8F8' }}>
                  <TableCell>{props.fetchCustomer.GivenName}</TableCell>
                  {/* <TableCell>{props.fetchCustomer.FamilyName}</TableCell> */}
                  <TableCell>{props.fetchCustomer.DisplayName}</TableCell>
                  <TableCell>{props.fetchCustomer.email || 'N/A'}</TableCell>
                  <TableCell>{props.fetchCustomer.PrimaryPhone}</TableCell>
                  <TableCell>{props.fetchCustomer.Mobile}</TableCell>
                  {/* <TableCell>{props.fetchCustomer.AlternatePhone}</TableCell> */}
                  <TableCell>{props.fetchCustomer.Other}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={12} md={12} mt={4}>
          <Typography variant="h5" sx={{ marginBottom: '1rem', fontWeight: 'bold', color: '#000000' }}>
            Addresses
          </Typography>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
              <TableHead>
                <TableRow sx={{ background: '#EFEFEF' }}>
                  <TableCell>Id</TableCell>
                  <TableCell>Street 1</TableCell>
                  <TableCell>Street 2</TableCell>
                  <TableCell>City</TableCell>
                  <TableCell>State</TableCell>
                  <TableCell>Zip Code</TableCell>
                  <TableCell>CountrySubDivisionCode</TableCell>
                  {/* <TableCell>Long</TableCell>
                  <TableCell>Lat</TableCell> */}
                  <TableCell>Note</TableCell>
                  <TableCell>PostalCode</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.fetchCustomer.Address.length > 0 ? (
                  props.fetchCustomer.Address
                    .slice(addressPage * addressRowsPerPage, addressPage * addressRowsPerPage + addressRowsPerPage)
                    .map((item: any, index: any) => (
                      <TableRow key={index} sx={{ background: index % 2 === 0 ? '#FFFFFF' : '#F8F8F8' }}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.Line1}</TableCell>
                        <TableCell>{item.Line2 || 'N/A'}</TableCell>
                        <TableCell>{`${getCityNameById(item.CitiesFId)}`}</TableCell>
                        <TableCell>{`${getStateNameById(item.StatesFId)}`}</TableCell>
                        <TableCell>{item.Zip}</TableCell>
                        <TableCell>{item.CountrySubDivisionCode}</TableCell>
                        {/* <TableCell>{item.Long}</TableCell>
                        <TableCell>{item.Lat}</TableCell> */}
                        <TableCell>{item.Note}</TableCell>
                        <TableCell>{item.PostalCode}</TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[25, 35, 45]}
            component="div"
            count={props.fetchCustomer.Address.length}
            rowsPerPage={addressRowsPerPage}
            page={addressPage}
            onPageChange={handleChangeAddressPage}
            onRowsPerPageChange={handleChangeAddressRowsPerPage}
          />
        </Grid>

        <Grid item xs={12} md={12} mt={4}>
          <Typography variant="h5" sx={{ marginBottom: '1rem', fontWeight: 'bold', color: '#000000' }}>
            Customer Price Rules
          </Typography>
          {!props.showPriceRuleForm ? (
            <>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                  <TableHead>
                    <TableRow sx={{ background: '#EFEFEF' }}>
                      <TableCell>Id</TableCell>
                      <TableCell>Product Category</TableCell>
                      <TableCell>Product</TableCell>
                      <TableCell>Markup</TableCell>
                      <TableCell>Rate</TableCell>
                      <TableCell>Unit</TableCell>
                      <TableCell>Rate Type</TableCell>
                      <TableCell>EffectiveDateTime</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Array.isArray(props.customerPR) && props.customerPR.length > 0 ? (
                      props.customerPR
                        .slice(priceRulePage * priceRuleRowsPerPage, priceRulePage * priceRuleRowsPerPage + priceRuleRowsPerPage)
                        .map((item: any, index: any) => (
                          <TableRow key={index} sx={{ background: index % 2 === 0 ? '#FFFFFF' : '#F8F8F8' }}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{item.ProductCategory}</TableCell>
                            <TableCell>{item.Product}</TableCell>
                            <TableCell>{item.Markup}</TableCell>
                            <TableCell>{item.Rate}</TableCell>
                            <TableCell>{item.Unit}</TableCell>
                            <TableCell>{item.SubType}</TableCell>
                            <TableCell>{moment.utc(item.EffectiveDateTime).format('YYYY-MM-DDTHH:mm')}</TableCell>
                          </TableRow>
                        ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          No data available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[25, 35, 45]}
                component="div"
                count={Array.isArray(props.customerPR) ? props.customerPR.length : 0}
                rowsPerPage={priceRuleRowsPerPage}
                page={priceRulePage}
                onPageChange={handleChangePriceRulePage}
                onRowsPerPageChange={handleChangePriceRuleRowsPerPage}
              />
            </>
          ) : (
            <CustomerPriceRule
              fetchCustomer={props.fetchCustomer}
              toggleDetails={props.toggleDetails}
              toggleForm={props.toggleForm}
              togglePriceRuleForm={props.togglePriceRuleForm}
              customerPR={props.customerPR}
              setCustomerPR={props.setCustomerPR}
            />
          )}
        </Grid>

        <Grid item xs={12} md={12} mt={4}>
          <Typography variant="h5" sx={{ marginBottom: '1rem', fontWeight: 'bold', color: '#000000' }}>
            Customer Freight Rule
          </Typography>
          {!props.showFreightRuleForm ? (
            <>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                  <TableHead>
                    <TableRow sx={{ background: '#EFEFEF' }}>
                      <TableCell>Id</TableCell>
                      <TableCell>Product Category</TableCell>
                      <TableCell>Product</TableCell>
                      <TableCell>Markup</TableCell>
                      <TableCell>Rate</TableCell>
                      <TableCell>Unit</TableCell>
                      <TableCell>EffectiveDateTime</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Array.isArray(props.customerFR) && props.customerFR.length > 0 ? (
                      props.customerFR
                        .slice(freightRulePage * freightRuleRowsPerPage, freightRulePage * freightRuleRowsPerPage + freightRuleRowsPerPage)
                        .map((item: any, index: any) => (
                          <TableRow key={index} sx={{ background: index % 2 === 0 ? '#FFFFFF' : '#F8F8F8' }}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{item.ProductCategory}</TableCell>
                            <TableCell>{item.Product}</TableCell>
                            <TableCell>{item.Markup}</TableCell>
                            <TableCell>{item.Rate}</TableCell>
                            <TableCell>{item.Unit}</TableCell>
                            <TableCell>{moment.utc(item.EffectiveDateTime).format('YYYY-MM-DDTHH:mm')}</TableCell>
                          </TableRow>
                        ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          No data available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[25, 35, 45]}
                component="div"
                count={Array.isArray(props.customerFR) ? props.customerFR.length : 0}
                rowsPerPage={freightRuleRowsPerPage}
                page={freightRulePage}
                onPageChange={handleChangeFreightRulePage}
                onRowsPerPageChange={handleChangeFreightRuleRowsPerPage}
              />
            </>
          ) : (
            <CustomerFreightRule
              fetchCustomer={props.fetchCustomer}
              toggleDetails={props.toggleDetails}
              toggleForm={props.toggleForm}
              toggleFreightRuleForm={props.toggleFreightRuleForm}
              customerFR={props.customerFR}
            // setCustomerFR={props.setCustomerFR}
            />
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default CustomerViewDetails;