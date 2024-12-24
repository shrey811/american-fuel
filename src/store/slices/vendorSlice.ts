import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { rootConstants } from 'globalConstants/rootConstants';
import { apiHandler } from 'modules/apiHandler';
import { VendorStateType } from 'types/Vendor';

const { getRequest } = apiHandler;
const { postRequest } = apiHandler;
const { putRequest } = apiHandler;
const { deleteRequest } = apiHandler;

const sliceName = 'vendors';

export const listVendor = createAsyncThunk(`${sliceName}/vendorList`, async () => {
  const response = await getRequest(`${rootConstants.VENDOR_URL}`);
  return response;
});

export const vendorAdd = createAsyncThunk(`${sliceName}/vendorAdd`, async (initialData: any) => {
  const response = await postRequest(`${rootConstants.VENDOR_URL}`, initialData);
  return response;
});

export const vendorPut = createAsyncThunk(`${sliceName}/vendorPut`, async (initialData: any) => {
  const { vendor_id, ...vendorData } = initialData;
  const response = await putRequest(`${rootConstants.VENDOR_URL}/${vendor_id}`, vendorData);
  return response;
});

export const vendorDelete = createAsyncThunk(`${sliceName}/vendorDelete`, async (initialData: any) => {
  const { vendor_id, ...vendorData } = initialData;
  const response = await deleteRequest(`${rootConstants.VENDOR_URL}/${vendor_id}`, vendorData);
  return response;
});

export const vendorListUpdate = createAsyncThunk(`${sliceName}/vendor/get_intuit_db_temp`, async () => {
  const response = await getRequest(`${rootConstants.VENDOR_INTUIT_URL}`);
  return response;
});

const initialState: VendorStateType = {
  listVendorLoading: false,
  addVendorLoading: false,
  updateVendorLoading: false,
  deleteVendorLoading: false,
  listVendorIntuitLoading: false,
  vendorList: [],
};

const vendorSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(listVendor.pending, (state) => {
      state.listVendorLoading = true;
    });
    builder.addCase(listVendor.fulfilled, (state, action) => {
      state.vendorList = action.payload?.message.data || [];
      state.listVendorLoading = false;
    });
    builder.addCase(listVendor.rejected, (state) => {
      state.listVendorLoading = false;
      state.vendorList = [];
    });


    // VENDOR POST
    builder.addCase(vendorAdd.pending, (state) => {
      state.addVendorLoading = true;
    });
    builder.addCase(vendorAdd.fulfilled, (state, action) => {
      // state.vendorListData = action.payload?.message.data || [];
      state.addVendorLoading = false;
    });
    builder.addCase(vendorAdd.rejected, (state) => {
      state.addVendorLoading = false;
      // state.vendorListData = [];
    });
    // VENDOR PUT
    builder.addCase(vendorPut.pending, (state) => {
      state.updateVendorLoading = true;
    });
    builder.addCase(vendorPut.fulfilled, (state, action) => {
      // state.vendorListData = action.payload?.message.data || [];
      state.updateVendorLoading = false;
    });
    builder.addCase(vendorPut.rejected, (state) => {
      state.updateVendorLoading = false;
      // state.vendorListData = [];
    });

    // VENDOR DELETE
    builder.addCase(vendorDelete.pending, (state) => {
      state.deleteVendorLoading = true;
    });
    builder.addCase(vendorDelete.fulfilled, (state, action) => {
      // state.vendorListData = action.payload?.message.data || [];
      state.deleteVendorLoading = false;
    });
    builder.addCase(vendorDelete.rejected, (state) => {
      state.deleteVendorLoading = false;
      // state.vendorListData = [];
    });

    // VENDOR UPDATE
    builder.addCase(vendorListUpdate.pending, (state) => {
      state.listVendorIntuitLoading = true;
    });
    builder.addCase(vendorListUpdate.fulfilled, (state, action) => {
      // state.vendorListData = action.payload?.message.data || [];
      state.listVendorIntuitLoading = false;
    });
    builder.addCase(vendorListUpdate.rejected, (state) => {
      state.listVendorIntuitLoading = false;
      // state.vendorListData = [];
    });
  },
});

const vendorReducers = vendorSlice.reducer;
export default vendorReducers;
