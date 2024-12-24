import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { rootConstants } from 'globalConstants/rootConstants';
import { apiHandler } from 'modules/apiHandler';
import { CustomerPRType } from 'types/CustomerPriceRule';

const { getRequest, postRequest, putRequest, deleteRequest } = apiHandler;

const sliceName = 'Customer Price Rule';

export const listCustomerPR = createAsyncThunk(`${sliceName}/listCustomerPR`, async (initialData: any) => {
  const { customerPR_id } = initialData;
    const response = await getRequest(`${rootConstants.CUSTOMER_URL}/customer-price-rule/${customerPR_id}`);
    return response
});

export const addCustomerPR = createAsyncThunk(`${sliceName}/addCustomerPR`, async (initialData: any) => {
  const response = await postRequest(`${rootConstants.CUSTOMER_URL}/customer-price-rule`, initialData);
  return response;
});

// export const putCustomerPR = createAsyncThunk(`${sliceName}/putCustomerPR`, async (initialData: any) => {
//   const { customerPR_id, ...data } = initialData;
//   const response = await putRequest(`${rootConstants.CUSTOMER_URL}/${customerPR_id}`, data);
//   return response;
// });

// export const deleteCustomerPR = createAsyncThunk(`${sliceName}/deleteCustomerPR`, async (initialData: any) => {
//   const { customerPR_id, ...data } = initialData;
//   const response = await deleteRequest(`${rootConstants.CUSTOMER_URL}/${customerPR_id}`, data);
//   return response;
// });

const initialState: CustomerPRType = {
  customerPRDataLoading: false,
  customerPRLoading: false,
  customerPRListData: [],
};

const customerPRSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(listCustomerPR.pending, (state) => {
      state.customerPRDataLoading = true;
    });
    builder.addCase(listCustomerPR.fulfilled, (state, action) => {
      state.customerPRListData = action.payload?.message.data || [];
      state.customerPRDataLoading = false;
    });
    builder.addCase(listCustomerPR.rejected, (state) => {
      state.customerPRDataLoading = false;
      state.customerPRListData = [];
    });
    // ADD
    builder.addCase(addCustomerPR.pending, (state) => {
      state.customerPRLoading = true;
    });
    builder.addCase(addCustomerPR.fulfilled, (state, action) => {
      state.customerPRLoading = false;
    });
    builder.addCase(addCustomerPR.rejected, (state) => {
      state.customerPRLoading = false;
    });
    // // PUT
    // builder.addCase(putCustomerPR.pending, (state) => {
    //   state.customerPRLoading = true;
    // });
    // builder.addCase(putCustomerPR.fulfilled, (state, action) => {
    //   state.customerPRLoading = false;
    // });
    // builder.addCase(putCustomerPR.rejected, (state) => {
    //   state.customerPRLoading = false;
    // });
    // // DELETE
    // builder.addCase(deleteCustomerPR.pending, (state) => {
    //   state.customerPRLoading = true;
    // });
    // builder.addCase(deleteCustomerPR.fulfilled, (state, action) => {
    //   state.customerPRLoading = false;
    // });
    // builder.addCase(deleteCustomerPR.rejected, (state) => {
    //   state.customerPRLoading = false;
    // });
  }
})

const customerPRReducers = customerPRSlice.reducer;
export default customerPRReducers;