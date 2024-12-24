import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { rootConstants } from 'globalConstants/rootConstants';
import { apiHandler } from 'modules/apiHandler';
import { IntuitStateType } from 'types/IntuitloginTypes';

const { getRequest } = apiHandler;
const { postRequest } = apiHandler;
const sliceName = 'intuit';


export const InutitLogin = createAsyncThunk(`${sliceName}/intuitlist`, async () => {
    const response = await getRequest(`${rootConstants.INTUIT_URL}`);
    return response;
});


// export const InutitToken = createAsyncThunk(`${sliceName}/intuitoken`, async (intuitData: any) => {
//     const response = await getRequest(`${rootConstants.INTUIT_ACCESS_TOKEN_URL}`, intuitData);
//     return response;
// });

export const InutitToken = createAsyncThunk(
    `${sliceName}/intuitoken`,
    async (intuitData: any) => {
        // Assuming `intuitData` contains necessary information for authentication
        const { code, realm_id } = intuitData;

        // Customize the request URL if necessary
        const requestURL = `${rootConstants.INTUIT_ACCESS_TOKEN_URL}/${code}/${realm_id}`;

        // Send the request with modified `requestURL` and `auth` set to false
        const response = await getRequest(requestURL, false);

        return response;
    }
);


const initialState: IntuitStateType = {
    intuitDataLoading: false,
    intuitListData: [],
};

const intuitSlice = createSlice({
    name: sliceName,
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(InutitLogin.pending, (state) => {
            state.intuitDataLoading = true;
        });
        builder.addCase(InutitLogin.fulfilled, (state, action) => {
            state.intuitListData = action.payload?.message.data;
            state.intuitDataLoading = false;
        });
        builder.addCase(InutitLogin.rejected, (state) => {
            state.intuitDataLoading = false;
            state.intuitListData = [];
        });
        //_____________________________________________//


        builder.addCase(InutitToken.pending, (state) => {
            state.intuitDataLoading = true;
        });
        builder.addCase(InutitToken.fulfilled, (state, action) => {
            state.intuitListData = action.payload?.message.entries;
            state.intuitDataLoading = false;
        });
        builder.addCase(InutitToken.rejected, (state) => {
            state.intuitDataLoading = false;
            state.intuitListData = [];
        });
    },
});

const intuitReducers = intuitSlice.reducer;
export default intuitReducers;
