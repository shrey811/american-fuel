import { Autocomplete, Box, Grid, MenuItem, TextField } from '@mui/material';
import Button from 'components/Button/Button';
import { useAppDispatch, useAppSelector } from 'hooks/useStore';
import React, { useEffect, useState } from 'react'
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { shallowEqual } from 'react-redux';
import { toast } from 'react-toastify';
import { addCustomerAssest, listCustomerAssest, updateCustomerAssest } from 'store/slices/customerassestsSlice';
import { listCustomer } from 'store/slices/customerSlice';
import { listProduct } from 'store/slices/productSlice';

interface Props {
    onClose: () => void;
    fetchCustomer: any;
    editData: any;
}
const CustomerAssetsInitialValues = {
    Name: "",
    UniqueId: "",
    AssetType: "",
    Status: "",
    CustomersFId: 0,
    AssetCategory: "",
    AssetMake: "",
    AssetModel: "",
    Capacity: 0,
    ProductFIds: [] as number[],
    AssetDescription: "",

}

const CustomerAssestForm = (props: Props) => {
    const dispatch = useAppDispatch();

    const [initialData, setInitialData] = useState<typeof CustomerAssetsInitialValues>({
        ...CustomerAssetsInitialValues,
        CustomersFId: props.fetchCustomer.Id,
    })
    const [displayName, setDisplayName] = useState<string>('');
    const handleChange = (event: any) => {
        const { name, value } = event.target;
        setInitialData({
            ...initialData, [name]: value
        });
    }
    const handleProductAutocompleteChange = (newValue: any[]) => {
        setInitialData({
            ...initialData,
            ProductFIds: newValue.map((product) => product.Id), // Extract IDs from selected products
        });
    };

    useEffect(() => {
        if (props.editData) {
            setInitialData(props.editData);
        }
        dispatch(listCustomer());
        dispatch(listProduct());
        const selectedCustomer = customerList.find(item => item.Id === parseFloat(props.fetchCustomer.Id));
        if (selectedCustomer) {
            setDisplayName(selectedCustomer.DisplayName);
            console.log("selectedVendor.DisplayName  ", selectedCustomer.DisplayName);
        }
    }, []);

    const [customerList, addCustomerLoading] = useAppSelector(
        (state) => [
            state.customerReducers.customerList,
            state.customerReducers.addCustomerLoading,
        ],
        shallowEqual
    );
    const [productList, listProductLoading] = useAppSelector(
        (state) => [
            state.productReducers.productList,
            state.productReducers.listProductLoading
        ],
        shallowEqual
    );

    const handleSubmit = async () => {

        try {
            if (props.editData) {
                const action = await dispatch(updateCustomerAssest({
                    customerAssest_id: props.fetchCustomer.Id,
                    ...initialData,
                    CustomersFId: props.fetchCustomer.Id
                }));
                ;
                setInitialData({ ...initialData });
                const response = action.payload;
                toast.success(response.message.message);
                const customerAssest_id = props.fetchCustomer.Id;
                dispatch(listCustomerAssest(customerAssest_id))
                props.onClose();
            } else {
                const action = await dispatch(addCustomerAssest(initialData));
                setInitialData({ ...initialData });
                const response = action.payload;
                // props.backToList();
                toast.success(response.message.message);
                const customerAssest_id = props.fetchCustomer.Id;
                dispatch(listCustomerAssest(customerAssest_id));
                props.onClose();
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    }
    return (
        <Box>
            <ValidatorForm onSubmit={handleSubmit} autoComplete="off">
                <Grid container spacing={1} mt={1}>
                    <Grid item xs={4}>
                        <TextValidator
                            label="Customer Name"
                            // onChange={handleChange}
                            name="CustomerName"
                            value={displayName}
                            size="small"
                            variant="filled"
                            fullWidth
                            disabled
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextValidator
                            label="Name "
                            onChange={handleChange}
                            name="Name"
                            value={initialData.Name}
                            // disabled={disabled}
                            validators={['required']}
                            errorMessages={['This field is required']}
                            size="small"
                            variant="filled"
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextValidator
                            label="UniqueId "
                            onChange={handleChange}
                            name="UniqueId"
                            value={initialData.UniqueId}
                            validators={['required']}
                            errorMessages={['This field is required']}
                            size="small"
                            variant="filled"
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={4}>
                        <TextValidator
                            // select
                            // name="AssetType"
                            // value={initialData.AssetType}
                            // onChange={handleChange}
                            // validators={['required']}
                            // errorMessages={['This field is required']}
                            // fullWidth
                            // size="small"
                            // fullWidth
                            select
                            label="AssetType"
                            onChange={handleChange}
                            name="AssetType"
                            value={initialData.AssetType}
                            validators={['required']}
                            errorMessages={['This field is required']}
                            size="small"
                            fullWidth
                            variant="filled"
                        // style={{ marginTop: '9px' }}
                        >
                            <MenuItem value="Vehicle" >Vehicle</MenuItem>
                            <MenuItem value="Tank">Tank</MenuItem>
                            <MenuItem value="Generator" >Generator</MenuItem>
                            <MenuItem value="Equipment">Equipment</MenuItem>
                        </TextValidator>
                    </Grid>
                    <Grid item xs={4}>
                        <TextValidator
                            label="Asset Description"
                            onChange={handleChange}
                            name="AssetDescription"
                            value={initialData.AssetDescription}
                            errorMessages={['This field is required']}
                            size="small"
                            variant="filled"
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextValidator
                            label="Capacity"
                            onChange={handleChange}
                            name="Capacity"
                            value={initialData.Capacity}
                            errorMessages={['This field is required']}
                            size="small"
                            variant="filled"
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <Autocomplete
                            multiple
                            options={productList}
                            getOptionLabel={(option) => option.Name}
                            value={productList.filter((product) =>
                                initialData.ProductFIds && initialData.ProductFIds.includes(product.Id)
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
                    </Grid>

                    <Grid item xs={4}>

                        <TextValidator
                            // select
                            // name="Status"
                            // value={initialData.Status}
                            // onChange={handleChange}
                            // validators={['required']}
                            // errorMessages={['This field is required']}
                            // fullWidth
                            // size="small"
                            select
                            label="Status"
                            onChange={handleChange}
                            name="Status"
                            value={initialData.Status}
                            validators={['required']}
                            errorMessages={['This field is required']}
                            size="small"
                            fullWidth
                            variant="filled"
                        >
                            <MenuItem value="Active" >Active</MenuItem>
                            <MenuItem value="Inactive">Inactive</MenuItem>
                        </TextValidator>
                    </Grid>
                    {/* <Grid item xs={4}>
                        <TextValidator
                            label="AssetCategory "
                            onChange={handleChange}
                            name="AssetCategory"
                            value={initialData.AssetCategory}
                            // disabled={disabled}
                            validators={['required']}
                            errorMessages={['This field is required']}
                            size="small"
                            variant="filled"
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={4}>
                        <TextValidator
                            label="AssetMake "
                            onChange={handleChange}
                            name="AssetMake"
                            value={initialData.AssetMake}
                            // disabled={disabled}
                            validators={['required']}
                            errorMessages={['This field is required']}
                            size="small"
                            variant="filled"
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={4}>
                        <TextValidator
                            label="AssetModel "
                            onChange={handleChange}
                            name="AssetModel"
                            value={initialData.AssetModel}
                            // disabled={disabled}
                            validators={['required']}
                            errorMessages={['This field is required']}
                            size="small"
                            variant="filled"
                            fullWidth
                        />
                    </Grid> */}


                </Grid>
                <Grid container justifyContent="flex-end" mt={2}>
                    <Button
                        type="submit"
                        name="Confirm"
                        variant='contained'

                    />
                </Grid>
            </ValidatorForm>
        </Box>
    )
}

export default CustomerAssestForm