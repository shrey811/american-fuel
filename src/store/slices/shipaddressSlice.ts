import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { rootConstants } from 'globalConstants/rootConstants';
import { apiHandler } from 'modules/apiHandler';
import { BillAddressStateType } from 'types/BillAddress';
import { CustomerStateType } from 'types/CustomerType';
import { ShipAddressStateType } from 'types/ShipAddress';

const { getRequest } = apiHandler;
const { postRequest } = apiHandler;
const { putRequest } = apiHandler;
const { deleteRequest } = apiHandler;
const sliceName = 'ship_address';


export const listShipAddress = createAsyncThunk(`${sliceName}/ship_address`, async (initialShipData: any) => {
    const response = await postRequest(`${rootConstants.SHIP_ADDRESS_URL}`, initialShipData);
    return response;
});

export const getShipAddressCustomer = createAsyncThunk(`${sliceName}/ship_address_customer`, async (shipAddress: any) => {
    const { customer_ship_address_id, ...shipAddressData } = shipAddress;
    const response = await getRequest(`${rootConstants.SHIP_ADDRESS_URL}/${customer_ship_address_id}`);
    return response;
});


export const updateShipAddress = createAsyncThunk(`${sliceName}/ship_addressPut`, async (shipAddress: any) => {
    const { ship_address_id, ...shipAddressData } = shipAddress;
    const response = await putRequest(`${rootConstants.SHIP_ADDRESS_URL}/${ship_address_id}`, shipAddressData);
    return response;
});

export const deleteShipAddress = createAsyncThunk(`${sliceName}/ship_addressDelete`, async (shipAddress: any) => {
    const { ship_address_id, ...shipAddressData } = shipAddress;
    const response = await deleteRequest(`${rootConstants.SHIP_ADDRESS_URL}/${ship_address_id}`, shipAddressData);
    return response;
});

const initialState: ShipAddressStateType = {
    listShipAddressLoading: false,
    deleteShipAddressLoading: false,
    updateShipAddressLoading: false,
    listShipAddressCustomersLoading: false,
    shipAddressList: [],
};

const shipAddressSlice = createSlice({
    name: sliceName,
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getShipAddressCustomer.pending, (state) => {
            state.listShipAddressCustomersLoading = true;
        });
        builder.addCase(getShipAddressCustomer.fulfilled, (state, action) => {
            state.shipAddressList = action.payload.message.data || [];
            state.listShipAddressCustomersLoading = false;

        });
        builder.addCase(getShipAddressCustomer.rejected, (state) => {
            state.listShipAddressCustomersLoading = false;
            state.shipAddressList = [];
        });
        builder.addCase(listShipAddress.pending, (state) => {
            state.listShipAddressLoading = true;
        });
        builder.addCase(listShipAddress.fulfilled, (state, action) => {
            // state.shipAddressList = action.payload?.data; // Update state property name
            state.listShipAddressLoading = false;
        });
        builder.addCase(listShipAddress.rejected, (state) => {
            state.listShipAddressLoading = false;
            // state.shipAddressList = [];
        });
        // Handle the delete operation separately because it
        builder.addCase(updateShipAddress.pending, (state) => {
            state.updateShipAddressLoading = true;
        });
        builder.addCase(updateShipAddress.fulfilled, (state, action) => {
            // state.shipAddressListData = action.payload?.data; // Update state property name
            state.updateShipAddressLoading = false;
        });
        builder.addCase(updateShipAddress.rejected, (state) => {
            state.updateShipAddressLoading = false;
            // state.shipAddressListData = [];
        });
        builder.addCase(deleteShipAddress.pending, (state) => {
            state.deleteShipAddressLoading = true;
        })
        builder.addCase(deleteShipAddress.fulfilled, (state, action) => {
            state.deleteShipAddressLoading = false;
        })
        builder.addCase(deleteShipAddress.rejected, (state) => {
            state.deleteShipAddressLoading = false;
        })

    }
});

const shipAddressReducers = shipAddressSlice.reducer;
export default shipAddressReducers;
