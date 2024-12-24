import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { rootConstants } from 'globalConstants/rootConstants';
import { apiHandler } from 'modules/apiHandler';
import { BillToAddressType } from 'types/BillToAddressesType';

const { getRequest } = apiHandler;
const sliceName = 'Addresses';


export const getBillToAddresses = createAsyncThunk(`${sliceName}/addresses`, async (addresses: any) => {
    const { address_id } = addresses;
    const response = await getRequest(`${rootConstants.ADDRESS_URL}/Bill/${address_id}`);
    return response;
});

const initialState: BillToAddressType = {
    billToAddressDataLoading: false,
    billToAddressLoading: false,
    billToAddressListData: [],
};

const addressSlice = createSlice({
    name: sliceName,
    initialState,
    reducers: {},
    extraReducers: (builder) => {

        builder.addCase(getBillToAddresses.pending, (state) => {
            state.billToAddressLoading = true;
        });
        builder.addCase(getBillToAddresses.fulfilled, (state, action) => {
            state.billToAddressListData = action.payload?.message.data || [];
            state.billToAddressLoading = false;
        });
        builder.addCase(getBillToAddresses.rejected, (state) => {
            state.billToAddressLoading = false;
            state.billToAddressListData = [];
        });
    }
});

const addressReducers = addressSlice.reducer;
export default addressReducers;
