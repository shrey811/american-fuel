import { Autocomplete, Box, FormControl, FormControlLabel, FormLabel, Grid, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField, Typography } from '@mui/material'
import Button from 'components/Button/Button'
import { useAppDispatch, useAppSelector } from 'hooks/useStore'
import React, { useEffect, useState } from 'react'
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator'
import { shallowEqual } from 'react-redux'
import { toast } from 'react-toastify'
import { Label } from 'reactstrap'
import { listAccount } from 'store/slices/accountSlice'
import { listProductCategory } from 'store/slices/productCategorySlice'
import { listProductItem } from 'store/slices/productItemSlice'

import { addProduct, listProduct, updateProduct } from 'store/slices/productSlice'

interface Props {
    editData?: any;
    setEditData?: any;
    backToList?: any;
}

const ProductInitialValues = {
    Name: '',
    Code: '',
    Type: '',
    Status: '',
    Description: '',
    ProductCategoryFId: 0,
    PA_Income_FId: 0,
    PA_Expense_FId: 0,
    PA_Inventory_FId: 0,
    PurchaseDesc: '',
    SaleDesc: '',
    MeasurementUnit: '',
    ProductItemTypeFId: 0
}

const ProductForm = (props: Props) => {

    const dispatch = useAppDispatch();

    const [initialProductData, setInitialProductData] = useState<typeof ProductInitialValues>({
        ...ProductInitialValues,
        Status: 'Active'
    })
    console.log({ PRODUCT: props.editData });
    const [selectedAccount, setSelectedAccount] = useState<number | null>(null);
    const [selectedAccountExpense, setSelectedAccountExpense] = useState<number | null>(null);
    const [productList, addProductLoading] = useAppSelector(
        (state) => [
            state.productReducers.productList,
            state.productReducers.addProductLoading
        ],
        shallowEqual
    );
    const [productCategoryList, listProductCategoryLoading] = useAppSelector(
        (state) => [
            state.productCategoryReducers.productCategoryList,
            state.productCategoryReducers.listProductCategoryLoading,
        ],
        shallowEqual
    );
    const [accountListData, listAccountLoading] = useAppSelector(
        (state) => [
            state.accountReducers.accountListData,
            state.accountReducers.listAccountLoading
        ],
        shallowEqual
    );



    const [productItemList, listProductItemTypeIntuitLoading] = useAppSelector(
        (state) => [
            state.productItemReducers.productItemList || [],
            state.productItemReducers.listProductItemTypeIntuitLoading
        ],
        shallowEqual
    );

    useEffect(() => {
        dispatch(listProduct());
        dispatch(listProductCategory());
        dispatch(listAccount());
        dispatch(listProductItem());
    }, [])

    console.log({ productList, productCategoryList });

    const handleChange = (event: any) => {
        const { name, value } = event.target;
        setInitialProductData({
            ...initialProductData,
            [name]: value
        });
    }

    const handleRadioChange = (event: any) => {
        const { name, value } = event.target;
        setInitialProductData({
            ...initialProductData,
            [name]: value === 'true'
        });
    }
    const handleEditProductCategory = () => {

        if (props.editData) {

            return productCategoryList.find(item => item.Id === initialProductData.ProductCategoryFId) || null;

        } else {
            return initialProductData.ProductCategoryFId ? productCategoryList.find(item => item.Id === initialProductData.ProductCategoryFId) || null : null;
        }
    }
        ;
    const handleEditPAIncomeCategory = () => {
        console.log("props.editData", props.editData);

        if (props.editData) {
            const foundItem = accountListData.find(item => item.Id === initialProductData.PA_Income_FId) || null;
            console.log("In if branch. Found item:", accountListData);
            return foundItem;
        } else {
            const foundItem = initialProductData.PA_Income_FId ? accountListData.find(item => item.Id === initialProductData.PA_Income_FId) || null : null;
            console.log("In else branch. Found item:", foundItem);
            return foundItem;
        }
    }
    const handleEditProductItem = () => {
        console.log("props.editData", props.editData);

        if (props.editData) {
            const foundItem = productItemList.find(item => item.Id === initialProductData.ProductItemTypeFId) || null;
            console.log("In if branch. Found item:", accountListData);
            return foundItem;
        } else {
            const foundItem = initialProductData.ProductItemTypeFId ? productItemList.find(item => item.Id === initialProductData.ProductItemTypeFId) || null : null;
            console.log("In else branch. Found item:", foundItem);
            return foundItem;
        }
    }

    // const handleAccountChange = (event: React.ChangeEvent<any>, value: any) => {
    //     setSelectedAccount(value.Id);
    //     // const updatedTaxes = { ...initialData };
    //     const updatedProduct = {
    //         ...initialProductData,
    //         PA_Income_FId: value.Id,
    //         Status: 'Active'

    //     };
    //     setInitialProductData(updatedProduct);
    // };
    const handleAccountExpenseChange = (event: React.ChangeEvent<any>, value: any) => {
        setSelectedAccountExpense(value.Id);
        // const updatedTaxes = { ...initialData };
        const updatedProduct = {
            ...initialProductData,
            PA_Expense_FId: value.Id,
            Status: 'Active'

        };
        setInitialProductData(updatedProduct);

    };
    useEffect(() => {
        if (props.editData) {
            setInitialProductData(props.editData);
        } else {
            setInitialProductData(ProductInitialValues)
        }
    }, [props.editData])

    const handleSubmitProduct = async () => {
        try {
            if (props.editData) {
                const action = await dispatch(updateProduct({
                    product_id: props.editData.Id,
                    ...initialProductData
                }))
                console.log(initialProductData)
                const response = action.payload;
                setInitialProductData({
                    ...ProductInitialValues
                })
                props.backToList();
                toast.success(response.message.message);
                if (response.message.code === "SUCCESS") {
                    dispatch(listProduct())
                }
            } else {
                const action = await dispatch(addProduct(initialProductData))
                console.log(initialProductData)
                const response = action.payload;
                setInitialProductData({
                    ...ProductInitialValues
                })
                props.backToList();
                toast.success(response.message.message);
                if (response.message.code === "SUCCESS") {
                    dispatch(listProduct())
                }
            }
        } catch (error) {
            toast.error("Something went wrong.")
        }
    }

    return (
        <Box>
            <ValidatorForm onSubmit={handleSubmitProduct} autoComplete="off">
                <Grid container spacing={1} mt={1}>
                    <Grid item xs={12} sm={3}>
                        <Autocomplete
                            options={productItemList}
                            getOptionLabel={(option) => option.Name || ''}
                            value={handleEditProductItem()}
                            onChange={(event, value) => {
                                // If an option is selected, update the state with its ID
                                const updatedProduct = {
                                    ...initialProductData,
                                    ProductItemTypeFId: value ? value.Id : 0  // Ensure it's set to 0 if no option is selected
                                };
                                setInitialProductData(updatedProduct); // Update the product data state
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Product Item Type"
                                    fullWidth
                                    variant="filled"
                                    size="small"
                                    required
                                />
                            )}
                        />

                    </Grid>
                    <Grid item xs={3} sm={3}>
                        <Autocomplete
                            options={productCategoryList}
                            getOptionLabel={(option) => option.Name}
                            value={handleEditProductCategory()}
                            onChange={(event, value) => handleChange({ target: { name: "ProductCategoryFId", value: value ? value.Id : '' } })}
                            renderInput={(params) => <TextField
                                {...params}
                                label="Product Category"
                                variant="filled"
                                size="small"
                                required
                                onChange={handleChange}
                                value={initialProductData.ProductCategoryFId}
                                name="ProductCategoryFId" />
                            }
                        />
                    </Grid>


                    <Grid item xs={3}>
                        <TextValidator
                            label="Product Name"
                            fullWidth
                            onChange={handleChange}
                            name="Name"
                            value={initialProductData.Name}
                            //  validators={['required']}
                            // errorMessages={['This field is required']}
                            size="small"
                            variant="filled"
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextValidator
                            label="Code"
                            fullWidth
                            onChange={handleChange}
                            name="Code"
                            value={initialProductData.Code}
                            // validators={['required']}
                            // errorMessages={['This field is required']}
                            size="small"
                            variant="filled"
                        />
                    </Grid>
                    <Grid item xs={3} sx={{ display: 'none' }}>
                        <TextValidator
                            label="Product Type"
                            onChange={handleChange}
                            name="Type"
                            value={initialProductData.Type}
                            // validators={['required']}
                            // errorMessages={['This field is required']}
                            size="small"
                            fullWidth
                            variant="filled"
                        />
                    </Grid>
                    <Grid item xs={3} sx={{ display: 'none' }}>
                        <TextValidator
                            select
                            label="Status"
                            onChange={handleChange}
                            name="Status"
                            value={initialProductData.Status}
                            size="small"
                            variant="filled"
                            sx={{ width: '89%' }}
                            fullWidth
                        >
                            <MenuItem value="Active">Active</MenuItem>
                            <MenuItem value="Inactive">Inactive</MenuItem>
                        </TextValidator>
                    </Grid>

                    <Grid item xs={3}>
                        <TextValidator
                            label="Description"
                            onChange={handleChange}
                            name="Description"
                            value={initialProductData.Description}
                            // validators={['required']}
                            errorMessages={['This field is required']}
                            size="small"
                            variant="filled"
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextValidator
                            label="Purchase Description"
                            onChange={handleChange}
                            name="PurchaseDesc"
                            value={initialProductData.PurchaseDesc}
                            // validators={['required']}
                            errorMessages={['This field is required']}
                            size="small"
                            fullWidth
                            variant="filled"
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextValidator
                            label="Sale Description"
                            onChange={handleChange}
                            name="SaleDesc"
                            value={initialProductData.SaleDesc}
                            // validators={['required']}
                            fullWidth
                            errorMessages={['This field is required']}
                            size="small"
                            variant="filled"
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextValidator
                            label="Measurement"
                            onChange={handleChange}
                            name="MeasurementUnit"
                            value={initialProductData.MeasurementUnit}
                            fullWidth
                            // validators={['required']}
                            errorMessages={['This field is required']}
                            size="small"
                            variant="filled"
                        />
                    </Grid>

                    <Grid item xs={12} sm={3}>
                        <Autocomplete
                            // id={`StateFId-${index}`}
                            // disabled={initialData.IsState}
                            options={accountListData}
                            getOptionLabel={(option) => option.Name || ''}
                            value={handleEditPAIncomeCategory()}
                            // value={accountListData.find(account => account.Id === initialProductData.PA_Income_FId) || null}
                            // onChange={(event, value) => handleAccountChange(event, value)}
                            onChange={(event, value) => handleChange({ target: { name: "PA_Income_FId", value: value ? value.Id : '' } })}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Income Account"
                                    fullWidth
                                    variant="filled"
                                    size="small"
                                    name="PA_Income_FId"
                                // validators={['required']}
                                // errorMessages={['State is required']}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>

                        <Autocomplete
                            // id={`StateFId-${index}`}
                            // disabled={initialData.IsState}
                            options={accountListData}
                            getOptionLabel={(option) => option.Name || ''}
                            value={accountListData.find(account => account.Id === initialProductData.PA_Expense_FId) || null}
                            onChange={(event, value) => handleAccountExpenseChange(event, value)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Expense Account"
                                    fullWidth
                                    variant="filled"
                                    size="small"
                                // validators={['required']}
                                // errorMessages={['State is required']}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>

                        <Autocomplete
                            // id={`StateFId-${index}`}
                            // disabled={initialData.IsState}
                            options={accountListData}
                            getOptionLabel={(option) => option.Name || ''}
                            value={accountListData.find(account => account.Id === initialProductData.PA_Inventory_FId) || null}
                            onChange={(event, value) => handleChange({ target: { name: "PA_Inventory_FId", value: value ? value.Id : '' } })}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Inventory Account"
                                    fullWidth
                                    variant="filled"
                                    size="small"
                                />
                            )}
                        />
                    </Grid>

                    {/* <Grid item xs={3}>
                        <TextValidator
                            label="SalesTaxIncluded"
                            onChange={handleChange}
                            name="SalesTaxIncluded"
                            value={initialProductData.SalesTaxIncluded}
                            validators={['required']}
                            errorMessages={['This field is required']}
                            size="small"
                            variant="filled"
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextValidator
                            label="UnitPrice"
                            type='number'
                            onChange={handleChange}
                            name="UnitPrice"
                            value={initialProductData.UnitPrice}
                            validators={['required']}
                            errorMessages={['This field is required']}
                            size="small"
                            variant="filled"
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextValidator
                            label="Level"
                            onChange={handleChange}
                            name="Level"
                            value={initialProductData.Level}
                            validators={['required']}
                            errorMessages={['This field is required']}
                            size="small"
                            variant="filled"
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextValidator
                            label="PurchaseDesc"
                            onChange={handleChange}
                            name="PurchaseDesc"
                            value={initialProductData.PurchaseDesc}
                            validators={['required']}
                            errorMessages={['This field is required']}
                            size="small"
                            variant="filled"
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextValidator
                            label="PurchaseTaxIncluded"
                            onChange={handleChange}
                            name="PurchaseTaxIncluded"
                            value={initialProductData.PurchaseTaxIncluded}
                            validators={['required']}
                            errorMessages={['This field is required']}
                            size="small"
                            variant="filled"
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextValidator
                            label="PurchaseCost"
                            type='number'
                            onChange={handleChange}
                            name="PurchaseCost"
                            value={initialProductData.PurchaseCost}
                            validators={['required']}
                            errorMessages={['This field is required']}
                            size="small"
                            variant="filled"
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextValidator
                            label="QtyOnHand"
                            type='number'
                            onChange={handleChange}
                            name="QtyOnHand"
                            value={initialProductData.QtyOnHand}
                            validators={['required']}
                            errorMessages={['This field is required']}
                            size="small"
                            variant="filled"
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextValidator
                            label="AbatementRate"
                            onChange={handleChange}
                            name="AbatementRate"
                            value={initialProductData.AbatementRate}
                            validators={['required']}
                            errorMessages={['This field is required']}
                            size="small"
                            variant="filled"
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextValidator
                            label="ServiceType"
                            onChange={handleChange}
                            name="ServiceType"
                            value={initialProductData.ServiceType}
                            validators={['required']}
                            errorMessages={['This field is required']}
                            size="small"
                            variant="filled"
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <FormControl>
                            <FormLabel id="demo-row-radio-buttons-group-label">Active</FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="Active"
                                value={initialProductData.Active.toString()}
                                onChange={handleRadioChange}
                            >
                                <FormControlLabel value="true" control={<Radio />} label="Yes" />
                                <FormControlLabel value="false" control={<Radio />} label="No" />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={3}>
                        <FormControl>
                            <FormLabel id="demo-row-radio-buttons-group-label">Taxable</FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="Taxable"
                                value={initialProductData.Taxable.toString()}
                                onChange={handleRadioChange}
                            >
                                <FormControlLabel value="true" control={<Radio />} label="Yes" />
                                <FormControlLabel value="false" control={<Radio />} label="No" />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={3}>
                        <Label>Inv Start Data</Label>
                        <TextValidator
                            fullWidth
                            name="InvStartDate"
                            value={initialProductData.InvStartDate}
                            type="datetime-local"
                            size="small"
                            validators={['required']}
                            errorMessages={['This field is required']}
                            onChange={handleChange}
                            variant="filled"
                        />
                    </Grid>
                </Grid> */}
                </Grid>
                <Grid container justifyContent="flex-end" mt={2}>
                    <Button
                        type="submit"
                        name="Save"
                        variant='contained'
                        loading={addProductLoading}
                        disabled={addProductLoading}
                    />
                </Grid>
            </ValidatorForm>
        </Box>
    )
}

export default ProductForm;