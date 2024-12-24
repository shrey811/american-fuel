import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { rootConstants } from 'globalConstants/rootConstants';
import { apiHandler } from 'modules/apiHandler';
import { SubTypeIndex } from 'types/subtypeIndex';

const { getRequest } = apiHandler;

const sliceName = 'subtype';

export const subTypeList = createAsyncThunk(`${sliceName}/subTypeList`, async () => {
  const response = await getRequest(`${rootConstants.STATIC_URL}/subtype_index/all`);
  return response;
});

const initialState: SubTypeIndex = {
  subTypeDataLoading: false,
  subTypeLoading: false,
  subTypeListData: [],
};

const subTypeSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(subTypeList.pending, (state) => {
      state.subTypeDataLoading = true;
    });
    builder.addCase(subTypeList.fulfilled, (state, action) => {
      state.subTypeListData = action.payload?.message.data || [];
      console.log({state, action})
      state.subTypeDataLoading = false;
    });
    builder.addCase(subTypeList.rejected, (state) => {
      state.subTypeDataLoading = false;
      state.subTypeListData = [];
    });
  },
});

const subTypeReducers = subTypeSlice.reducer;
export default subTypeReducers;
