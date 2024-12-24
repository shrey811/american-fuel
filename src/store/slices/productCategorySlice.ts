import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { rootConstants } from 'globalConstants/rootConstants';
import { apiHandler } from 'modules/apiHandler';
import { ProductCategoryStateType } from 'types/ProductCategory';

const { getRequest, postRequest, putRequest, deleteRequest } = apiHandler;

const sliceName = 'productCategory';


export const listProductCategory = createAsyncThunk(`${sliceName}/product/list`, async () => {
    const response = await getRequest(`${rootConstants.PRODUCT_URL}/product-category-all`);
    return response
});

export const addProductCategory = createAsyncThunk(`${sliceName}/product/Category`, async (initialData: any) => {
    const response = await postRequest(`${rootConstants.PRODUCT_CATEGORY_URL}`, initialData);
    return response
});

export const updateProductCategory = createAsyncThunk(`${sliceName}/updateProductCategory`, async (initialData: any) => {
    const { productCategory_id, ...productData } = initialData;
    const response = await putRequest(`${rootConstants.PRODUCT_CATEGORY_URL}/${productCategory_id}`, productData);
    return response;
});

export const productCategoryDelete = createAsyncThunk(`${sliceName}/productCategoryDelete`, async (initialData: any) => {
    const { productCategory_id, ...productData } = initialData;
    const response = await deleteRequest(`${rootConstants.PRODUCT_CATEGORY_URL}/${productCategory_id}`, productData);
    return response;
});

const initialState: ProductCategoryStateType = {
    listProductCategoryLoading: false,
    addProductCategoryLoading: false,
    deleteProductCategoryLoading: false,
    productCategoryList: [],
};

const productCategorySlice = createSlice({
    name: sliceName,
    initialState,
    reducers: {},
    extraReducers: (builder) => {

        builder.addCase(listProductCategory.pending, (state) => {
            state.listProductCategoryLoading = true; // Update state property name
        });
        builder.addCase(listProductCategory.fulfilled, (state, action) => {
            state.productCategoryList = action.payload?.message.data || []; // Update state property name
            state.listProductCategoryLoading = false; // Update state property name
        });
        builder.addCase(listProductCategory.rejected, (state) => {
            state.listProductCategoryLoading = false; // Update state property name
            state.productCategoryList = []; // Update state property name
        });


        builder.addCase(addProductCategory.pending, (state) => {
            state.addProductCategoryLoading = true; // Update state property name
        });
        builder.addCase(addProductCategory.fulfilled, (state, action) => {
            // state. = action.payload?.message.data; // Update state property name
            state.addProductCategoryLoading = false; // Update state property name
        });
        builder.addCase(addProductCategory.rejected, (state) => {
            state.addProductCategoryLoading = false; // Update state property name
            // state.productCategoryListData = []; // Update state property name
        });

        builder.addCase(updateProductCategory.pending, (state) => {
            state.addProductCategoryLoading = true;
        });
        builder.addCase(updateProductCategory.fulfilled, (state, action) => {
            state.addProductCategoryLoading = false;
        });
        builder.addCase(updateProductCategory.rejected, (state) => {
            state.addProductCategoryLoading = false;
        });

        builder.addCase(productCategoryDelete.pending, (state) => {
            state.deleteProductCategoryLoading = true;
        });
        builder.addCase(productCategoryDelete.fulfilled, (state, action) => {
            // state.productCategoryListData = action.payload?.message.data;
            state.deleteProductCategoryLoading = false;
        });
        builder.addCase(productCategoryDelete.rejected, (state) => {
            state.deleteProductCategoryLoading = false;
            // state.productCategoryListData = [];
        });
    }
});

const productCategoryReducers = productCategorySlice.reducer;
export default productCategoryReducers;
