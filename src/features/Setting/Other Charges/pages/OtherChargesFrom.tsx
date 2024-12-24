import { Autocomplete, Box, Grid, TextField } from '@mui/material';
import Button from 'components/Button/Button';
import { useAppDispatch, useAppSelector } from 'hooks/useStore';
import React, { useEffect, useState } from 'react';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { shallowEqual } from 'react-redux';
import { toast } from 'react-toastify';
import { listAccount } from 'store/slices/accountSlice';
import { addAdditionalCharges, listAdditionalCharges, updateAdditionalCharges } from 'store/slices/additonalChargesSlice';

interface Props {
    editData?: any;
    setEditData?: any;
    backToList?: any;
}

const AdditionalChargesInitialValues = {
    Name: '',
    Price: 0,
    PA_Income_FId: 0,
    PA_Expense_FId: 0,
};

const OtherChargesFrom = (props: Props) => {
    const dispatch = useAppDispatch();

    const [initialAdditionalChargeaData, setInitialAdditionalChargesData] = useState<typeof AdditionalChargesInitialValues>({
        ...AdditionalChargesInitialValues,
    });

    const [additionalchargesList, addAdditionalchargesLoading] = useAppSelector(
        (state) => [
            state.additionalChargeReducers.additionalchargesList,
            state.additionalChargeReducers.addAdditionalchargesLoading,
        ],
        shallowEqual
    );

    const [accountListData, listAccountLoading] = useAppSelector(
        (state) => [
            state.accountReducers.accountListData,
            state.accountReducers.listAccountLoading,
        ],
        shallowEqual
    );

    useEffect(() => {
        dispatch(listAdditionalCharges());
        dispatch(listAccount());
    }, [dispatch]);

    const handleChange = (event: any) => {
        const { name, value } = event.target;
        setInitialAdditionalChargesData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleAutocompleteChange = (name: keyof typeof AdditionalChargesInitialValues, value: any) => {
        setInitialAdditionalChargesData((prevData) => ({
            ...prevData,
            [name]: value?.Id || 0, // Assuming value is an object with an Id property
        }));
    };

    useEffect(() => {
        if (props.editData) {
            setInitialAdditionalChargesData(props.editData);
        } else {
            setInitialAdditionalChargesData(AdditionalChargesInitialValues);
        }
    }, [props.editData]);

    const handleSubmitAdditionalCharges = async () => {
        try {
            if (props.editData) {
                const action = await dispatch(
                    updateAdditionalCharges({
                        additionalCharges_id: props.editData.Id,
                        ...initialAdditionalChargeaData,
                    })
                );
                console.log(initialAdditionalChargeaData);
                const response = action.payload;
                setInitialAdditionalChargesData({
                    ...AdditionalChargesInitialValues,
                });
                props.backToList();
                toast.success(response.message.message);
                if (response.message.code === 'SUCCESS') {
                    dispatch(listAdditionalCharges());
                }
            } else {
                const action = await dispatch(addAdditionalCharges(initialAdditionalChargeaData));
                console.log(initialAdditionalChargeaData);
                const response = action.payload;
                console.log({ response });
                setInitialAdditionalChargesData({
                    ...AdditionalChargesInitialValues,
                });
                props.backToList();
                toast.success(response.message.message);
                if (response.message.code === 'SUCCESS') {
                    dispatch(listAdditionalCharges());
                }
            }
        } catch (error) {
            toast.error('Something went wrong.');
        }
    };

    return (
        <Box>
            <ValidatorForm onSubmit={handleSubmitAdditionalCharges} autoComplete="off">
                <Grid container spacing={1} mt={1}>
                    <Grid item xs={6} sm={3}>
                        <TextValidator
                            label="Other Charges Name"
                            fullWidth
                            onChange={handleChange}
                            name="Name"
                            value={initialAdditionalChargeaData.Name}
                            size="small"
                            variant="filled"
                        />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <TextValidator
                            label="Rate"
                            fullWidth
                            type="number"
                            onChange={handleChange}
                            name="Price"
                            value={initialAdditionalChargeaData.Price}
                            size="small"
                            variant="filled"
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Autocomplete
                            options={accountListData}
                            getOptionLabel={(option) => option.Name || ''}
                            value={
                                accountListData.find((item) => item.Id === initialAdditionalChargeaData.PA_Income_FId) ||
                                null
                            }
                            onChange={(event, value) => handleAutocompleteChange('PA_Income_FId', value)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Income Account"
                                    fullWidth
                                    variant="filled"
                                    size="small"
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Autocomplete
                            options={accountListData}
                            getOptionLabel={(option) => option.Name || ''}
                            value={
                                accountListData.find((item) => item.Id === initialAdditionalChargeaData.PA_Expense_FId) ||
                                null
                            }
                            onChange={(event, value) => handleAutocompleteChange('PA_Expense_FId', value)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Expense Account"
                                    fullWidth
                                    variant="filled"
                                    size="small"
                                />
                            )}
                        />
                    </Grid>
                </Grid>
                <Grid container justifyContent="flex-end" mt={2}>
                    <Button
                        type="submit"
                        name="Save"
                        variant="contained"
                        loading={addAdditionalchargesLoading}
                        disabled={addAdditionalchargesLoading}
                    />
                </Grid>
            </ValidatorForm>
        </Box>
    );
};

export default OtherChargesFrom;