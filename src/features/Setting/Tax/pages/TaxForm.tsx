import React, { useEffect, useState } from 'react';
import {
    Autocomplete,
    Box,
    Checkbox,
    Divider,
    FormControlLabel,
    Grid,
    IconButton,
    MenuItem,
    TextField,
} from '@mui/material';
import Button from 'components/Button/Button';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { shallowEqual } from 'react-redux';
import { toast } from 'react-toastify';
import { listCity } from 'store/slices/citySlice';
import { listProductCategory } from 'store/slices/productCategorySlice';
import { stateList } from 'store/slices/stateSlice';
import { addTax, listTax, updateTax } from 'store/slices/taxSlice';
import { listCategoryProduct, listProduct } from 'store/slices/productSlice';
import { useAppDispatch, useAppSelector } from 'hooks/useStore';
import { AddCircle, RemoveCircle } from '@mui/icons-material';
import { listAccount, listIntuitAccount } from 'store/slices/accountSlice';

interface Props {
    editData?: any;
    setEditData?: any;
    backToList?: any;
}

type ProductsDetail = {
    ProductsCategoryFId: number;
    ProductFId: number[];
    IsProduct: boolean;
};

interface Tax {
    Name: string;
    Type: string;
    Code: string;
    IsState: boolean;
    IsCity: boolean;
    PA_Income_FId: number;
    PA_Expense_FId: number;
    StateFId: number;
    CitiesFId: number;
    IsProductCategory: boolean;
    ProductsDetails: [{
        ProductsCategoryFId: number;
        ProductFId: number[];
        IsProduct: boolean;
    }];
}

const taxInitialValues: Tax = {
    Name: '',
    Type: '',
    Code: '',
    IsState: false,
    IsCity: false,
    PA_Income_FId: 0,
    PA_Expense_FId: 0,
    IsProductCategory: false,
    ProductsDetails: [{
        ProductsCategoryFId: 0,
        ProductFId: [],
        IsProduct: false,
    }],

    StateFId: 0,
    CitiesFId: 0
};

const TaxForm = (props: Props) => {
    const [initialData, setInitialData] = useState<Tax>({ ...taxInitialValues });
    const dispatch = useAppDispatch();
    const [selectedState, setSelectedState] = useState<number | null>(null);
    const [selectedAccount, setSelectedAccount] = useState<number | null>(null);
    const [selectedAccountExpense, setSelectedAccountExpense] = useState<number | null>(null);
    const [cities, setCities] = useState<any[]>([]);

    const [stateListData, stateLoading] = useAppSelector(
        (state) => [
            state.stateReducers.stateListData,
            state.stateReducers.stateLoading
        ],
        shallowEqual
    );
    console.log(props.editData);


    const [cityList, listCityLoading] = useAppSelector(
        (state) => [
            state.cityReducers.cityList,
            state.cityReducers.listCityLoading
        ],
        shallowEqual
    );

    const [productCategoryList, listProductCategoryLoading] = useAppSelector(
        (state) => [
            state.productCategoryReducers.productCategoryList,
            state.productCategoryReducers.listProductCategoryLoading
        ],
        shallowEqual
    );

    const [listCategoryProducts, listCategoryProductsLoading] = useAppSelector(
        (state) => [
            state.productReducers.productList,
            state.productReducers.listCateogryProductsLoading
        ],
        shallowEqual
    );
    const [listproducts, listProductLoading] = useAppSelector(
        (state) => [
            state.productReducers.productList,
            state.productReducers.listProductLoading
        ],
        shallowEqual
    );

    const [taxList, addTaxLoading] = useAppSelector(
        (state) => [
            state.taxReducers.taxList,
            state.taxReducers.addTaxLoading
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

    useEffect(() => {
        dispatch(stateList());
        dispatch(listCity());
        dispatch(listProductCategory());
        // dispatch(listIntuitAccount());
        dispatch(listProduct());
        dispatch(listAccount());
    }, [dispatch]);

    console.log("props.editData", props.editData);
    useEffect(() => {
        if (props.editData) {
            const editedData = {
                ...taxInitialValues,
                ...props.editData, // Copy all properties from props.editData
                ProductsDetails: props.editData.ProductsDetails.map((productDetail: ProductsDetail) => ({
                    ProductsCategoryFId: productDetail.ProductsCategoryFId || 0,
                    ProductFId: productDetail.ProductFId.map((p: any) => p.ProductFId) || [], // Correctly map ProductFId
                    IsProduct: productDetail.IsProduct || false,
                })),
            };

            setInitialData(editedData);
            setSelectedState(editedData.StateFId || null);
            setSelectedAccount(editedData.PA_Income_FId || null);
            setSelectedAccountExpense(editedData.PA_Expense_FId || null);
        } else {
            setInitialData({ ...taxInitialValues });
        }
    }, [props.editData]);

    const handleProductAutocompleteChange = (newValue: any[]) => {
        const newProductIds = newValue.map((product) => product.Id);

        const updatedProductsDetails = {
            ...initialData.ProductsDetails[0],
            ProductFId: Array.from(new Set(newProductIds)), // Ensure unique products
        };

        const updatedTax: Tax = {
            ...initialData,
            ProductsDetails: [updatedProductsDetails],
        };

        setInitialData(updatedTax);
    };

    // console.log("props.editData.IsProductCategory ", props.editData.IsProductCategory);

    const handleChange = (e: React.ChangeEvent<any>) => {
        const { name, value, type, checked } = e.target;

        const updatedTax: Tax = {
            ...initialData,
            ProductsDetails: [{ ...initialData.ProductsDetails[0] }], // Ensure deep copy of the first element
        };

        switch (name) {
            case 'ProductsCategoryFId':
                updatedTax.ProductsDetails[0] = {
                    ...updatedTax.ProductsDetails[0],
                    ProductsCategoryFId: parseInt(value, 10),
                    ProductFId: [], // Reset ProductFId when ProductsCategoryFId changes
                };
                break;
            case 'ProductFId':
                const productIds = Array.isArray(value) ? value.map((val) => parseInt(val, 10)) : [parseInt(value, 10)];
                updatedTax.ProductsDetails[0] = {
                    ...updatedTax.ProductsDetails[0],
                    ProductFId: productIds,
                };
                break;
            case 'IsState':
                updatedTax.IsState = checked;
                if (checked) {
                    updatedTax.StateFId = 0;
                    updatedTax.IsCity = checked;
                    setSelectedState(null);
                } else {
                    updatedTax.IsCity = false;
                    updatedTax.StateFId = 0;
                    updatedTax.CitiesFId = 0;
                }
                break;
            case 'IsCity':
                updatedTax.IsCity = checked;
                if (checked && updatedTax.IsState) {
                    updatedTax.CitiesFId = 0;
                }
                break;
            case 'IsProduct':
                updatedTax.ProductsDetails[0].IsProduct = checked;
                if (checked && updatedTax.IsProductCategory) {
                    if (!checked) {
                        updatedTax.ProductsDetails[0] = {
                            ProductsCategoryFId: 0,
                            ProductFId: [],
                            IsProduct: false,
                        };
                    }
                }
                break;
            case 'IsProductCategory':
                updatedTax.IsProductCategory = checked;
                if (checked) {
                    updatedTax.ProductsDetails[0].IsProduct = checked;
                }
                else {
                    updatedTax.ProductsDetails[0].IsProduct = false;
                }
                break;
            default:
                (updatedTax as any)[name] = value;
                break;
        }
        console.log("updatedTax", updatedTax);


        setInitialData(updatedTax);
    };




    console.log("updatedTax", initialData);

    const handleSubmit = async () => {
        try {


            let dataToSend = initialData.IsProductCategory
                ? {
                    ...initialData,
                    ProductsDetails: [{
                        ProductsCategoryFId: 0,
                        ProductFId: [0],
                        IsProduct: true,
                    }]
                }
                : initialData;


            if (props.editData) {
                const action = await dispatch(updateTax({
                    tax_id: props.editData.Id,
                    ...dataToSend,
                }));
                setInitialData({ ...taxInitialValues });
                const response = action.payload;
                toast.success(response.message.message);
                props.setEditData(null);
                props.backToList();
                if (response.message.code === "SUCCESS") {
                    dispatch(stateList());
                    dispatch(listTax());
                }
            } else {
                const action = await dispatch(addTax(dataToSend));
                setInitialData({ ...taxInitialValues });
                const response = action.payload;
                toast.success(response.message.message);
                props.backToList();
                if (response.message.code === "SUCCESS") {
                    dispatch(listTax());
                }
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    // useEffect(() => {
    //     if (props.editData) {
    //         const editedData = {
    //             ...taxInitialValues,
    //             ...props.editData, // Copy all properties from props.editData
    //             ProductsDetails: props.editData.ProductsDetails || [{ ...taxInitialValues.ProductsDetails[0] }]
    //         };
    //         setInitialData(editedData);
    //         console.log("editedData", editedData);

    //         setSelectedState(editedData.StateFId || null);
    //     } else {
    //         setInitialData({ ...taxInitialValues });
    //     }
    // }, [props.editData]);




    useEffect(() => {
        if (selectedState !== null) {
            const filteredCities = cityList.filter(item => item.StateFId === selectedState);
            setCities(filteredCities);
        } else {
            setCities([]);
        }
    }, [selectedState, cityList]);

    const handleStateChange = (event: React.ChangeEvent<any>, value: any) => {
        setSelectedState(value.Id);
        // const updatedTaxes = { ...initialData };
        const updatedTaxes = {
            ...initialData,
            StateFId: value.Id,
            CitiesFId: 0
        };
        setInitialData(updatedTaxes);
    };
    const handleAccountChange = (event: React.ChangeEvent<any>, value: any) => {
        setSelectedAccount(value.Id);
        // const updatedTaxes = { ...initialData };
        const updatedTaxes = {
            ...initialData,
            PA_Income_FId: value.Id,

        };
        setInitialData(updatedTaxes);
    };
    const handleAccountExpenseChange = (event: React.ChangeEvent<any>, value: any) => {
        setSelectedAccountExpense(value.Id);
        // const updatedTaxes = { ...initialData };
        const updatedTaxes = {
            ...initialData,
            PA_Expense_FId: value.Id,

        };
        setInitialData(updatedTaxes);
    };

    const handleAutocompleteChange = (name: string, value: string | number) => {

        handleChange({
            target: {
                name,
                value,
            },

        } as React.ChangeEvent<any>);
        if (name === 'ProductsCategoryFId' && value) {
            dispatch(listCategoryProduct(value));
        }

    };

    // const handleDuplicateTax = () => {
    //     const newTaxList = [...initialData, { ...taxInitialValues }];
    //     setInitialData(taxInitialValues);
    // };


    // const handleRemoveTax = (index: number) => {
    //     if (initialData.length > 1) {
    //         const updatedTaxes = [...initialData];
    //         updatedTaxes.splice(index, 1);
    //         setInitialData(updatedTaxes);
    //     }
    // };
    return (
        <Box>
            <ValidatorForm onSubmit={handleSubmit} autoComplete="off">

                <Grid container spacing={1} mt={1} >
                    <Grid item xs={12} sm={6}>
                        <TextValidator
                            label="Tax Name"
                            onChange={handleChange}
                            name="Name"
                            value={initialData.Name}
                            validators={['required']}
                            errorMessages={['This field is required']}
                            size="small"
                            variant="filled"
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        {/* <TextValidator
                                label="Tax Type"
                                onChange={handleChange}
                                name="Type"
                                value={tax.Type}
                                validators={['required']}
                                errorMessages={['This field is required']}
                                size="small"
                                variant="filled"
                                fullWidth
                            /> */}
                        <TextValidator
                            select
                            fullWidth
                            label="Type"
                            onChange={handleChange}
                            name="Type"
                            value={initialData.Type}
                            size="small"
                            variant="filled"
                        >
                            <MenuItem value="PurchaseOrders">Purchase</MenuItem>
                            <MenuItem value="SalesOrder">Sales</MenuItem>
                            <MenuItem value="Both">Both</MenuItem>
                        </TextValidator>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextValidator
                            label="Tax Code"
                            onChange={handleChange}
                            name="Code"
                            value={initialData.Code}
                            validators={['required']}
                            errorMessages={['This field is required']}
                            size="small"
                            variant="filled"
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>

                        <Autocomplete
                            // id={`StateFId-${index}`}
                            // disabled={initialData.IsState}
                            options={accountListData}
                            getOptionLabel={(option) => option.Name || ''}
                            value={accountListData.find(account => account.Id === initialData.PA_Income_FId) || null}
                            onChange={(event, value) => handleAccountChange(event, value)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Income Account"
                                    fullWidth
                                    variant="filled"
                                    size="small"
                                // validators={['required']}
                                // errorMessages={['State is required']}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>

                        <Autocomplete
                            // id={`StateFId-${index}`}
                            // disabled={initialData.IsState}
                            options={accountListData}
                            getOptionLabel={(option) => option.Name || ''}
                            value={accountListData.find(account => account.Id === initialData.PA_Expense_FId) || null}
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
                    <Grid item xs={12} sm={6}></Grid>
                    <Grid item xs={12} sm={12}> < Divider sx={{ my: 3, mt: 1, mb: 1 }} /></Grid>
                    <Grid item xs={12} sm={6}>

                        <Autocomplete
                            // id={`StateFId-${index}`}
                            disabled={initialData.IsState}
                            options={stateListData}
                            getOptionLabel={(option) => option.Name || ''}
                            value={stateListData.find(state => state.Id === initialData.StateFId) || null}
                            onChange={(event, value) => handleStateChange(event, value)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="State"
                                    fullWidth
                                    variant="filled"
                                    size="small"
                                // validators={['required']}
                                // errorMessages={['State is required']}
                                />
                            )}
                        />
                        <FormControlLabel
                            control={<Checkbox
                                onChange={handleChange}
                                name="IsState"
                                checked={initialData.IsState}
                            />}
                            label="Select all State"
                        />
                    </Grid>


                    <Grid item xs={12} sm={6}>
                        <Autocomplete
                            // id={`CitiesFId-${index}`}
                            disabled={initialData.IsCity}
                            options={cities}
                            getOptionLabel={(option) => option.Name || ''}
                            value={cities.find(city => city.Id === initialData.CitiesFId) || null}
                            onChange={(event, value) => {
                                // const updatedTaxes = [...initialData];
                                const updatedTaxes = {
                                    ...initialData,
                                    CitiesFId: value ? value.Id : 0,
                                };
                                setInitialData({ ...updatedTaxes });
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="City"
                                    fullWidth
                                    variant="filled"
                                    size="small"
                                />
                            )}
                        />


                        <FormControlLabel
                            control={<Checkbox
                                onChange={handleChange}
                                name="IsCity"
                                checked={initialData.IsCity}

                            />}
                            label="Select all City"
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>

                        <Autocomplete
                            // id={`ProductsCategoryFId-${index}`}
                            options={productCategoryList}
                            disabled={initialData.IsProductCategory}
                            getOptionLabel={(option) => option.Name || ''}
                            value={initialData.ProductsDetails[0]?.ProductsCategoryFId
                                ? productCategoryList.find(category => category.Id === initialData.ProductsDetails[0].ProductsCategoryFId)
                                : null
                            }
                            onChange={(event, value) => handleAutocompleteChange('ProductsCategoryFId', value ? value.Id : 0)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Product Category"
                                    required
                                    fullWidth
                                    variant="filled"
                                    size="small"
                                />
                            )}
                        />
                        <FormControlLabel
                            control={<Checkbox
                                onChange={handleChange}
                                name="IsProductCategory"
                                checked={initialData.IsProductCategory || false}
                            />}
                            label="Select all Product Category"
                        />


                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Autocomplete
                            multiple
                            disabled={initialData.ProductsDetails[0]?.IsProduct === true || initialData.IsProductCategory}
                            options={listCategoryProducts}
                            getOptionLabel={(option) => option.Name}
                            value={listCategoryProducts.filter((product) =>
                                initialData.ProductsDetails[0]?.ProductFId &&
                                initialData.ProductsDetails[0].ProductFId.includes(product.Id)
                            )}
                            onChange={(event, newValue) => handleProductAutocompleteChange(newValue)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Products"
                                    variant="filled"
                                    size="small"
                                />
                            )}
                        />







                        <FormControlLabel
                            control={<Checkbox
                                onChange={handleChange}
                                name="IsProduct"
                                checked={initialData.ProductsDetails[0]?.IsProduct || false}
                            />}
                            label="Select all Product"
                        />

                    </Grid>

                </Grid>
                <Grid container justifyContent="flex-end" mt={2}>

                    <Grid item>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={addTaxLoading}
                        >
                            Save
                        </Button>
                    </Grid>
                </Grid>


            </ValidatorForm >
        </Box >
    );
};

export default TaxForm;
