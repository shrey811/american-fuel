import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { rootConstants } from 'globalConstants/rootConstants';
import { apiHandler } from 'modules/apiHandler';
import { PricingRuleType } from 'types/PricingRuleType';

const { getRequest, postRequest, putRequest, deleteRequest } = apiHandler;

const sliceName = 'pricingRule';

export const listPricingRule = createAsyncThunk(`${sliceName}/pricingRuleList`, async () => {
  const response = await getRequest(`${rootConstants.PRICINGRULE_URL}/all`);
  return response;
});

export const addPricingRule = createAsyncThunk(`${sliceName}/addPricingRule`, async (initialData: any) => {
  const response = await postRequest(`${rootConstants.PRICINGRULE_URL}`, initialData);
  return response;
});

export const putPricingRule = createAsyncThunk(`${sliceName}/putPricingRule`, async (initialData: any) => {
  const { pricing_id, ...data } = initialData;
  const response = await putRequest(`${rootConstants.PRICINGRULE_URL}/${pricing_id}`, data);
  return response;
});

export const deletePricingRule = createAsyncThunk(`${sliceName}/deletePricingRule`, async (initialData: any) => {
  const { pricing_id, ...data } = initialData;
  const response = await deleteRequest(`${rootConstants.PRICINGRULE_URL}/${pricing_id}`, data);
  return response;
});

const initialState: PricingRuleType = {
  pricingDataLoading: false,
  pricingLoading: false,
  pricingListData: [],
};

const pricingSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(listPricingRule.pending, (state) => {
      state.pricingDataLoading = true;
    });
    builder.addCase(listPricingRule.fulfilled, (state, action) => {
      state.pricingListData = action.payload?.message.data || [];
      state.pricingDataLoading = false;
    });
    builder.addCase(listPricingRule.rejected, (state) => {
      state.pricingDataLoading = false;
      state.pricingListData = [];
    });
    // ADD
    builder.addCase(addPricingRule.pending, (state) => {
      state.pricingLoading = true;
    });
    builder.addCase(addPricingRule.fulfilled, (state, action) => {
      state.pricingLoading = false;
    });
    builder.addCase(addPricingRule.rejected, (state) => {
      state.pricingLoading = false;
    });
    // PUT
    builder.addCase(putPricingRule.pending, (state) => {
      state.pricingLoading = true;
    });
    builder.addCase(putPricingRule.fulfilled, (state, action) => {
      state.pricingLoading = false;
    });
    builder.addCase(putPricingRule.rejected, (state) => {
      state.pricingLoading = false;
    });
    // DELETE
    builder.addCase(deletePricingRule.pending, (state) => {
      state.pricingLoading = true;
    });
    builder.addCase(deletePricingRule.fulfilled, (state, action) => {
      state.pricingLoading = false;
    });
    builder.addCase(deletePricingRule.rejected, (state) => {
      state.pricingLoading = false;
    });
  }
})

const pricingReducers = pricingSlice.reducer;
export default pricingReducers;