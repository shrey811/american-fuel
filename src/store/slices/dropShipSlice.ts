import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { rootConstants } from 'globalConstants/rootConstants';
import { apiHandler } from 'modules/apiHandler';
import { CityStateType } from 'types/CityType';
import { DropShipStateType } from 'types/DropShipType';

const { getRequest } = apiHandler;
const { postRequest } = apiHandler;
const { putRequest } = apiHandler;
const { deleteRequest } = apiHandler;

const sliceName = 'DropShip';

export const listDropShip = createAsyncThunk(`${sliceName}/listDropShip`, async () => {
    const response = await getRequest(`${rootConstants.DROP_SHIPPING_URL}/all`);
    return response;
});

export const addDropShipGeneraate = createAsyncThunk(`${sliceName}/listDropShipGeneraate`, async (initialData: any) => {
    const response = await postRequest(`${rootConstants.DROP_SHIPPING_URL}/generate`, initialData);
    return response;
});


export const addDropShip = createAsyncThunk(`${sliceName}/addDropShip`, async (initialData: any) => {
    const response = await postRequest(`${rootConstants.DROP_SHIPPING_URL}`, initialData);
    return response;
});

export const updateDropShip = createAsyncThunk(`${sliceName}/updateDropShip`, async (initialData: any) => {
    const { dropship_Id, ...dropShipData } = initialData;

    const response = await putRequest(`${rootConstants.DROP_SHIPPING_URL}/${dropship_Id}`, dropShipData);
    return response;
});

export const deleteDropShip = createAsyncThunk(`${sliceName}/deleteDropShip`, async (initialData: any) => {
    const { dropShip_id, ...dropShipData } = initialData;
    const response = await deleteRequest(`${rootConstants.DROP_SHIPPING_URL}/${dropShip_id}`, dropShipData);
    return response;
});

const initialState: DropShipStateType = {
    listDropShipLoading: false,
    addDropShipLoading: false,
    updateDropShipLoading: false,
    deleteDropShipLoading: false,
    addDropShipGeneraateLoading: false,
    dropShipList: [],
};

const dropShipSlice = createSlice({
    name: sliceName,
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(listDropShip.pending, (state) => {
            state.listDropShipLoading = true;
        });
        builder.addCase(listDropShip.fulfilled, (state, action) => {
            state.dropShipList = action.payload?.message.data || [];
            state.listDropShipLoading = false;
        });
        builder.addCase(listDropShip.rejected, (state) => {
            state.listDropShipLoading = false;
            state.dropShipList = [];
        });
        // dropShipSlice POST
        builder.addCase(addDropShip.pending, (state) => {
            state.addDropShipLoading = true;
        });
        builder.addCase(addDropShip.fulfilled, (state, action) => {
            state.addDropShipLoading = false;
        });
        builder.addCase(addDropShip.rejected, (state) => {
            state.addDropShipLoading = false;
        });
        // dropShipSlice UPDATE
        builder.addCase(updateDropShip.pending, (state) => {
            state.updateDropShipLoading = true;
        });
        builder.addCase(updateDropShip.fulfilled, (state, action) => {
            state.updateDropShipLoading = false;
        });
        builder.addCase(updateDropShip.rejected, (state) => {
            state.updateDropShipLoading = false;
        });
        // dropShipSlice DELETE
        builder.addCase(deleteDropShip.pending, (state) => {
            state.deleteDropShipLoading = true;
        });
        builder.addCase(deleteDropShip.fulfilled, (state, action) => {
            state.deleteDropShipLoading = false;
        });
        builder.addCase(deleteDropShip.rejected, (state) => {
            state.deleteDropShipLoading = false;
        });
        // dropShipSlice generate
        builder.addCase(addDropShipGeneraate.pending, (state) => {
            state.addDropShipGeneraateLoading = true;
        });
        builder.addCase(addDropShipGeneraate.fulfilled, (state, action) => {
            state.addDropShipGeneraateLoading = false;
        });
        builder.addCase(addDropShipGeneraate.rejected, (state) => {
            state.addDropShipGeneraateLoading = false;
        });
    },
});

const dropShipReducers = dropShipSlice.reducer;
export default dropShipReducers;
