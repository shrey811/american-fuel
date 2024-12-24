import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { rootConstants } from 'globalConstants/rootConstants';
import { apiHandler } from 'modules/apiHandler';
import { ProductStateType } from 'types/Product';

const { getRequest, postRequest, putRequest, deleteRequest } = apiHandler;

const sliceName = 'product';


export const listProduct = createAsyncThunk(`${sliceName}/listProduct`, async () => {
    const response = await getRequest(`${rootConstants.PRODUCT_URL}/all`);
    return response
});

export const listCategoryProduct = createAsyncThunk(`${sliceName}/listCategoryProduct`, async (value: any) => {

    const response = await getRequest(`${rootConstants.PRODUCT_URL}/${value}`);
    return response
});



export const addProduct = createAsyncThunk(`${sliceName}/product`, async (initialData: any) => {
    const response = await postRequest(`${rootConstants.PRODUCT_URL}`, initialData);
    return response
});

export const updateIntuitProduct = createAsyncThunk(`${sliceName}/product/get_intuit_db_temp`, async () => {
    const response = await getRequest(`${rootConstants.PRODUCT_INTUIT_URL}`);
    return response;
});


export const updateProduct = createAsyncThunk(`${sliceName}/updateProduct`, async (initialData: any) => {
    const { product_id, ...productData } = initialData;
    const response = await putRequest(`${rootConstants.PRODUCT_URL}/${product_id}`, productData);
    return response;
});

export const deleteProduct = createAsyncThunk(`${sliceName}/deleteProduct`, async (initialData: any) => {
    const { product_id, ...productData } = initialData;
    const response = await deleteRequest(`${rootConstants.PRODUCT_URL}/${product_id}`, productData);
    return response;
});

const initialState: ProductStateType = {
    listProductLoading: false,
    addProductLoading: false,
    listCateogryProductsLoading: false,
    listProductIntuitLoading: false,
    listProductItemTypeIntuitLoading: false,
    productList: [],
};

const productSlice = createSlice({
    name: sliceName,
    initialState,
    reducers: {},
    extraReducers: (builder) => {

        builder.addCase(listProduct.pending, (state) => {
            state.listProductLoading = true; // Update state property name
        });
        builder.addCase(listProduct.fulfilled, (state, action) => {
            state.productList = action.payload?.message.data || []; // Update state property name
            state.listProductLoading = false; // Update state property name
        });
        builder.addCase(listProduct.rejected, (state) => {
            state.listProductLoading = false; // Update state property name
            state.productList = []; // Update state property name
        });

        builder.addCase(listCategoryProduct.pending, (state) => {
            state.listCateogryProductsLoading = true; // Update state property name
        });
        builder.addCase(listCategoryProduct.fulfilled, (state, action) => {
            state.productList = action.payload?.message.data || []; // Update state property name
            state.listCateogryProductsLoading = false; // Update state property name
        });
        builder.addCase(listCategoryProduct.rejected, (state) => {
            state.listCateogryProductsLoading = false; // Update state property name
            state.productList = []; // Update state property name
        });



        builder.addCase(addProduct.pending, (state) => {
            state.addProductLoading = true; // Update state property name
        });
        builder.addCase(addProduct.fulfilled, (state, action) => {
            state.addProductLoading = false; // Update state property name
        });
        builder.addCase(addProduct.rejected, (state) => {
            state.addProductLoading = false; // Update state property name
        });

        builder.addCase(updateProduct.pending, (state) => {
            state.addProductLoading = true;
        });
        builder.addCase(updateProduct.fulfilled, (state, action) => {
            state.addProductLoading = false;
        });
        builder.addCase(updateProduct.rejected, (state) => {
            state.addProductLoading = false;
        });

        builder.addCase(deleteProduct.pending, (state) => {
            state.listProductLoading = true;
        });
        builder.addCase(deleteProduct.fulfilled, (state, action) => {
            state.listProductLoading = false;
        });
        builder.addCase(deleteProduct.rejected, (state) => {
            state.listProductLoading = false;
        });

        builder.addCase(updateIntuitProduct.pending, (state) => {
            state.listProductIntuitLoading = true;
        });
        builder.addCase(updateIntuitProduct.fulfilled, (state) => {
            state.listProductIntuitLoading = false;
        });
        builder.addCase(updateIntuitProduct.rejected, (state) => {
            state.listProductIntuitLoading = false;
        });
    }
});

const productReducers = productSlice.reducer;
export default productReducers;