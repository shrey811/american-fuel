import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { rootConstants } from 'globalConstants/rootConstants';
import { apiHandler } from 'modules/apiHandler';
import { CustomerStateType } from 'types/CustomerType';

const { getRequest } = apiHandler;
const { postRequest } = apiHandler;
const { putRequest } = apiHandler;
const { deleteRequest } = apiHandler;
const sliceName = 'customers';

export const listCustomer = createAsyncThunk(`${sliceName}/customerList`, async () => {
  const response = await getRequest(`${rootConstants.CUSTOMER_URL}`);
  return response;
});

export const addCustomer = createAsyncThunk(`${sliceName}/customer`, async (customerData: any) => {
  const response = await postRequest(`${rootConstants.CUSTOMER_URL}`, customerData);
  return response;
});

export const updateIntuitCustomer = createAsyncThunk(`${sliceName}/customer/get_intuit_db_temp`, async () => {
  const response = await getRequest(`${rootConstants.CUSTOMER_INTUIT_URL}`);
  return response;
});
export const updateCustomer = createAsyncThunk(`${sliceName}/updatecustomer`, async (initialData: any) => {
  const { customer_id, ...data } = initialData;
  const response = await putRequest(`${rootConstants.CUSTOMER_URL}/${customer_id}`, data);
  return response;
});

export const deleteCustomer = createAsyncThunk(`${sliceName}/deletecustomer`, async (initialData: any) => {
  const { customer_id, ...data } = initialData;
  const response = await deleteRequest(`${rootConstants.CUSTOMER_URL}/${customer_id}`, data);
  return response;
});

const initialState: CustomerStateType = {
  listcustomerLoading: false,
  addCustomerLoading: false,
  updateIntuitCustomerLoading: false,
  listCustomerPriceListLoading: false,
  updateCustomerLoading: false,
  deleteCustomerLoading: false,
  customerList: [],
};

const customerSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(listCustomer.pending, (state) => {
      state.listcustomerLoading = true;
    });
    builder.addCase(listCustomer.fulfilled, (state, action) => {
      state.customerList = action.payload?.message.data || []; // Update state property name
      state.listcustomerLoading = false;
    });
    builder.addCase(listCustomer.rejected, (state) => {
      state.listcustomerLoading = false;
      state.customerList = [];
    });

    // ------------------------------------//

    builder.addCase(addCustomer.pending, (state) => {
      state.addCustomerLoading = true;
    });
    builder.addCase(addCustomer.fulfilled, (state, action) => {
      // state.customerListData = action.payload?.data; // Update state property name
      state.addCustomerLoading = false;
    });
    builder.addCase(addCustomer.rejected, (state) => {
      state.addCustomerLoading = false;
      // state.customerListData = [];
    });




    // ------------------------------------//

    builder.addCase(updateIntuitCustomer.pending, (state) => {
      state.updateIntuitCustomerLoading = true;
    });
    builder.addCase(updateIntuitCustomer.fulfilled, (state, action) => {
      // state.customerListData = action.payload?.data; // Update state property name
      state.updateIntuitCustomerLoading = false;
    });
    builder.addCase(updateIntuitCustomer.rejected, (state) => {
      state.updateIntuitCustomerLoading = false;
      // state.customerListData = [];
    });

    //------------------------------------//\
    builder.addCase(updateCustomer.pending, (state) => {
      state.updateCustomerLoading = true;
    });
    builder.addCase(updateCustomer.fulfilled, (state, action) => {
      // state.customerListData = action.payload?.data; // Update state property name
      state.updateCustomerLoading = false;
    });
    builder.addCase(updateCustomer.rejected, (state) => {
      state.updateCustomerLoading = false;
      // state.customerListData = [];
    });

    //------------------------------------//

    builder.addCase(deleteCustomer.pending, (state) => {
      state.deleteCustomerLoading = true;
    });
    builder.addCase(deleteCustomer.fulfilled, (state, action) => {
      // state.customerListData = action.payload?.data; // Update state property name
      state.deleteCustomerLoading = false;
    });
    builder.addCase(deleteCustomer.rejected, (state) => {
      state.deleteCustomerLoading = false;
      // state.customerListData = [];
    });

  }
});

const customerReducers = customerSlice.reducer;
export default customerReducers;
