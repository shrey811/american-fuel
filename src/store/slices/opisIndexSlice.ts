import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { rootConstants } from 'globalConstants/rootConstants';
import { apiHandler } from 'modules/apiHandler';
import { OpisIndexType } from 'types/OpisIndexType';

const { getRequest, postRequest, putRequest, deleteRequest } = apiHandler;

const sliceName = 'OPISIndex';

export const listOpisIndex = createAsyncThunk(`${sliceName}/listOpisIndex`, async () => {
  const response = await getRequest(`${rootConstants.OPISINDEX_URL}/all`);
  return response;
});

export const addOpisIndex = createAsyncThunk(`${sliceName}/addOpisIndex`, async (initialData: any) => {
  const response = await postRequest(`${rootConstants.OPISINDEX_URL}`, initialData);
  return response;
});

export const putOpisIndex = createAsyncThunk(`${sliceName}/putOpisIndex`, async (initialData: any) => {
  const { opis_id, ...data } = initialData;
  const response = await putRequest(`${rootConstants.OPISINDEX_URL}/${opis_id}`, data);
  return response;
});

export const deleteOpisIndex = createAsyncThunk(`${sliceName}/deleteOpisIndex`, async (initialData: any) => {
  const { ois_id, ...data } = initialData;
  const response = await deleteRequest(`${rootConstants.OPISINDEX_URL}/${ois_id}`, data);
  return response;
});

const initialState: OpisIndexType = {
  opisDataLoading: false,
  opisLoading: false,
  opisListData: [],
};

const opisIndexSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(listOpisIndex.pending, (state) => {
      state.opisDataLoading = true;
    });
    builder.addCase(listOpisIndex.fulfilled, (state, action) => {
      state.opisListData = action.payload?.message.data || [];
      state.opisDataLoading = false;
    });
    builder.addCase(listOpisIndex.rejected, (state) => {
      state.opisDataLoading = false;
      state.opisListData = [];
    });
    // ADD
    builder.addCase(addOpisIndex.pending, (state) => {
      state.opisLoading = true;
    });
    builder.addCase(addOpisIndex.fulfilled, (state, action) => {
      state.opisLoading = false;
    });
    builder.addCase(addOpisIndex.rejected, (state) => {
      state.opisLoading = false;
    });
    // PUT
    builder.addCase(putOpisIndex.pending, (state) => {
      state.opisLoading = true;
    });
    builder.addCase(putOpisIndex.fulfilled, (state, action) => {
      state.opisLoading = false;
    });
    builder.addCase(putOpisIndex.rejected, (state) => {
      state.opisLoading = false;
    });
    // DELETE
    builder.addCase(deleteOpisIndex.pending, (state) => {
      state.opisLoading = true;
    });
    builder.addCase(deleteOpisIndex.fulfilled, (state, action) => {
      state.opisLoading = false;
    });
    builder.addCase(deleteOpisIndex.rejected, (state) => {
      state.opisLoading = false;
    });
  }
})

const opisIndexReducers = opisIndexSlice.reducer;
export default opisIndexReducers;