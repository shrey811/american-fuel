import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { rootConstants } from 'globalConstants/rootConstants';
import { apiHandler } from 'modules/apiHandler';
import { StateStateType } from 'types/StateType';

const { getRequest } = apiHandler;
const { postRequest } = apiHandler;
const { putRequest } = apiHandler;
const { deleteRequest } = apiHandler;

const sliceName = 'state';

export const stateList = createAsyncThunk(`${sliceName}/stateList`, async () => {
    const response = await getRequest(`${rootConstants.STATE_URL}`);
    return response;
});

export const stateAdd = createAsyncThunk(`${sliceName}/stateAdd`, async (initialData: any) => {
    const response = await postRequest(`${rootConstants.STATE_URL}`, initialData);
    return response;
});

export const statePut = createAsyncThunk(`${sliceName}/statePut`, async (initialData: any) => {
    const { state_id, ...data } = initialData;
    const response = await putRequest(`${rootConstants.STATE_URL}/${state_id}`, data);
    return response;
});

export const stateDelete = createAsyncThunk(`${sliceName}/stateDelete`, async (initialData: any) => {
    const { state_id, ...data } = initialData;
    const response = await deleteRequest(`${rootConstants.STATE_URL}/${state_id}`, data);
    return response;
});

const initialState: StateStateType = {
    stateDataLoading: false,
    stateLoading: false,
    stateListData: [],
};

const stateSlice = createSlice({
    name: sliceName,
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(stateList.pending, (state) => {
            state.stateDataLoading = true;
        });
        builder.addCase(stateList.fulfilled, (state, action) => {
            state.stateListData = action.payload?.message.data || [];
            state.stateDataLoading = false;
        });
        builder.addCase(stateList.rejected, (state) => {
            state.stateDataLoading = false;
            state.stateListData = [];
        });

        builder.addCase(stateAdd.pending, (state) => {
            state.stateLoading = true;
        });
        builder.addCase(stateAdd.fulfilled, (state, action) => {
            state.stateListData = action.payload?.entries;
            state.stateLoading = false;
        });
        builder.addCase(stateAdd.rejected, (state) => {
            state.stateLoading = false;
            state.stateListData = [];
        });

        builder.addCase(statePut.pending, (state) => {
            state.stateLoading = true;
        });
        builder.addCase(statePut.fulfilled, (state, action) => {
            state.stateListData = action.payload?.entries;
            state.stateLoading = false;
        });
        builder.addCase(statePut.rejected, (state) => {
            state.stateLoading = false;
            state.stateListData = [];
        });

        builder.addCase(stateDelete.pending, (state) => {
            state.stateDataLoading = true;
        });
        builder.addCase(stateDelete.fulfilled, (state, action) => {
            state.stateListData = action.payload?.entries;
            state.stateDataLoading = false;
        });
        builder.addCase(stateDelete.rejected, (state) => {
            state.stateDataLoading = false;
            state.stateListData = [];
        });
    },
});

const stateReducers = stateSlice.reducer;
export default stateReducers;
