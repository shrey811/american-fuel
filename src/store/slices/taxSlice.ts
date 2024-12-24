import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { rootConstants } from 'globalConstants/rootConstants';
import { apiHandler } from 'modules/apiHandler';
import { TaxStateType } from 'types/TaxType';

const { getRequest } = apiHandler;
const { postRequest } = apiHandler;
const { putRequest } = apiHandler;
const { deleteRequest } = apiHandler;

const sliceName = 'tax';

export const listTax = createAsyncThunk(`${sliceName}/taxList`, async () => {
    const response = await getRequest(`${rootConstants.TAX_URL}/all`);
    return response;
});

export const addTax = createAsyncThunk(`${sliceName}/taxAdd`, async (initialData: any) => {
    const response = await postRequest(`${rootConstants.TAX_URL}`, initialData);
    return response;
});

export const updateTax = createAsyncThunk(`${sliceName}/taxPut`, async (initialData: any) => {
    const { tax_id, ...data } = initialData;
    const response = await putRequest(`${rootConstants.TAX_URL}/${tax_id}`, data);
    return response;
});

export const getFilterTax = createAsyncThunk(`${sliceName}/getFilterTax`, async (initialData: any) => {
    const response = await postRequest(`${rootConstants.TAX_URL}/filter`, initialData);
    return response;
});

export const deleteTax = createAsyncThunk(`${sliceName}/taxDelete`, async (initialData: any) => {
    const { tax_id, ...data } = initialData;
    const response = await deleteRequest(`${rootConstants.TAX_URL}/${tax_id}`, data);
    return response;
});

const initialState: TaxStateType = {
    addTaxLoading: false,
    listTaxLoading: false,
    deleteTaxLoading: false,
    getPuchaseorderTaxLoading: false,
    taxList: [],
};

const taxSlice = createSlice({
    name: sliceName,
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(listTax.pending, (state) => {
            state.listTaxLoading = true;
        });
        builder.addCase(listTax.fulfilled, (state, action) => {
            if (action.payload && action.payload.message && action.payload.message.data) {
                state.taxList = action.payload.message.data;
            } else {
                state.taxList = [];
            }
            state.listTaxLoading = false;
        });
        builder.addCase(listTax.rejected, (state) => {
            state.listTaxLoading = false;
            state.taxList = [];
        });

        builder.addCase(addTax.pending, (state) => {
            state.addTaxLoading = true;
        });
        builder.addCase(addTax.fulfilled, (state) => {
            state.addTaxLoading = false;
        });
        builder.addCase(addTax.rejected, (state) => {
            state.addTaxLoading = false;
        });

        builder.addCase(updateTax.pending, (state) => {
            state.addTaxLoading = true;
        });
        builder.addCase(updateTax.fulfilled, (state) => {
            state.addTaxLoading = false;
        });
        builder.addCase(updateTax.rejected, (state) => {
            state.addTaxLoading = false;
        });

        builder.addCase(deleteTax.pending, (state) => {
            state.deleteTaxLoading = true;
        });
        builder.addCase(deleteTax.fulfilled, (state) => {
            state.deleteTaxLoading = false;
        });
        builder.addCase(deleteTax.rejected, (state) => {
            state.deleteTaxLoading = false;
        });

        builder.addCase(getFilterTax.pending, (state) => {
            state.getPuchaseorderTaxLoading = true;
        });
        builder.addCase(getFilterTax.fulfilled, (state) => {
            state.getPuchaseorderTaxLoading = false;
        });
        builder.addCase(getFilterTax.rejected, (state) => {
            state.getPuchaseorderTaxLoading = false;
        });
    },
});

const taxReducers = taxSlice.reducer;
export default taxReducers;