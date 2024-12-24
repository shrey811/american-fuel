import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { rootConstants } from 'globalConstants/rootConstants';
import { apiHandler } from 'modules/apiHandler';
import { FreightRuleType } from 'types/FreightRuleType';

const { getRequest, postRequest, putRequest, deleteRequest } = apiHandler;

const sliceName = 'freightRule';

export const listFreightRule = createAsyncThunk(`${sliceName}/freightRuleList`, async () => {
    const response = await getRequest(`${rootConstants.FREIGHTRULE_URL}/all`);
    return response;
});

export const addFreightRule = createAsyncThunk(`${sliceName}/addFreightRule`, async (initialData: any) => {
    const response = await postRequest(`${rootConstants.FREIGHTRULE_URL}`, initialData);
    return response;
});

export const putFreightRule = createAsyncThunk(`${sliceName}/putFreightRule`, async (initialData: any) => {
    const { freight_id, ...data } = initialData;
    const response = await putRequest(`${rootConstants.FREIGHTRULE_URL}/${freight_id}`, data);
    return response;
});

export const filterFreightRule = createAsyncThunk(`${sliceName}/filterFreightRule`, async (initialData: any) => {
    const response = await postRequest(`${rootConstants.SALSE_ORDER_URL}/filter/freight`, initialData);
    return response;
})

export const deleteFreightRule = createAsyncThunk(`${sliceName}/deleteFreightRule`, async (initialData: any) => {
    const { freight_id, ...data } = initialData;
    const response = await deleteRequest(`${rootConstants.FREIGHTRULE_URL}/${freight_id}`, data);
    return response;
});

const initialState: FreightRuleType = {
    freightDataLoading: false,
    freightLoading: false,
    freightRuleListData: [],
};

const freightSlice = createSlice({
    name: sliceName,
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(listFreightRule.pending, (state) => {
            state.freightDataLoading = true;
        });
        builder.addCase(listFreightRule.fulfilled, (state, action) => {
            state.freightRuleListData = action.payload?.message.data || [];
            state.freightDataLoading = false;
        });
        builder.addCase(listFreightRule.rejected, (state) => {
            state.freightDataLoading = false;
            state.freightRuleListData = [];
        });
        // ADD
        builder.addCase(addFreightRule.pending, (state) => {
            state.freightLoading = true;
        });
        builder.addCase(addFreightRule.fulfilled, (state, action) => {
            state.freightLoading = false;
        });
        builder.addCase(addFreightRule.rejected, (state) => {
            state.freightLoading = false;
        });
        // PUT
        builder.addCase(putFreightRule.pending, (state) => {
            state.freightLoading = true;
        });
        builder.addCase(putFreightRule.fulfilled, (state, action) => {
            state.freightLoading = false;
        });
        builder.addCase(putFreightRule.rejected, (state) => {
            state.freightLoading = false;
        });
        // DELETE
        builder.addCase(deleteFreightRule.pending, (state) => {
            state.freightLoading = true;
        });
        builder.addCase(deleteFreightRule.fulfilled, (state, action) => {
            state.freightLoading = false;
        });
        builder.addCase(deleteFreightRule.rejected, (state) => {
            state.freightLoading = false;
        });
    }
})

const freightReducers = freightSlice.reducer;
export default freightReducers;