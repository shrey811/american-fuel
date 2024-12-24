import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { rootConstants } from 'globalConstants/rootConstants';
import { apiHandler } from 'modules/apiHandler';
import { CityStateType } from 'types/CityType';

const { getRequest } = apiHandler;
const { postRequest } = apiHandler;
const { putRequest } = apiHandler;
const { deleteRequest } = apiHandler;

const sliceName = 'cities';

export const listCity = createAsyncThunk(`${sliceName}/listCity`, async () => {
  const response = await getRequest(`${rootConstants.CITY_URL}`);
  return response;
});

export const addCity = createAsyncThunk(`${sliceName}/addCity`, async (initialData: any) => {
  const response = await postRequest(`${rootConstants.CITY_URL}`, initialData);
  return response;
});

export const updateCity = createAsyncThunk(`${sliceName}/updateCity`, async (initialData: any) => {
  const { city_id, ...cityData } = initialData;
  const response = await putRequest(`${rootConstants.CITY_URL}/${city_id}`, cityData);
  return response;
});

export const deleteCity = createAsyncThunk(`${sliceName}/deleteCity`, async (initialData: any) => {
  const { city_id, ...cityData } = initialData;
  const response = await deleteRequest(`${rootConstants.CITY_URL}/${city_id}`, cityData);
  return response;
});

const initialState: CityStateType = {
  listCityLoading: false,
  addCityLoading: false,
  deleteCityLoading: false,
  cityList: [],
};

const citySlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(listCity.pending, (state) => {
      state.listCityLoading = true;
    });
    builder.addCase(listCity.fulfilled, (state, action) => {
      state.cityList = action.payload?.message.data || [];
      state.listCityLoading = false;
    });
    builder.addCase(listCity.rejected, (state) => {
      state.listCityLoading = false;
      state.cityList = [];
    });
    // CITY POST
    builder.addCase(addCity.pending, (state) => {
      state.addCityLoading = true;
    });
    builder.addCase(addCity.fulfilled, (state, action) => {
      state.addCityLoading = false;
    });
    builder.addCase(addCity.rejected, (state) => {
      state.addCityLoading = false;
    });
    // CITY UPDATE
    builder.addCase(updateCity.pending, (state) => {
      state.addCityLoading = true;
    });
    builder.addCase(updateCity.fulfilled, (state, action) => {
      state.addCityLoading = false;
    });
    builder.addCase(updateCity.rejected, (state) => {
      state.addCityLoading = false;
    });
    // CITY DELETE
    builder.addCase(deleteCity.pending, (state) => {
      state.deleteCityLoading = true;
    });
    builder.addCase(deleteCity.fulfilled, (state, action) => {
      state.deleteCityLoading = false;
    });
    builder.addCase(deleteCity.rejected, (state) => {
      state.deleteCityLoading = false;
    });
  },
});

const cityReducers = citySlice.reducer;
export default cityReducers;
