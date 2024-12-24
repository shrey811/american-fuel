import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { rootConstants } from 'globalConstants/rootConstants';
import { apiHandler } from 'modules/apiHandler';
import { BillAddressStateType } from 'types/BillAddress';
import { BillAddressVendorStateType } from 'types/BillAddressVendor';
import { CustomerStateType } from 'types/CustomerType';
import { TerminalStateType } from 'types/Terminal';

const { getRequest } = apiHandler;
const { postRequest } = apiHandler;
const { putRequest } = apiHandler;
const { deleteRequest } = apiHandler;

const sliceName = 'terminal';

export const listAllTerminal = createAsyncThunk(`${sliceName}/listTerminal`, async () => {
    const response = await getRequest(`${rootConstants.TERMINAL_VENDOR_URL}/all`);
    return response;
});

export const addTerminal = createAsyncThunk(`${sliceName}/terminal`, async (terminal: any) => {
    const response = await postRequest(`${rootConstants.TERMINAL_VENDOR_URL}`, terminal);
    return response;
});

export const updateTerminal = createAsyncThunk(`${sliceName}/updateTerminal`, async (terminal: any) => {
    const { terminals_id, ...terminalData } = terminal;
    const response = await putRequest(`${rootConstants.TERMINAL_VENDOR_URL}/${terminals_id}`, terminalData);
    return response;
});

export const deleteTerminal = createAsyncThunk(`${sliceName}/deleteTerminal`, async (terminal: any) => {
    const { terminals_id, ...terminalData } = terminal;
    const response = await deleteRequest(`${rootConstants.TERMINAL_VENDOR_URL}/${terminals_id}`, terminalData);
    return response;
});

export const listTerminal = createAsyncThunk(`${sliceName}/listTerminal`, async (value: any) => {
    // const { vendor_id } = value;
    const response = await getRequest(`${rootConstants.TERMINAL_VENDOR_URL}/${value}`);
    return response;
});

const initialState: TerminalStateType = {
    listTerminalLoading: false,
    terminalDataLoading: false,
    listAllTerminalLoading: false,
    terminalListData: [],
};

const terminalSlice = createSlice({
    name: sliceName,
    initialState,
    reducers: {},
    extraReducers: (builder) => {

        builder.addCase(listAllTerminal.pending, (state) => {
            state.listAllTerminalLoading = true;
        });
        builder.addCase(listAllTerminal.fulfilled, (state, action) => {
            state.terminalListData = action.payload?.message.data || [];
            state.listAllTerminalLoading = false;
        });
        builder.addCase(listAllTerminal.rejected, (state) => {
            state.listAllTerminalLoading = false;
            state.terminalListData = [];
        });

        builder.addCase(addTerminal.pending, (state) => {
            state.terminalDataLoading = true;
        });
        builder.addCase(addTerminal.fulfilled, (state, action) => {
            // state.terminalListData = action.payload?.data; // Update state property name
            state.terminalDataLoading = false;
        });
        builder.addCase(addTerminal.rejected, (state) => {
            state.terminalDataLoading = false;
            // state.terminalListData = [];
        });

        builder.addCase(updateTerminal.pending, (state) => {
            state.terminalDataLoading = true;
        });
        builder.addCase(updateTerminal.fulfilled, (state, action) => {
            state.terminalListData = action.payload?.data || []; // Update state property name

            // state.terminalListData = action.payload?.data; // Update state property name

            state.terminalDataLoading = false;
        });
        builder.addCase(updateTerminal.rejected, (state) => {
            state.terminalDataLoading = false;
            // state.terminalListData = [];
        });


        builder.addCase(deleteTerminal.pending, (state) => {
            state.terminalDataLoading = true;
        });
        builder.addCase(deleteTerminal.fulfilled, (state, action) => {
            state.terminalListData = action.payload?.data || []; // Update state property name
            state.terminalDataLoading = false;
        });
        builder.addCase(deleteTerminal.rejected, (state) => {
            state.terminalDataLoading = false;
        });


        // builder.addCase(listTerminal.pending, (state) => {
        //     state.listTerminalLoading = true;
        // });
        // builder.addCase(listTerminal.fulfilled, (state, action) => {
        //     state.terminalListData = action.payload?.message.data || []; // Update state property name
        //     state.listTerminalLoading = false;
        // });
        // builder.addCase(listTerminal.rejected, (state) => {
        //     state.listTerminalLoading = false;
        //     state.terminalListData = [];
        // });
    }
});

const terminalReducers = terminalSlice.reducer;
export default terminalReducers;
