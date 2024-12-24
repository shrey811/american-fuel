import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { rootConstants } from 'globalConstants/rootConstants';
import { apiHandler } from 'modules/apiHandler';
import { ShipToAddressType } from 'types/shipToAddressesType';

const { getRequest } = apiHandler;
const sliceName = 'Ship To Addresses';


export const getShipToAddresses = createAsyncThunk(`${sliceName}/addresses`, async (shipAddresses: any) => {
    const { address_id } = shipAddresses;
    const response = await getRequest(`${rootConstants.ADDRESS_URL}/Ship/${address_id}`);
    return response;
});

const initialState: ShipToAddressType = {
    shipToAddressDataLoading: false,
    shipToAddressLoading: false,
    shipToAddressListData: [],
};

const shipToAddressSlice = createSlice({
    name: sliceName,
    initialState,
    reducers: {},
    extraReducers: (builder) => {

        builder.addCase(getShipToAddresses.pending, (state) => {
            state.shipToAddressLoading = true;
        });
        builder.addCase(getShipToAddresses.fulfilled, (state, action) => {
            state.shipToAddressListData = action.payload?.message.data || [];
            state.shipToAddressLoading = false;
        });
        builder.addCase(getShipToAddresses.rejected, (state) => {
            state.shipToAddressLoading = false;
            state.shipToAddressListData = [];
        });
    }
});

const shipToAddressReducers = shipToAddressSlice.reducer;
export default shipToAddressReducers;
