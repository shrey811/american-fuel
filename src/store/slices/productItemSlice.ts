import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { rootConstants } from 'globalConstants/rootConstants';
import { apiHandler } from 'modules/apiHandler';
import { ProductStateType } from 'types/Product';
import { ProductItemStateType } from 'types/productItemType';

const { getRequest, postRequest, putRequest, deleteRequest } = apiHandler;

const sliceName = 'productItem';


export const listProductItem = createAsyncThunk(`${sliceName}/listProductItem`, async () => {

    const response = await getRequest(`${rootConstants.PRODUCT_URL}/product-item-type/all`);
    return response
});

const initialState: ProductItemStateType = {
    listProductItemTypeIntuitLoading: false,
    productItemList: [],
};

const productItemSlice = createSlice({
    name: sliceName,
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(listProductItem.pending, (state) => {
            state.listProductItemTypeIntuitLoading = true;
        });
        builder.addCase(listProductItem.fulfilled, (state, action) => {
            state.productItemList = action.payload?.message.data || [];
            state.listProductItemTypeIntuitLoading = false;
        });
        builder.addCase(listProductItem.rejected, (state) => {
            state.listProductItemTypeIntuitLoading = false;
            state.productItemList = [];
        });
    }
});

const productItemReducers = productItemSlice.reducer;
export default productItemReducers;