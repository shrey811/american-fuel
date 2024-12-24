import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';



import { rootConstants } from 'globalConstants/rootConstants';

import { apiHandler } from 'modules/apiHandler';
import { SignupStateType } from 'types/SignupTypes';

const { getRequest, postRequest } = apiHandler;

const sliceName = 'signup';


export const signup = createAsyncThunk(`${sliceName}/signup`, async (params: any) => {
    const response = await postRequest(`${rootConstants.SIGNUP_URL}`, params);
    // console.log(formData)

    console.log(response);
    return response
});



const initialState: SignupStateType = {
    signupDataLoading: false,
    signupListData: [],
};

const signupSlice = createSlice({
    name: sliceName,
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(signup.pending, (state) => {
            state.signupDataLoading = true; // Update state property name
        });
        builder.addCase(signup.fulfilled, (state, action) => {
            state.signupListData = action.payload?.message.data?.data || []; // Update state property name
            state.signupDataLoading = false; // Update state property name
        });
        builder.addCase(signup.rejected, (state) => {
            state.signupDataLoading = false; // Update state property name
            state.signupListData = []; // Update state property name
        });
    },
});

const signupReducers = signupSlice.reducer;
export default signupReducers;
