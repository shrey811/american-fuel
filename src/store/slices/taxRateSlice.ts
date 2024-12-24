import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { rootConstants } from 'globalConstants/rootConstants';
import { apiHandler } from 'modules/apiHandler';
import { TaxRateStateType } from 'types/TaxRateType';

const { getRequest } = apiHandler;
const { postRequest } = apiHandler;
const { putRequest } = apiHandler;
const { deleteRequest } = apiHandler;

const sliceName = 'taxrate';

export const listTaxRate = createAsyncThunk(`${sliceName}/taxRateList`, async (initialData: any) => {
    const response = await getRequest(`${rootConstants.TAX_RATE_URL}/${initialData}`);
    return response;
});

export const addTaxRate = createAsyncThunk(`${sliceName}/taxRateAdd`, async (initialData: any) => {
    const response = await postRequest(`${rootConstants.TAX_RATE_URL}`, initialData);
    return response;
});

export const updateTaxRate = createAsyncThunk(`${sliceName}/taxRatePut`, async (initialData: any) => {
    const { tax_id, ...data } = initialData;
    const response = await putRequest(`${rootConstants.TAX_RATE_URL}/${tax_id}`, data);
    return response;
});


export const deleteTaxRate = createAsyncThunk(`${sliceName}/taxRateDelete`, async (initialData: any) => {
    const { tax_id, ...data } = initialData;
    const response = await deleteRequest(`${rootConstants.TAX_RATE_URL}/${tax_id}`, data);
    return response;
});

const initialState: TaxRateStateType = {
    addTaxRateLoading: false,
    listTaxRateLoading: false,
    deleteTaxRateLoading: false,
    updateTaxRateLoading: false,
    taxRateList: [],
};

const taxRateSlice = createSlice({
    name: sliceName,
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(listTaxRate.pending, (state) => {
            state.listTaxRateLoading = true;
        });
        builder.addCase(listTaxRate.fulfilled, (state, action) => {
            state.taxRateList = action.payload?.message.data || [];
            state.listTaxRateLoading = false;
        });
        builder.addCase(listTaxRate.rejected, (state) => {
            state.listTaxRateLoading = false;
            state.taxRateList = [];
        });

        builder.addCase(addTaxRate.pending, (state) => {
            state.addTaxRateLoading = true;
        });
        builder.addCase(addTaxRate.fulfilled, (state) => {
            state.addTaxRateLoading = false;
        });
        builder.addCase(addTaxRate.rejected, (state) => {
            state.addTaxRateLoading = false;
        });

        builder.addCase(updateTaxRate.pending, (state) => {
            state.updateTaxRateLoading = true;
        });
        builder.addCase(updateTaxRate.fulfilled, (state) => {
            state.updateTaxRateLoading = false;
        });
        builder.addCase(updateTaxRate.rejected, (state) => {
            state.updateTaxRateLoading = false;
        });

        builder.addCase(deleteTaxRate.pending, (state) => {
            state.deleteTaxRateLoading = true;
        });
        builder.addCase(deleteTaxRate.fulfilled, (state) => {
            state.deleteTaxRateLoading = false;
        });
        builder.addCase(deleteTaxRate.rejected, (state) => {
            state.deleteTaxRateLoading = false;
        });


    },
});

const taxRateReducers = taxRateSlice.reducer;
export default taxRateReducers;
