import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { rootConstants } from 'globalConstants/rootConstants';
import { apiHandler } from 'modules/apiHandler';
import { SalesOrderStateType } from 'types/SalesType';

const { getRequest } = apiHandler;
const { postRequest } = apiHandler;
const { putRequest } = apiHandler;
const { deleteRequest } = apiHandler;

const sliceName = 'sales-order';

export const listSalesOrder = createAsyncThunk(`${sliceName}/sales-orderList`, async () => {
    const response = await getRequest(`${rootConstants.SALSE_ORDER_URL}/all`);
    return response;
});

export const addSalesOrder = createAsyncThunk(`${sliceName}/sales-orderAdd`, async (initialData: any) => {
    const response = await postRequest(`${rootConstants.SALSE_ORDER_URL}`, initialData);
    return response;
});


export const updateIntuitSalesOrder = createAsyncThunk(`${sliceName}/sales-order/get_intuit_db_temp`, async () => {
    const response = await getRequest(`${rootConstants.SALSE_ORDER_URL}/intuit`);
    return response;
});

export const updateSalesOrder = createAsyncThunk(`${sliceName}/salesorderUpdate`, async (initialData: any) => {
    const { sales_id, ...salesData } = initialData;
    const response = await putRequest(`${rootConstants.SALSE_ORDER_URL}/${sales_id}`, salesData);
    return response;
});

export const filterSalesCost = createAsyncThunk(`${sliceName}/filterSalesCost`, async (initialData: any) => {
    const response = await postRequest(`${rootConstants.SALSE_ORDER_URL}/filter`, initialData);
    return response;
})


export const postIntuitSalesOrder = createAsyncThunk(`${sliceName}/sales-order/post_intuit_db_temp`, async () => {
    const response = await postRequest(`${rootConstants.SALSE_ORDER_URL}/intuit`, '');
    return response;
});

export const deleteSalesOrder = createAsyncThunk(`${sliceName}/sales-orderDelete`, async (initialData: any) => {
    const { sales_order_id, ...data } = initialData;
    const response = await deleteRequest(`${rootConstants.SALSE_ORDER_URL}/${sales_order_id}`, data);
    return response;
});
const initialState: SalesOrderStateType = {
    salesOrderDeleteLoading: false,
    salesOrderAddLoading: false,
    salesOrderListLoading: false,
    updateSalesOrderLoading: false,
    updateIntuitSalesOrderLoading: false,
    postIntuitSalesOrderLoading: false,
    salesOrderList: []
};


const salesOrderSlice = createSlice({
    name: sliceName,
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(listSalesOrder.pending, (state) => {
            state.salesOrderListLoading = true;
        });
        builder.addCase(listSalesOrder.fulfilled, (state, action) => {
            state.salesOrderList = action.payload?.message.data || [];
            state.salesOrderListLoading = false;
        });
        builder.addCase(listSalesOrder.rejected, (state) => {
            state.salesOrderListLoading = false;
            state.salesOrderList = [];
        });

        builder.addCase(addSalesOrder.pending, (state) => {
            state.salesOrderAddLoading = true;
        });
        builder.addCase(addSalesOrder.fulfilled, (state) => {
            state.salesOrderAddLoading = false;
        });
        builder.addCase(addSalesOrder.rejected, (state) => {
            state.salesOrderAddLoading = false;
        });

        builder.addCase(deleteSalesOrder.pending, (state) => {
            state.salesOrderDeleteLoading = true;
        });
        builder.addCase(deleteSalesOrder.fulfilled, (state) => {
            state.salesOrderDeleteLoading = false;
        });
        builder.addCase(deleteSalesOrder.rejected, (state) => {
            state.salesOrderDeleteLoading = false;
        });

        builder.addCase(updateIntuitSalesOrder.pending, (state) => {
            state.updateIntuitSalesOrderLoading = true;
        });
        builder.addCase(updateIntuitSalesOrder.fulfilled, (state) => {
            state.updateIntuitSalesOrderLoading = false;
        });
        builder.addCase(updateIntuitSalesOrder.rejected, (state) => {
            state.updateIntuitSalesOrderLoading = false;
        });

        builder.addCase(postIntuitSalesOrder.pending, (state) => {
            state.postIntuitSalesOrderLoading = true;
        });
        builder.addCase(postIntuitSalesOrder.fulfilled, (state) => {
            state.postIntuitSalesOrderLoading = false;
        });
        builder.addCase(postIntuitSalesOrder.rejected, (state) => {
            state.postIntuitSalesOrderLoading = false;
        });

        builder.addCase(updateSalesOrder.pending, (state) => {
            state.updateSalesOrderLoading = true;
        });
        builder.addCase(updateSalesOrder.fulfilled, (state) => {
            state.updateSalesOrderLoading = false;
        });
        builder.addCase(updateSalesOrder.rejected, (state) => {
            state.updateSalesOrderLoading = false;
        });
    },

});

const salesOrderReducers = salesOrderSlice.reducer;
export default salesOrderReducers;
