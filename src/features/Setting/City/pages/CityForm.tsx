import React, { useEffect, useState } from 'react'
import { Box, FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material'
import Button from 'components/Button/Button'
import { useAppDispatch, useAppSelector } from 'hooks/useStore'
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator'
import { toast } from 'react-toastify'
import { addCity, listCity, updateCity } from 'store/slices/citySlice'
import { stateList } from 'store/slices/stateSlice'
import { shallowEqual } from 'react-redux'
import FallbackLoader from 'components/React/FallBackLoader/FallBackLoader'

interface Props {
    editData?: any;
    setEditData?: any;
    backToList?: any;
}

const cityInitialValues = {
    StateFId: '',
    Name: '',
}

const CityForm = (props: Props) => {

    const [initialData, setInitialData] = useState<typeof cityInitialValues>({
        ...cityInitialValues
    });

    const dispatch = useAppDispatch();

    const [cityList, addCityLoading] = useAppSelector(
        (state) => [
            state.cityReducers.cityList,
            state.cityReducers.addCityLoading
        ],
        shallowEqual
    );

    useEffect(() => {
        if (props.editData) {
            setInitialData(props.editData)
        } else {
            setInitialData(cityInitialValues)
        }
    }, [props.editData])

    console.log({ CITY: props.editData })

    const handleChange = (event: any) => {
        const { name, value } = event.target;
        setInitialData({ ...initialData, [name]: value });
    }

    useEffect(() => {
        dispatch(stateList());
    }, []);
    const [stateListData, stateDataLoading] = useAppSelector(
        (state) => [
            state.stateReducers.stateListData,
            state.stateReducers.stateDataLoading,
        ],
        shallowEqual
    );
    console.log(stateListData);

    if (stateDataLoading) {
        return <div style={{ height: 'auto', marginTop: '3rem', marginBottom: '3rem' }}>
            <FallbackLoader />
        </div>;
    }

    const handleSubmit = async () => {
        try {
            if (props.editData) {
                const action = await dispatch(updateCity({
                    city_id: props.editData.Id,
                    ...initialData
                }));
                setInitialData({ ...cityInitialValues });
                const response = action.payload;
                props.setEditData(null);
                props.backToList();
                if (response.message.code === 'SUCCESS') {
                    dispatch(listCity())
                    toast.success(response.message.message);
                }
                if (response.message.code === "FAILED") {
                    toast.error(response.message.message);
                  }
            } else {
                const action = await dispatch(addCity(initialData));
                setInitialData({ ...cityInitialValues });
                const response = action.payload;
                props.backToList();
                if (response.message.code === 'SUCCESS') {
                    toast.success(response.message.message);
                    dispatch(listCity())
                }
                if (response.message.code === "FAILED") {
                    toast.error(response.message.message);
                  }
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    }
    return (
        <Box>
            <ValidatorForm onSubmit={handleSubmit} autoComplete="off">
                <Grid container spacing={2} mt={2}>
                    <Grid item xs={12} sm={6}>
                        <TextValidator
                            select
                            label="State Name"
                            name="StateFId"
                            value={initialData.StateFId}
                            onChange={handleChange}
                            validators={['required']}
                            errorMessages={['This field is required']}
                            fullWidth
                            size="small"
                            variant="filled"
                        >
                            {stateListData.map((state: any) => (
                                <MenuItem key={state.Id} value={state.Id}>{state.Name}</MenuItem>
                            ))}
                        </TextValidator>
                    </Grid>
                    <Grid item xs={12} sm={6} >
                        <TextValidator
                            label="City Name"
                            onChange={handleChange}
                            name="Name"
                            value={initialData.Name}
                            validators={['required']}
                            errorMessages={['This field is required']}
                            sx={{ width: '100%' }}
                            size="small"
                            variant="filled"
                        />
                    </Grid>
                </Grid>
                <Grid container justifyContent="flex-end" mt={2}>
                    <Button
                        type="submit"
                        name="Save"
                        variant='contained'
                        loading={addCityLoading}
                        disabled={addCityLoading}
                    />
                </Grid>
            </ValidatorForm>
        </Box>
    )
}

export default CityForm;