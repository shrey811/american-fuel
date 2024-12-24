import { Box, Grid } from '@mui/material';
import Button from 'components/Button/Button';
import { useAppDispatch, useAppSelector } from 'hooks/useStore';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { shallowEqual } from 'react-redux';
import { toast } from 'react-toastify';
import { addTaxRate, listTaxRate, updateTaxRate } from 'store/slices/taxRateSlice';


interface Props {
    editData?: any;
    setEditData?: any;
    backToList?: any;
}

interface TaxRate {
    EffectiveDateTime: string;
    TaxName: string;
    TaxRate: number;
    TaxUnitType: string;
    TaxUnit: string;
}

const taxRateInitialValues: TaxRate = {
    EffectiveDateTime: '',
    TaxName: '',
    TaxRate: 0,
    TaxUnitType: '',
    TaxUnit: '',
}
const TaxRateForm = (props: Props) => {

    const [initialData, setInitialData] = useState<TaxRate>({ ...taxRateInitialValues });
    const [forms, setForms] = useState<TaxRate[]>([]); // State to manage multiple forms
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (props.editData) {
            setInitialData({
                ...props.editData,
                EffectiveDateTime: moment.utc(props.editData.EffectiveDateTime).format('YYYY-MM-DDTHH:mm')
            });
        } else {
            setInitialData({ ...taxRateInitialValues, EffectiveDateTime: moment().toISOString().slice(0, 16) });
        }
    }, [props.editData]);

    const handleAddForm = () => {
        setForms([...forms, { ...taxRateInitialValues }]);
    };

    const handleRemoveForm = (index: number) => {
        const updatedForms = [...forms];
        updatedForms.splice(index, 1);
        setForms(updatedForms);
    };

    const handleChange = (event: any) => {
        const { name, value } = event.target;
        setInitialData({ ...initialData, [name]: value });
    }

    const handleSubmit = async () => {

        try {
            if (props.editData) {
                const action = await dispatch(updateTaxRate({
                    taxrate_id: props.editData.Id,
                    ...initialData
                }));
                setInitialData({ ...taxRateInitialValues });
                const response = action.payload;
                toast.success(response.message.message);
                props.setEditData(null);
                props.backToList();
                if (response.message.code === "SUCCESS") {
                    dispatch(listTaxRate())
                }
            } else {
                const action = await dispatch(addTaxRate(initialData));
                setInitialData({ ...taxRateInitialValues });
                const response = action.payload;
                props.backToList();
                toast.success(response.message.message);
                if (response.message.code === "SUCCESS") {
                    // dispatch(stateList())
                    await dispatch(listTaxRate());
                }
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    }
    return (
        <Box>
            <ValidatorForm onSubmit={handleSubmit} autoComplete="off">
                <Grid container spacing={1} mt={1}>
                    <Grid item xs={12} sm={4}>
                        <TextValidator
                            label="Effective Date"
                            onChange={(e) => setInitialData({ ...initialData, EffectiveDateTime: e.target.value })}
                            name="EffectiveDateTime"
                            type="datetime-local"
                            value={initialData.EffectiveDateTime}
                            size="small"
                            variant="filled"
                            disabled={!!props.editData}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextValidator
                            label="Name"
                            onChange={handleChange}
                            name="TaxName"
                            value={initialData.TaxName}
                            validators={['required']}
                            errorMessages={['This field is required']}
                            size="small"
                            variant="filled"
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextValidator
                            label="Rate"
                            onChange={handleChange}
                            name="TaxRate"
                            value={initialData.TaxRate}
                            validators={['required']}
                            errorMessages={['This field is required']}
                            size="small"
                            variant="filled"
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextValidator
                            label="Unit"
                            onChange={handleChange}
                            name="TaxUnit"
                            value={initialData.TaxUnit}
                            validators={['required']}
                            errorMessages={['This field is required']}
                            size="small"
                            variant="filled"
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextValidator
                            label="Unit Type"
                            onChange={handleChange}
                            name="TaxUnitType"
                            value={initialData.TaxUnitType}
                            validators={['required']}
                            errorMessages={['This field is required']}
                            size="small"
                            variant="filled"
                            fullWidth
                        />
                    </Grid>
                    <Grid container justifyContent="flex-end" mt={2}>
                        <Button
                            type="submit"
                            name="Save"
                            variant='contained'
                        // loading={stateLoading}
                        // disabled={stateLoading}
                        />
                    </Grid>
                </Grid>
            </ValidatorForm>
        </Box>

    )
}

export default TaxRateForm