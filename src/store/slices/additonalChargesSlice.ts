import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { rootConstants } from 'globalConstants/rootConstants';
import { apiHandler } from 'modules/apiHandler';
import { AdditionalChargesStateType } from 'types/AddiotnalChargesType';

const { getRequest, postRequest, putRequest, deleteRequest } = apiHandler;

const sliceName = 'additionalCharges';


export const listAdditionalCharges = createAsyncThunk(`${sliceName}/listadditionalCharges`, async () => {
    const response = await getRequest(`${rootConstants.ADDITIONALCHARGES_URL}/all`);
    return response
});

export const addAdditionalCharges = createAsyncThunk(`${sliceName}/additionalCharges`, async (initialData: any) => {
    const response = await postRequest(`${rootConstants.ADDITIONALCHARGES_URL}`, initialData);
    return response
});


export const updateAdditionalCharges = createAsyncThunk(`${sliceName}/updateadditionalCharges`, async (initialData: any) => {
    const { additionalCharges_id, ...additionalChargesData } = initialData;
    const response = await putRequest(`${rootConstants.ADDITIONALCHARGES_URL}/${additionalCharges_id}`, additionalChargesData);
    return response;
});

export const deleteAdditionalCharges = createAsyncThunk(`${sliceName}/deleteadditionalCharges`, async (initialData: any) => {
    const { additionalCharges_id, ...additionalChargesData } = initialData;
    const response = await deleteRequest(`${rootConstants.ADDITIONALCHARGES_URL}/${additionalCharges_id}`, additionalChargesData);
    return response;
});

const initialState: AdditionalChargesStateType = {
    listAdditionalchargesLoading: false,
    addAdditionalchargesLoading: false,
    updateAdditionalchargesLoading: false,
    deleteAdditionalchargesLoading: false,
    additionalchargesList: [],
};

const additionalChargesSlice = createSlice({
    name: sliceName,
    initialState,
    reducers: {},
    extraReducers: (builder) => {

        builder.addCase(listAdditionalCharges.pending, (state) => {
            state.listAdditionalchargesLoading = true; // Update state property name
        });
        builder.addCase(listAdditionalCharges.fulfilled, (state, action) => {
            state.additionalchargesList = action.payload?.message.data || []; // Update state property name
            state.listAdditionalchargesLoading = false; // Update state property name
        });
        builder.addCase(listAdditionalCharges.rejected, (state) => {
            state.listAdditionalchargesLoading = false; // Update state property name
            state.additionalchargesList = []; // Update state property name
        });


        builder.addCase(addAdditionalCharges.pending, (state) => {
            state.addAdditionalchargesLoading = true; // Update state property name
        });
        builder.addCase(addAdditionalCharges.fulfilled, (state, action) => {
            state.addAdditionalchargesLoading = false; // Update state property name
        });
        builder.addCase(addAdditionalCharges.rejected, (state) => {
            state.addAdditionalchargesLoading = false; // Update state property name
        });

        builder.addCase(updateAdditionalCharges.pending, (state) => {
            state.updateAdditionalchargesLoading = true;
        });
        builder.addCase(updateAdditionalCharges.fulfilled, (state, action) => {
            state.updateAdditionalchargesLoading = false;
        });
        builder.addCase(updateAdditionalCharges.rejected, (state) => {
            state.updateAdditionalchargesLoading = false;
        });

        builder.addCase(deleteAdditionalCharges.pending, (state) => {
            state.deleteAdditionalchargesLoading = true;
        });
        builder.addCase(deleteAdditionalCharges.fulfilled, (state, action) => {
            state.deleteAdditionalchargesLoading = false;
        });
        builder.addCase(deleteAdditionalCharges.rejected, (state) => {
            state.deleteAdditionalchargesLoading = false;
        });

    }
});

const additionalChargeReducers = additionalChargesSlice.reducer;
export default additionalChargeReducers;