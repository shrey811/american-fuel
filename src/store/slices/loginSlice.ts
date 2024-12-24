import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';


import { rootConstants } from 'globalConstants/rootConstants';

import { apiHandler } from 'modules/apiHandler';
import { toast } from 'react-toastify';
import { LoginStateType } from 'types/LoginType';

const { getRequest, postRequest } = apiHandler;

const sliceName = 'logins';


export const login = createAsyncThunk(`${sliceName}/login`, async (formData: FormData) => {
  const response = await postRequest(`${rootConstants.LOGIN_URL}`, formData, false, false);
  console.log(formData);

  console.log(response);
  if (response.code === 'UNAUTHORIZED') {
  toast.error(response.message.detail);
  }else{
    toast.success(response.message.message);
  }
  return response
});



const initialState: LoginStateType = {
  loginDataLoading: false,
  loginListData: [],
};

const loginSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {},
  extraReducers: (builder) => {

    builder.addCase(login.pending, (state) => {
      state.loginDataLoading = true; // Update state property name
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loginListData = action.payload?.message.data; // Update state property name
      state.loginDataLoading = false; // Update state property name
    });
    builder.addCase(login.rejected, (state) => {
      state.loginDataLoading = false; // Update state property name
      state.loginListData = []; // Update state property name
    });
  },
});

const loginReducers = loginSlice.reducer;
export default loginReducers;
