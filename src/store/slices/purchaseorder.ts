import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { rootConstants } from 'globalConstants/rootConstants';
import { apiHandler } from 'modules/apiHandler';
import { PurchaseOrderStateType } from 'types/PurchaseOrder';

const { getRequest } = apiHandler;
const { postRequest } = apiHandler;
const { putRequest } = apiHandler;
const { deleteRequest } = apiHandler;

const sliceName = 'purchase-order';

export const listPurchaseOrder = createAsyncThunk(`${sliceName}/purchase-orderList`, async () => {
    const response = await getRequest(`${rootConstants.PURCHASE_ORDER_URL}/all`);
    return response;
});

export const addPurchaseOrder = createAsyncThunk(`${sliceName}/purchase-orderAdd`, async (initialData: any) => {
    const response = await postRequest(`${rootConstants.PURCHASE_ORDER_URL}`, initialData);
    return response;
});


export const updateIntuitPurchaseOrder = createAsyncThunk(`${sliceName}/purchase-order/get_intuit_db_temp`, async () => {
    const response = await getRequest(`${rootConstants.PURCHASE_ORDER_INTUIT_URL}`);
    return response;
});

export const updatePurchase = createAsyncThunk(`${sliceName}/purchaseorderUpdate`, async (initialData: any) => {
    const { purchase_id, ...purchaseData } = initialData;
    const response = await putRequest(`${rootConstants.PURCHASE_ORDER_URL}/${purchase_id}`, purchaseData);
    return response;
});

export const postIntuitPurchaseOrder = createAsyncThunk(`${sliceName}/purchase-order/post_intuit_db_temp`, async () => {
    const response = await postRequest(`${rootConstants.PURCHASE_ORDER_INTUIT_URL}`, '');
    return response;
});

export const deletePurchaseOrder = createAsyncThunk(`${sliceName}/purchase-orderDelete`, async (initialData: any) => {
    const { purchase_order_id, ...data } = initialData;
    const response = await deleteRequest(`${rootConstants.PURCHASE_ORDER_URL}/${purchase_order_id}`, data);
    return response;
});
const initialState: PurchaseOrderStateType = {
    purchaseOrderDeleteLoading: false,
    purchaseOrderAddLoading: false,
    purchaseOrderListLoading: false,
    updateIntuitPurchaseOrderLoading: false,
    postIntuitPurchaseOrderLoading: false,
    updatePurchaseOrderLoading: false,
    purchaseOrderList: []
};


const purchaseOrderSlice = createSlice({
    name: sliceName,
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(listPurchaseOrder.pending, (state) => {
            state.purchaseOrderListLoading = true;
        });
        builder.addCase(listPurchaseOrder.fulfilled, (state, action) => {
            state.purchaseOrderList = action.payload?.message.data || [];
            state.purchaseOrderListLoading = false;
        });
        builder.addCase(listPurchaseOrder.rejected, (state) => {
            state.purchaseOrderListLoading = false;
            state.purchaseOrderList = [];
        });

        builder.addCase(addPurchaseOrder.pending, (state) => {
            state.purchaseOrderAddLoading = true;
        });
        builder.addCase(addPurchaseOrder.fulfilled, (state) => {
            state.purchaseOrderAddLoading = false;
        });
        builder.addCase(addPurchaseOrder.rejected, (state) => {
            state.purchaseOrderAddLoading = false;
        });

        builder.addCase(deletePurchaseOrder.pending, (state) => {
            state.purchaseOrderDeleteLoading = true;
        });
        builder.addCase(deletePurchaseOrder.fulfilled, (state) => {
            state.purchaseOrderDeleteLoading = false;
        });
        builder.addCase(deletePurchaseOrder.rejected, (state) => {
            state.purchaseOrderDeleteLoading = false;
        });

        builder.addCase(updateIntuitPurchaseOrder.pending, (state) => {
            state.updateIntuitPurchaseOrderLoading = true;
        });
        builder.addCase(updateIntuitPurchaseOrder.fulfilled, (state) => {
            state.updateIntuitPurchaseOrderLoading = false;
        });
        builder.addCase(updateIntuitPurchaseOrder.rejected, (state) => {
            state.updateIntuitPurchaseOrderLoading = false;
        });

        builder.addCase(postIntuitPurchaseOrder.pending, (state) => {
            state.postIntuitPurchaseOrderLoading = true;
        });
        builder.addCase(postIntuitPurchaseOrder.fulfilled, (state) => {
            state.postIntuitPurchaseOrderLoading = false;
        });
        builder.addCase(postIntuitPurchaseOrder.rejected, (state) => {
            state.postIntuitPurchaseOrderLoading = false;
        });

        builder.addCase(updatePurchase.pending, (state) => {
            state.updatePurchaseOrderLoading = true;
        });
        builder.addCase(updatePurchase.fulfilled, (state) => {
            state.updatePurchaseOrderLoading = false;
        });
        builder.addCase(updatePurchase.rejected, (state) => {
            state.updatePurchaseOrderLoading = false;
        });
    },

});

const purchaseOrderReducers = purchaseOrderSlice.reducer;
export default purchaseOrderReducers;
