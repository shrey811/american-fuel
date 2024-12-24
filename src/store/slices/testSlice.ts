import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { rootConstants } from 'globalConstants/rootConstants';
import { TestStateType } from 'types/TestType';
import { apiHandler } from 'modules/apiHandler';

const { getRequest } = apiHandler;
const sliceName = 'tests';

export const testList = createAsyncThunk(`${sliceName}/testList`, async () => {
  const response = await getRequest(`${rootConstants.TEST_URL}`);
  return response;
});

const initialState: TestStateType = {
  testDataLoading: false,
  testListData: [],
};

const testSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(testList.pending, (state) => {
      state.testDataLoading = true;
    });
    builder.addCase(testList.fulfilled, (state, action) => {
      state.testListData = action.payload?.entries;
      state.testDataLoading = false;
    });
    builder.addCase(testList.rejected, (state) => {
      state.testDataLoading = false;
      state.testListData = [];
    });
  },
});

const testReducers = testSlice.reducer;
export default testReducers;
