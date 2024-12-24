import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { rootConstants } from 'globalConstants/rootConstants';
import { apiHandler } from 'modules/apiHandler';
// import { CustomerPRType } from 'types/CustomerPriceRule';
import { CustomerFreightRuleType } from 'types/CustomerFreightRule';

const { getRequest, postRequest, putRequest, deleteRequest } = apiHandler;

const sliceName = 'Customer Freight Rule';

export const listCustomerFreightRule = createAsyncThunk(`${sliceName}/listCustomerFreightRule`, async (initialData: any) => {
  const { customerFR_id } = initialData;
    const response = await getRequest(`${rootConstants.CUSTOMER_URL}/customer-freight-rule/${customerFR_id}`);
    return response
});

export const addCustomerFreightRule = createAsyncThunk(`${sliceName}/addCustomerFreightRule`, async (initialData: any) => {
  const response = await postRequest(`${rootConstants.CUSTOMER_URL}/customer-freight-rule`, initialData);
  return response;
});

// export const putCustomerPR = createAsyncThunk(`${sliceName}/putCustomerPR`, async (initialData: any) => {
//   const { customerFR_id, ...data } = initialData;
//   const response = await putRequest(`${rootConstants.CUSTOMER_URL}/${customerFR_id}`, data);
//   return response;
// });

// export const deleteCustomerPR = createAsyncThunk(`${sliceName}/deleteCustomerPR`, async (initialData: any) => {
//   const { customerFR_id, ...data } = initialData;
//   const response = await deleteRequest(`${rootConstants.CUSTOMER_URL}/${customerFR_id}`, data);
//   return response;
// });

const initialState: CustomerFreightRuleType = {
  customerFreightRuleDataLoading: false,
  customerFreightRuleLoading: false,
  customerFreightRuleListData: [],
};

const customerFreightRuleSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(listCustomerFreightRule.pending, (state) => {
      state.customerFreightRuleDataLoading = true;
    });
    builder.addCase(listCustomerFreightRule.fulfilled, (state, action) => {
      state.customerFreightRuleListData = action.payload?.message.data || [];
      state.customerFreightRuleDataLoading = false;
    });
    builder.addCase(listCustomerFreightRule.rejected, (state) => {
      state.customerFreightRuleDataLoading = false;
      state.customerFreightRuleListData = [];
    });
    // ADD
    builder.addCase(addCustomerFreightRule.pending, (state) => {
      state.customerFreightRuleLoading = true;
    });
    builder.addCase(addCustomerFreightRule.fulfilled, (state, action) => {
      state.customerFreightRuleLoading = false;
    });
    builder.addCase(addCustomerFreightRule.rejected, (state) => {
      state.customerFreightRuleLoading = false;
    });
    // // PUT
    // builder.addCase(putCustomerPR.pending, (state) => {
    //   state.customerFreightRuleLoading = true;
    // });
    // builder.addCase(putCustomerPR.fulfilled, (state, action) => {
    //   state.customerFreightRuleLoading = false;
    // });
    // builder.addCase(putCustomerPR.rejected, (state) => {
    //   state.customerFreightRuleLoading = false;
    // });
    // // DELETE
    // builder.addCase(deleteCustomerPR.pending, (state) => {
    //   state.customerFreightRuleLoading = true;
    // });
    // builder.addCase(deleteCustomerPR.fulfilled, (state, action) => {
    //   state.customerFreightRuleLoading = false;
    // });
    // builder.addCase(deleteCustomerPR.rejected, (state) => {
    //   state.customerFreightRuleLoading = false;
    // });
  }
})

const customerFreightRuleReducers = customerFreightRuleSlice.reducer;
export default customerFreightRuleReducers;