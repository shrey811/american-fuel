import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { rootConstants } from 'globalConstants/rootConstants';
import { apiHandler } from 'modules/apiHandler';
import { AccountStateType } from 'types/AccountType';
import { StateStateType } from 'types/StateType';

const { getRequest } = apiHandler;
const { postRequest } = apiHandler;
const { putRequest } = apiHandler;
const { deleteRequest } = apiHandler;

const sliceName = 'accounts';

export const listIntuitAccount = createAsyncThunk(`${sliceName}/accountsInutit`, async () => {
    const response = await getRequest(`${rootConstants.ACCOUNTS_URL}/intuit`);
    return response;
});

export const listAccount = createAsyncThunk(`${sliceName}/accountsList`, async () => {
    const response = await getRequest(`${rootConstants.ACCOUNTS_URL}/all`);
    return response;
});


const initialState: AccountStateType = {
    listInutitLoading: false,
    listAccountLoading: false,
    accountListData: [],
};

const accountSlice = createSlice({
    name: sliceName,
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(listAccount.pending, (state) => {
            state.listAccountLoading = true;
        });
        builder.addCase(listAccount.fulfilled, (state, action) => {
            state.accountListData = action.payload?.message.data || [];
            state.listAccountLoading = false;
        });
        builder.addCase(listAccount.rejected, (state) => {
            state.listAccountLoading = false;
            state.accountListData = [];
        });
        builder.addCase(listIntuitAccount.pending, (state) => {
            state.listInutitLoading = true;
        });
        builder.addCase(listIntuitAccount.fulfilled, (state) => {
            state.listInutitLoading = false;
        });
        builder.addCase(listIntuitAccount.rejected, (state) => {
            state.listInutitLoading = false;
        });
    },
});

const accountReducers = accountSlice.reducer;
export default accountReducers;
