// testSlice.js

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiHandler } from 'modules/apiHandler';
import { rootConstants } from 'globalConstants/rootConstants'; // Import rootConstants if used
import { UserStateType } from 'types/UserType';

const { getRequest } = apiHandler;

const sliceName = 'user';

export const userList = createAsyncThunk(`${sliceName}/userList`, async () => {
    const response = await getRequest(`${rootConstants.USER_URL}`); // Adjust URL as per your API
    return response;
});

const initialState: UserStateType = {
    userListLoading: false, // Rename to userListLoading
    userListData: [],
};

const userSlice = createSlice({
    name: sliceName,
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(userList.pending, (state) => {
            state.userListLoading = true; // Update state property name
        });
        builder.addCase(userList.fulfilled, (state, action) => {
            state.userListData = action.payload?.data?.data || []; // Update state property name
            state.userListLoading = false; // Update state property name
        });
        builder.addCase(userList.rejected, (state) => {
            state.userListLoading = false; // Update state property name
            state.userListData = []; // Update state property name
        });
    },
});

const userReducers = userSlice.reducer;
export default userReducers;

