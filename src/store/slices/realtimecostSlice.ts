import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { rootConstants } from 'globalConstants/rootConstants';
import { apiHandler } from 'modules/apiHandler';
import { RealTimeCostStateType } from 'types/RealTimecostType';

const { getRequest } = apiHandler;
const { postRequest } = apiHandler;
const { putRequest } = apiHandler;
const { deleteRequest } = apiHandler;

const sliceName = 'realtimecosts';

export const listRealTimeCost = createAsyncThunk(`${sliceName}/listRealTimeCost`, async () => {
  const response = await getRequest(`${rootConstants.PRODUCT_URL}/product-realtime-cost/all`);
  return response;
});

export const addRealTimeCost = createAsyncThunk(`${sliceName}/addRealTimeCost`, async (initialData: any) => {
  const response = await postRequest(`${rootConstants.PRODUCT_URL}/product-realtime-cost`, initialData);
  return response;
});

export const updateRealTimeCost = createAsyncThunk(`${sliceName}/updateRealTimeCost`, async (initialData: any) => {
  const { product_realtime_cost_id, ...realtimeData } = initialData;
  const response = await putRequest(`${rootConstants.PRODUCT_URL}/product-realtime-cost/${product_realtime_cost_id}`, realtimeData);
  return response;
});

export const filterRealTimeCost = createAsyncThunk(`${sliceName}/filterRealTimeCost`, async (initialData: any) => {
  const response = await postRequest(`${rootConstants.PRODUCT_URL}/product-realtime-cost/filter`, initialData);
  return response;
})

export const deleteRealTimeCost = createAsyncThunk(`${sliceName}/deleteRealTimeCost`, async (initialData: any) => {
  const { product_realtime_cost_id, ...realtimeData } = initialData;
  const response = await deleteRequest(`${rootConstants.PRODUCT_URL}/product-realtime-cost/${product_realtime_cost_id}`, realtimeData);
  return response;
});

export const uploadRealTimeCost = createAsyncThunk(`${sliceName}/uploadRealTimeCost`, async (initialData: any) => {
  const response = await postRequest(`${rootConstants.PRODUCT_URL}/product-realtime-cost/upload-data`, initialData);
  return response;
})

const initialState: RealTimeCostStateType = {
  listRealTimeLoading: false,
  filterRealTimeLoading: false,
  addRealTimeLoading: false,
  uploadRealTimeLoading: false,
  realtimeList: [],
};

const realtimeSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(listRealTimeCost.pending, (state) => {
      state.listRealTimeLoading = true;
    });
    builder.addCase(listRealTimeCost.fulfilled, (state, action) => {
      state.realtimeList = action.payload?.message.data || [];
      state.listRealTimeLoading = false;
    });
    builder.addCase(listRealTimeCost.rejected, (state) => {
      state.listRealTimeLoading = false;
      state.realtimeList = [];
    });
    // REAL TIME COST POST
    builder.addCase(addRealTimeCost.pending, (state) => {
      state.addRealTimeLoading = true;
    });
    builder.addCase(addRealTimeCost.fulfilled, (state, action) => {
      state.addRealTimeLoading = false;
    });
    builder.addCase(addRealTimeCost.rejected, (state) => {
      state.addRealTimeLoading = false;
    });
    // REAL TIME COST UPDATE
    builder.addCase(updateRealTimeCost.pending, (state) => {
      state.addRealTimeLoading = true;
    });
    builder.addCase(updateRealTimeCost.fulfilled, (state, action) => {
      state.addRealTimeLoading = false;
    });
    builder.addCase(updateRealTimeCost.rejected, (state) => {
      state.addRealTimeLoading = false;
    });
    // REAL TIME COST DELETE
    builder.addCase(deleteRealTimeCost.pending, (state) => {
      state.listRealTimeLoading = true;
    });
    builder.addCase(deleteRealTimeCost.fulfilled, (state, action) => {
      state.listRealTimeLoading = false;
    });
    builder.addCase(deleteRealTimeCost.rejected, (state) => {
      state.listRealTimeLoading = false;
    });

    // REAL TIME COST FILTER
    builder.addCase(filterRealTimeCost.pending, (state) => {
      state.filterRealTimeLoading = true;
    });
    builder.addCase(filterRealTimeCost.fulfilled, (state, action) => {
      state.realtimeList = action.payload?.message.data || [];
    });
    builder.addCase(filterRealTimeCost.rejected, (state) => {
      state.filterRealTimeLoading = false;
    });

    // REAL TIME COST POST
    builder.addCase(uploadRealTimeCost.pending, (state) => {
      state.uploadRealTimeLoading = true;
    });
    builder.addCase(uploadRealTimeCost.fulfilled, (state, action) => {
      state.uploadRealTimeLoading = false;
    });
    builder.addCase(uploadRealTimeCost.rejected, (state) => {
      state.uploadRealTimeLoading = false;
    });
  },
});

const realtimeReducers = realtimeSlice.reducer;
export default realtimeReducers;
