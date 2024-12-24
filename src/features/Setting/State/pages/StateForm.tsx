import { Box, Grid } from '@mui/material';
import Button from 'components/Button/Button';
import { useAppDispatch, useAppSelector } from 'hooks/useStore';
import { authHeader } from 'modules/authHeader';
import { useEffect, useState } from 'react';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { shallowEqual } from 'react-redux';
import { toast } from 'react-toastify';
import { stateList, stateAdd, statePut } from 'store/slices/stateSlice';

interface Props {
  editData?: any;
  setEditData?: any;
  backToList?: any;
}

const stateInitialValues = {
  Name: '',
  Symbol: '',
}

const StateForm = (props: Props) => {

  const [initialData, setInitialData] = useState<typeof stateInitialValues>({
    ...stateInitialValues
  });

  const dispatch = useAppDispatch();

  const [stateListData, stateLoading] = useAppSelector(
    (state) => [
      state.stateReducers.stateListData,
      state.stateReducers.stateLoading
    ],
    shallowEqual
  );

  useEffect(() => {
    if (props.editData) {
      setInitialData(props.editData);
    } else {
      setInitialData(stateInitialValues)
    }
  }, [props.editData]);

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setInitialData({ ...initialData, [name]: value });
  }

  const handleSubmit = async () => {

    try {
      if (props.editData) {
        const action = await dispatch(statePut({
          state_id: props.editData.Id,
          ...initialData
        }));
        setInitialData({ ...stateInitialValues });
        const response = action.payload;
        toast.success(response.message.message);
        props.setEditData(null);
        props.backToList();
        if (response.message.code === "SUCCESS") {
          dispatch(stateList())
        }
      } else {
        const action = await dispatch(stateAdd(initialData));
        setInitialData({ ...stateInitialValues });
        const response = action.payload;
        props.backToList();
        toast.success(response.message.message);
        if (response.message.code === "SUCCESS") {
          // dispatch(stateList())
          await dispatch(stateList());
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
          <Grid item xs={12} sm={6}>
            <TextValidator
              label="State Name"
              onChange={handleChange}
              name="Name"
              value={initialData.Name}
              validators={['required']}
              errorMessages={['This field is required']}
              sx={{ width: '100%', mt: 3, }}
              size="small"
              variant="filled"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextValidator
              label="Symbol"
              onChange={handleChange}
              name="Symbol"
              value={initialData.Symbol}
              validators={['required']}
              errorMessages={['This field is required']}
              sx={{ width: '100%', mt: 3, }}
              size="small"
              variant="filled"
              fullWidth
            />
          </Grid>
        </Grid>
        <Grid container justifyContent="flex-end" mt={2}>
          <Button
            type="submit"
            name="Save"
            variant='contained'
            loading={stateLoading}
            disabled={stateLoading}
          />
        </Grid>
      </ValidatorForm>
    </Box>
  )
}

export default StateForm;