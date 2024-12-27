import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from 'components/Button/Button';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { boxStyles, containerStyles } from './styles';
import { useAppDispatch } from 'hooks/useStore';
import { signup } from 'store/slices/signupSlice';

interface Props {

}

const signupInitialValues = {
  username: '',
  phone_number: '',
  email: '',
  password: '',
  role: 'admin',
  full_name: '',
}

const SignupPage = (props: Props) => {
  const dispatch = useAppDispatch();
  const [isLoader, setIsLoader] = React.useState(false);
  const [initialData, setInitialData] = React.useState<typeof signupInitialValues>({
    ...signupInitialValues,
  });

  const navigate = useNavigate();

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setInitialData({ ...initialData, [name]: value });
  }

  const handleSubmit = async () => {
    const params: any = {
      username: initialData.username,
      phone_number: initialData.phone_number,
      email: initialData.email,
      password: initialData.password,
      full_name: initialData.full_name,
      // role: 'admin',
    }

    try {
      const action = await dispatch(signup(params));
      const response = action.payload;
      // const successMessage = response?.message ? JSON.stringify(response.message) : '';
      // const formattedSuccessMessage = successMessage.replace(/[\[\]"]+/g, '');
      toast.success("Signup successfully..");
      navigate('/');
    }
    catch (error) {
      console.log("Error from server:", error);
      toast.error("Oops! something went wrong");

    }
  }

  return (
    <Container component="main" maxWidth="xs"
      sx={containerStyles}>
      <CssBaseline />
      <Box
        sx={boxStyles}>
        <Typography component="p" variant="h5"

          sx={{ mt: 2, mb: 1, fontSize: '1.2rem' }}
        >
          American Petroleum
        </Typography>
        <Typography component="h1" variant="h5"

          sx={{
            letterSpacing: '.07em',
            fontWeight: '700'
          }}
        >
          Configuration
        </Typography>
        <ValidatorForm onSubmit={handleSubmit} style={{ width: '100%' }} autoComplete="off" >
          <TextValidator
            label="Username"
            onChange={handleChange}
            name="username"
            value={initialData.username}
            validators={['required']}
            errorMessages={['This field is required']}
            sx={{ width: '100%', mt: 2 }}
          />
          <TextValidator
            label="Full Name"
            onChange={handleChange}
            name="full_name"
            value={initialData.full_name}
            validators={['required']}
            errorMessages={['This field is required']}
            sx={{ width: '100%', mt: 2 }}
          />
          <TextValidator
            label="Phone"
            onChange={handleChange}
            name="phone_number"
            type='number'
            value={initialData.phone_number}
            validators={['required']}
            errorMessages={['This field is required']}
            sx={{ width: '100%', mt: 2 }}
          />
          <TextValidator
            label="Email"
            onChange={handleChange}
            name="email"
            value={initialData.email}
            validators={['required', 'isEmail']}
            errorMessages={['This field is required', 'Email is not valid']}
            sx={{ width: '100%', mt: 2 }}
          />
          <TextValidator
            label="Password"
            onChange={handleChange}
            name="password"
            type="password"
            value={initialData.password}
            validators={['required']}
            errorMessages={['This field is required']}
            sx={{ width: '100%', mt: 2 }}
          />

          <Grid sx={{ mt: 3 }}>
            <Button
              type="submit"
              name="Sign UP"
              variant='contained'
              fullWidth
              loading={isLoader}
              disabled={isLoader}
              className='login__btn'
            />
          </Grid>
        </ValidatorForm>
        <Grid container sx={{ mt: 2 }}>
          <Grid item>
            <Link component={RouterLink} to="/" variant="body2">
              {"Already have an account? Sign in"}
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default SignupPage;