import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { rootConstants } from 'globalConstants/rootConstants';
import { apiHandler } from 'modules/apiHandler';
import { RealTimeCostStateType } from 'types/RealTimecostType';
import { ReportStateType } from 'types/ReportType';

const { getRequest } = apiHandler;
const { postRequest } = apiHandler;
const { putRequest } = apiHandler;
const { deleteRequest } = apiHandler;

const sliceName = 'report';


export const addReport = createAsyncThunk(`${sliceName}/addReports`, async (initialData: any) => {
    const response = await postRequest(`${rootConstants.REPORT_URL}`, initialData);
    return response;
});

const initialState: ReportStateType = {

    addReportLoading: false,

    reportList: [],
};

const reportSlice = createSlice({
    name: sliceName,
    initialState,
    reducers: {},
    extraReducers: (builder) => {

        builder.addCase(addReport.pending, (state) => {
            state.addReportLoading = true;
        });
        builder.addCase(addReport.fulfilled, (state, action) => {
            state.addReportLoading = false;
        });
        builder.addCase(addReport.rejected, (state) => {
            state.addReportLoading = false;
        });

    },
});

const reportReducers = reportSlice.reducer;
export default reportReducers;
