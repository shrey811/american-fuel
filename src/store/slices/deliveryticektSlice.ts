import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { rootConstants } from 'globalConstants/rootConstants';
import { apiHandler } from 'modules/apiHandler';
import { CityStateType } from 'types/CityType';
import { DeliveryStateType } from 'types/DeliveryTicketType';

const { getRequest } = apiHandler;

const sliceName = 'deliveryticeket';

export const listDliveryTiceket = createAsyncThunk(`${sliceName}/deliveryticeket`, async (salesOrderId: any) => {
    const response = await getRequest(`${rootConstants.DELIVERY_TICKET_URL}/${salesOrderId}`);
    return response;
});

const initialState: DeliveryStateType = {
    listDelivertTicketloading: false,
    delivertTicketList: [],
};

const deliveryTicketSlice = createSlice({
    name: sliceName,
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(listDliveryTiceket.pending, (state) => {
            state.listDelivertTicketloading = true;
        });
        builder.addCase(listDliveryTiceket.fulfilled, (state, action) => {
            state.delivertTicketList = action.payload?.message.data || [];
            state.listDelivertTicketloading = false;
        });
        builder.addCase(listDliveryTiceket.rejected, (state) => {
            state.listDelivertTicketloading = false;
            state.delivertTicketList = [];
        });
    },
});

const deliveryTicketReducers = deliveryTicketSlice.reducer;
export default deliveryTicketReducers;
