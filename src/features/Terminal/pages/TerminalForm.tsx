import { Autocomplete, Box, Grid, MenuItem, TextField } from '@mui/material';
import Button from 'components/Button/Button';
import { useEffect, useState } from 'react';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { shallowEqual } from 'react-redux';
import { toast } from 'react-toastify';
import { listCityState } from 'store/slices/cityStateSlice';
import { stateList } from 'store/slices/stateSlice';
import { addTerminal, listAllTerminal, updateTerminal } from 'store/slices/terminalSlice';
import { useAppDispatch, useAppSelector } from 'hooks/useStore';

interface Props {
  editData?: any;
  setEditData?: any;
  backToList?: any;
}

const TerminalInitialValues = {
  Name: '',
  Number: '',
  Address: '',
  Zip: '',
  CityFId: 0,
  StatesFId: 0,
};

const TerminalForm = (props: Props) => {
  const dispatch = useAppDispatch();

  // Initialize state inside the component
  const [initialTerminalData, setInitialTerminalData] = useState<typeof TerminalInitialValues>(TerminalInitialValues);

  const [stateListData, stateDataLoading] = useAppSelector(
    (state) => [state.stateReducers.stateListData, state.stateReducers.stateDataLoading],
    shallowEqual
  );

  const [listCityies, listCityStateLoading] = useAppSelector(
    (state) => [state.cityStateReducers.cityStateList, state.cityStateReducers.listCityStateLoading],
    shallowEqual
  );

  useEffect(() => {
    dispatch(stateList());
  }, []);

  useEffect(() => {
    if (props.editData) {
      setInitialTerminalData(props.editData);
    } else {
      // Reset form state when creating a new terminal
      setInitialTerminalData(TerminalInitialValues);
    }
  }, [props.editData]);

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setInitialTerminalData({ ...initialTerminalData, [name as any]: value });

    if (name === 'StatesFId') {
      dispatch(listCityState(value as string)); // Ensure value type is correct based on your state slice
    }
  };

  const handleEditState = () => {
    if (props.editData) {
      return stateListData.find(item => item.Id === initialTerminalData.StatesFId) || null;
    } else {
      return initialTerminalData.StatesFId ? stateListData.find(item => item.Id === initialTerminalData.StatesFId) || null : null;
    }
  }

  const handleEditCity = () => {
    if (props.editData) {
      return listCityies.find(item => item.Id === initialTerminalData.CityFId) || null;
    } else {
      return initialTerminalData.CityFId ? listCityies.find(item => item.Id === initialTerminalData.CityFId) || null : null;
    }
  }

  const handleSubmit = async () => {
    try {
      if (props.editData) {
        const action = await dispatch(updateTerminal({ terminalId: props.editData.Id, ...initialTerminalData }));
        setInitialTerminalData(TerminalInitialValues); // Reset form state after editing
        const response = action.payload;
        props.setEditData(null);
        props.backToList();
        if (response.message.code === 'SUCCESS') {
          dispatch(listAllTerminal());
        }
      } else {
        const action = await dispatch(addTerminal({ ...initialTerminalData }));
        setInitialTerminalData(TerminalInitialValues); // Reset form state after creating
        const response = action.payload;
        props.backToList();
        toast.success(response.message.message);
        if (response.message.code === 'SUCCESS') {
          dispatch(listAllTerminal());
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box>
      <ValidatorForm onSubmit={handleSubmit} autoComplete="off">
        <Grid container spacing={1} mt={1}>
          <Grid item xs={12} sm={6}>
            <TextValidator
              label="Name"
              onChange={handleChange}
              name="Name"
              value={initialTerminalData.Name}
              size="small"
              variant="filled"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextValidator
              label="Number"
              onChange={handleChange}
              name="Number"
              value={initialTerminalData.Number}
              size="small"
              variant="filled"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextValidator
              label="Address"
              onChange={handleChange}
              name="Address"
              value={initialTerminalData.Address}
              size="small"
              variant="filled"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextValidator
              label="Zip"
              onChange={handleChange}
              name="Zip"
              value={initialTerminalData.Zip}
              size="small"
              variant="filled"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Autocomplete

              fullWidth
              options={stateListData}
              getOptionLabel={(option) => option.Name}
              value={handleEditState()}
              onChange={(event, value) => handleChange({ target: { name: "StatesFId", value: value ? value.Id : '' } })}
              renderInput={(params) => <TextField
                {...params}
                label="State"
                variant="filled"
                size="small"
                onChange={handleChange}
                value={initialTerminalData.StatesFId}
                name="StatesFId" />
              }
            />
            {/* <TextValidator
              select
              label="State"
              name="StatesFId"
              value={initialTerminalData.StatesFId}
              onChange={handleChange}
              validators={['required']}
              errorMessages={['This field is required']}
              fullWidth
              size="small"
              variant="filled"
            >
              {stateListData.map((state: any) => (
                <MenuItem key={state.Id} value={state.Id}>
                  {state.Name}
                </MenuItem>
              ))}
            </TextValidator> */}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              fullWidth
              options={listCityies}
              getOptionLabel={(option) => option.Name}
              value={handleEditCity()}
              onChange={(event, value) => handleChange({ target: { name: "CityFId", value: value ? value.Id : '' } })}
              renderInput={(params) => <TextField
                {...params}
                label="City"
                variant="filled"
                size="small"
                onChange={handleChange}
                value={initialTerminalData.CityFId}
                name="CitiesFId" />
              }
            />
            {/* <TextValidator
              select
              label="City"
              name="CityFId"
              value={initialTerminalData.CityFId}
              onChange={handleChange}
              validators={['required']}
              errorMessages={['This field is required']}
              fullWidth
              size="small"
              variant="filled"
            >
              {listCityies.map((city: any) => (
                <MenuItem key={city.Id} value={city.Id}>
                  {city.Name}
                </MenuItem>
              ))}
            </TextValidator> */}
          </Grid>
          <Grid container justifyContent="flex-end" mt={2}>
            <Button
              type="submit"
              name="Save"
              variant='contained'
            />
          </Grid>
        </Grid>
      </ValidatorForm>
    </Box>
  );
};

export default TerminalForm;