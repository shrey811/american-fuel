import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { rootConstants } from 'globalConstants/rootConstants';
import { apiHandler } from 'modules/apiHandler';
import { StateCityStateType } from 'types/CityStateType';
import { CityStateType } from 'types/CityType';

const { getRequest } = apiHandler;
const { postRequest } = apiHandler;
const { putRequest } = apiHandler;
const { deleteRequest } = apiHandler;

const sliceName = 'cities_state';

export const listCityState = createAsyncThunk(`${sliceName}/cities_state`, async (state_id: any) => {
    const response = await getRequest(`${rootConstants.CITY_STATE_URL}/${state_id}/city`);
    return response;
});


const initialState: StateCityStateType = {
    listCityStateLoading: false,
    cityStateList: [],
};
const cityStateSlice = createSlice({
    name: sliceName,
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(listCityState.pending, (state) => {
            state.listCityStateLoading = true;
        });
        builder.addCase(listCityState.fulfilled, (state, action) => {
            state.cityStateList = action.payload?.message.data || [];
            state.listCityStateLoading = false;
        });
        builder.addCase(listCityState.rejected, (state) => {
            state.listCityStateLoading = false;
            state.cityStateList = [];

        });
    },
});

const cityStateReducers = cityStateSlice.reducer;
export default cityStateReducers;